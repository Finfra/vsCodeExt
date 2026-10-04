#!/bin/bash
# todo-asterisk-bullet_common.sh (가변 상태 지원 - 다중 패턴 매칭 버전)
# 상태 순환 공통 함수 - YAML 설정에 따라 동적으로 처리

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
YAML_PATH="$SCRIPT_DIR/todo-asterisk-bullet_config.yml"

# 전체 상태 개수
get_state_count() {
  yq '.states | length' "$YAML_PATH"
}

# 상태 번호 → 토큰
get_state_token() {
  local idx="$1"
  yq ".states[\"$idx\"]" "$YAML_PATH" | sed 's/^"\(.*\)"$/\1/'
}

# 토큰의 모든 가능한 변형 생성 (공백 있는/없는 버전)
generate_token_variants() {
  local token="$1"
  
  # 원본
  echo "$token"
  
  # 공백 제거 버전
  local no_space_version="$(echo "$token" | tr -d ' ')"
  if [[ "$no_space_version" != "$token" ]]; then
    echo "$no_space_version"
  fi
  
  # 구 보류 표기 [!] (2026-10-04 이전) 를 [>] 와 같은 상태로 인식
  if [[ "$token" == *"[>]"* ]]; then
    local legacy="${token//\[>\]/[!]}"
    echo "$legacy"
    echo "$legacy" | tr -d ' '
  fi

  # 추가 패턴들 (필요시)
  # 예: * [ ] -> *[ ], * [  ] 등
}

# 모든 상태 토큰을 길이 순으로 정렬해서 반환 (긴 것부터)
get_all_tokens_with_variants() {
  local count
  count=$(get_state_count)
  local result=""
  
  # 모든 토큰 수집 (0번 제외 - 빈 문자열)
  for ((i=1; i<count; i++)); do
    local token
    token=$(get_state_token "$i")
    if [[ -n "$token" && "$token" != '""' ]]; then
      # 각 토큰의 모든 변형 추가
      local variants
      variants=$(generate_token_variants "$token")
      while IFS= read -r variant; do
        if [[ -n "$variant" ]]; then
          if [[ -n "$result" ]]; then
            result="$result\n"
          fi
          result="${result}${#variant}:$i:$variant"
        fi
      done <<< "$variants"
    fi
  done
  
  # 토큰 길이 기준 내림차순 정렬 (긴 것부터)
  echo -e "$result" | sort -nr | cut -d: -f2-
}

# 줄에서 상태 번호 추출 (다중 패턴 매칭)
get_state_index() {
  local line="$1"
  
  # 들여쓰기 제거
  local trimmed="$(echo "$line" | sed -E 's/^[[:space:]]*//')"
  
  # 모든 토큰 변형을 길이 순으로 확인 (긴 것부터 우선 매칭)
  local sorted_tokens
  sorted_tokens=$(get_all_tokens_with_variants)
  
  while IFS=':' read -r idx variant; do
    if [[ -z "$variant" ]]; then
      continue
    fi
    
    # 정확한 문자열 매칭
    if [[ "$trimmed" == "$variant" ]]; then
      echo "$idx"
      return
    elif [[ "$trimmed" == "$variant "* ]]; then
      echo "$idx"
      return
    fi
  done <<< "$sorted_tokens"
  
  # 매칭되는 토큰이 없으면 일반 텍스트(0)
  echo "0"
}

# 실제 매칭된 토큰 변형 찾기
find_matched_variant() {
  local line="$1"
  local target_idx="$2"
  
  local trimmed="$(echo "$line" | sed -E 's/^[[:space:]]*//')"
  local sorted_tokens
  sorted_tokens=$(get_all_tokens_with_variants)
  
  while IFS=':' read -r idx variant; do
    if [[ "$idx" != "$target_idx" || -z "$variant" ]]; then
      continue
    fi
    
    # 정확한 문자열 매칭
    if [[ "$trimmed" == "$variant" ]]; then
      echo "$variant"
      return
    elif [[ "$trimmed" == "$variant "* ]]; then
      echo "$variant"
      return
    fi
  done <<< "$sorted_tokens"
}

