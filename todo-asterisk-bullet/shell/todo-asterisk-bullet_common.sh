#!/bin/bash
# todo-asterisk-bullet_common.sh (정규표현식 기반 단순화 버전)
# 상태 순환 공통 함수

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
YAML_PATH="$SCRIPT_DIR/todo-asterisk-bullet_config.yml"

# 상태 번호 → 토큰
get_state_token() {
  local idx="$1"
  yq ".states[\"$idx\"]" "$YAML_PATH" | sed 's/^"\(.*\)"$/\1/'
}

# 전체 상태 개수(0~N)
get_state_count() {
  yq '.states | length' "$YAML_PATH"
}

# 줄에서 상태 번호 추출 (정규표현식 기반)
get_state_index() {
  local line="$1"
  
  # 들여쓰기 제거
  local trimmed="$(echo "$line" | sed -E 's/^[[:space:]]*//')"
  
  # 각 상태 패턴 체크 (우선순위: 긴 패턴부터)
  if [[ "$trimmed" =~ ^\*[[:space:]]*\[x\] ]]; then
    echo "6"  # * [x]
  elif [[ "$trimmed" =~ ^\*[[:space:]]*\[!\] ]]; then
    echo "5"  # * [!]
  elif [[ "$trimmed" =~ ^\*[[:space:]]*\[v\] ]]; then
    echo "4"  # * [v]
  elif [[ "$trimmed" =~ ^\*[[:space:]]*\[~\] ]]; then
    echo "3"  # * [~]
  elif [[ "$trimmed" =~ ^\*[[:space:]]*\[[[:space:]]*\] ]]; then
    echo "2"  # * [ ]
  elif [[ "$trimmed" =~ ^\* ]]; then
    echo "1"  # *
  else
    echo "0"  # 일반 텍스트
  fi
}

# 상태 토큰 제거(정규표현식 기반)
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
  
  # 토큰 제거
  local content
  case "$idx" in
    6) content="$(echo "$line" | sed -E 's/^([[:space:]]*)\*[[:space:]]*\[x\][[:space:]]*/\1/')" ;;
    5) content="$(echo "$line" | sed -E 's/^([[:space:]]*)\*[[:space:]]*\[!\][[:space:]]*/\1/')" ;;
    4) content="$(echo "$line" | sed -E 's/^([[:space:]]*)\*[[:space:]]*\[v\][[:space:]]*/\1/')" ;;
    3) content="$(echo "$line" | sed -E 's/^([[:space:]]*)\*[[:space:]]*\[~\][[:space:]]*/\1/')" ;;
    2) content="$(echo "$line" | sed -E 's/^([[:space:]]*)\*[[:space:]]*\[[[:space:]]*\][[:space:]]*/\1/')" ;;
    1) content="$(echo "$line" | sed -E 's/^([[:space:]]*)\*[[:space:]]*/\1/')" ;;
    *) content="$line" ;;
  esac
  
  echo "$content"
}

# 상태 토큰 교체
replace_state_token() {
  local line="$1"
  local new_idx="$2"
  
  # 들여쓰기 추출
  local indent="$(echo "$line" | sed -E 's/^([[:space:]]*).*/\1/')"
  
  # 토큰 제거해서 순수 content 추출
  local content="$(remove_state_token "$line" | sed -E 's/^[[:space:]]*//')"
  
  local token
  token=$(get_state_token "$new_idx")
  
  if [[ "$token" == '""' || "$token" == "" ]]; then
    # 일반 텍스트
    echo "${indent}${content}"
  else
    # 토큰 + 공백 + content
    echo "${indent}${token} ${content}"
  fi
}

# 다음 상태 번호 (forward)
get_next_index() {
  local idx="$1"
  case "$idx" in
    0) echo "1" ;;   # 일반 → *
    1) echo "2" ;;   # * → * [ ]
    2) echo "3" ;;   # * [ ] → * [~]
    3) echo "4" ;;   # * [~] → * [v]
    4) echo "5" ;;   # * [v] → * [!]
    5) echo "6" ;;   # * [!] → * [x]
    6) echo "0" ;;   # * [x] → 일반
    *) echo "1" ;;   # 기본값
  esac
}

# 이전 상태 번호 (backward)
get_prev_index() {
  local idx="$1"
  case "$idx" in
    0) echo "6" ;;   # 일반 → * [x]
    1) echo "0" ;;   # * → 일반
    2) echo "1" ;;   # * [ ] → *
    3) echo "2" ;;   # * [~] → * [ ]
    4) echo "3" ;;   # * [v] → * [~]
    5) echo "4" ;;   # * [!] → * [v]
    6) echo "5" ;;   # * [x] → * [!]
    *) echo "0" ;;   # 기본값
  esac
}