# 상태 토큰 제거 (다중 패턴 매칭 기반)
remove_state_token() {
  local line="$1"
  local idx
  idx=$(get_state_index "$line")
  
  # 들여쓰기 추출
  local indent="$(echo "$line" | sed -E 's/^([[:space:]]*).*/\1/')"
  
  if [[ "$idx" == "0" ]]; then
    echo "$line"
    return
  fi
  
  # 실제 매칭된 변형 찾기
  local matched_variant
  matched_variant=$(find_matched_variant "$line" "$idx")
  
  if [[ -n "$matched_variant" ]]; then
    local trimmed="$(echo "$line" | sed -E 's/^[[:space:]]*//')"
    
    if [[ "$trimmed" == "$matched_variant" ]]; then
      # 토큰만 있는 경우
      echo "$indent"
    elif [[ "$trimmed" == "$matched_variant "* ]]; then
      # 토큰 + 공백 + 내용
      local token_with_space="$matched_variant "
      local content="${trimmed:${#token_with_space}}"
      echo "${indent}${content}"
    else
      echo "$line"
    fi
  else
    echo "$line"
  fi
}

# 상태 토큰 교체 (동적)
replace_state_token() {
  local line="$1"
  local new_idx="$2"
  
  # 들여쓰기 추출
  local indent="$(echo "$line" | sed -E 's/^([[:space:]]*).*/\1/')"
  
  # 토큰 제거해서 순수 content 추출
  local content_with_indent
  content_with_indent=$(remove_state_token "$line")
  local content="$(echo "$content_with_indent" | sed -E 's/^[[:space:]]*//')"
  
  local token
  token=$(get_state_token "$new_idx")
  
  if [[ "$token" == '""' || "$token" == "" ]]; then
    # 일반 텍스트
    echo "${indent}${content}"
  else
    # 토큰 + 공백 + content
    if [[ -n "$content" ]]; then
      echo "${indent}${token} ${content}"
    else
      echo "${indent}${token}"
    fi
  fi
}

# 다음 상태 번호 (forward) - 동적
get_next_index() {
  local idx="$1"
  local count
  count=$(get_state_count)
  
  # 순환: 0 → 1 → 2 → ... → (count-1) → 0
  if [[ "$idx" -ge $((count-1)) ]]; then
    echo "0"
  else
    echo $((idx+1))
  fi
}

# 이전 상태 번호 (backward) - 동적
get_prev_index() {
  local idx="$1"
  local count
  count=$(get_state_count)
  
  # 역순환: 0 → (count-1) → (count-2) → ... → 1 → 0
  if [[ "$idx" -le 0 ]]; then
    echo $((count-1))
  else
    echo $((idx-1))
  fi
}

# 디버깅용: 토큰 변형 확인
debug_token_variants() {
  echo "=== 토큰 변형 디버깅 ==="
  get_all_tokens_with_variants
}

# 디버깅용: 매칭 과정 출력
debug_pattern_matching() {
  local line="$1"
  local trimmed="$(echo "$line" | sed -E 's/^[[:space:]]*//')"
  
  echo "=== 다중 패턴 매칭 디버깅 ==="
  echo "입력: '$line'"
  echo "trimmed: '$trimmed'"
  echo ""
  
  local sorted_tokens
  sorted_tokens=$(get_all_tokens_with_variants)
  
  while IFS=':' read -r idx variant; do
    if [[ -z "$variant" ]]; then
      continue
    fi
    
    echo "토큰 [$idx] 변형: '$variant'"
    if [[ "$trimmed" == "$variant" ]]; then
      echo "  → 정확히 일치!"
      echo "결과: $idx"
      return
    elif [[ "$trimmed" == "$variant "* ]]; then
      echo "  → 접두사 일치!"
      echo "결과: $idx"
      return
    else
      echo "  → 불일치"
    fi
  done <<< "$sorted_tokens"
  
  echo "결과: 0 (일반 텍스트)"
}
