#!/bin/bash
# todo-asterisk-bullet_common.sh (수정 버전)
# 상태 순환 공통 함수 (번호 기반, 정규표현식 제거)
# yq(https://github.com/mikefarah/yq) 필요

YAML_PATH="$(dirname "$0")/todo-asterisk-bullet_config.yml"

# 상태 번호 → 토큰
get_state_token() {
  local idx="$1"
  yq ".states[\"$idx\"]" "$YAML_PATH" | sed 's/^"\(.*\)"$/\1/'
}

# 전체 상태 개수(0~N)
get_state_count() {
  yq '.states | length' "$YAML_PATH"
}

# 줄에서 상태 번호 추출 (토큰이 없으면 0)
get_state_index() {
  local line="$1"
  local count
  count=$(get_state_count)
  local trimmed="$(echo "$line" | sed -E 's/^([[:space:]]*)//')"
  for ((i=1; i<count; i++)); do
    local token
    token=$(get_state_token "$i")
    if [[ -z "$token" ]]; then
      continue
    fi
    # 문자 단위(공백 무시)로 입력값 맨 앞에 토큰이 존재하는지 체크
    local s="$trimmed"
    local t="$token"
    local idx=0
    local j=0
    while [[ $j -lt ${#t} && $idx -lt ${#s} ]]; do
      local c1="${t:$j:1}"
      local c2="${s:$idx:1}"
      if [[ "$c1" == "$c2" ]]; then
        ((j++))
        ((idx++))
      elif [[ "$c1" =~ [[:space:]] ]]; then
        ((j++))
      elif [[ "$c2" =~ [[:space:]] ]]; then
        ((idx++))
      else
        break
      fi
    done
    if [[ $j -eq ${#t} ]]; then
      echo "$i"
      return
    fi
  done
  echo "0"
}

# 상태 토큰 제거(번호 기반, 들여쓰기 보존)
remove_state_token() {
  local line="$1"
  local idx
  idx=$(get_state_index "$line")
  if [[ "$idx" == "0" ]]; then
    echo "$line"
    return
  fi
  local token
  token=$(get_state_token "$idx")
  local indent
  indent="$(echo "$line" | sed -E 's/^([[:space:]]*).*/\1/')"
  local trimmed
  trimmed="$(echo "$line" | sed -E 's/^([[:space:]]*)//')"
  
  # 상태 토큰 문자 단위로 입력값에서 제거(공백 무시)
  local s="$trimmed"
  local t="$token"
  local s_idx=0
  local t_idx=0
  while [[ $t_idx -lt ${#t} && $s_idx -lt ${#s} ]]; do
    local c1="${t:$t_idx:1}"
    local c2="${s:$s_idx:1}"
    if [[ "$c1" == "$c2" ]]; then
      ((t_idx++))
      ((s_idx++))
    elif [[ "$c1" =~ [[:space:]] && "$c2" =~ [[:space:]] ]]; then
      ((t_idx++))
      ((s_idx++))
    elif [[ "$c1" =~ [[:space:]] ]]; then
      ((t_idx++))
    elif [[ "$c2" =~ [[:space:]] ]]; then
      ((s_idx++))
    else
      break
    fi
  done
  local content="${s:$s_idx}"
  # 앞쪽 공백만 제거 (뒤쪽은 보존)
  content="$(echo "$content" | sed -E 's/^[[:space:]]*//')"
  echo "${indent}${content}"
}

# 상태 토큰 교체(번호 기반, 들여쓰기/본문 보존)
replace_state_token() {
  local line="$1"
  local new_idx="$2"
  local indent
  indent="$(echo "$line" | sed -E 's/^([[:space:]]*).*/\1/')"
  local content_with_indent
  content_with_indent="$(remove_state_token "$line")"
  # 들여쓰기 제거해서 순수 content만 추출
  local content="$(echo "$content_with_indent" | sed -E 's/^[[:space:]]*//')"
  
  local token
  token=$(get_state_token "$new_idx")
  if [[ "$token" == '""' || "$token" == "" ]]; then
    # 일반 텍스트 - 들여쓰기 + content
    echo "${indent}${content}"
  else
    # 토큰 + 공백 + content
    echo "${indent}${token} ${content}"
  fi
}

# 다음 상태 번호 (forward) - 수정
get_next_index() {
  local idx="$1"
  local count
  count=$(get_state_count)
  if [[ "$idx" -ge $((count-1)) ]]; then
    echo "0"  # 마지막 상태에서 일반 텍스트(0)로
  else
    echo $((idx+1))
  fi
}

# 이전 상태 번호 (backward) - 수정
get_prev_index() {
  local idx="$1"
  local count
  count=$(get_state_count)
  if [[ "$idx" -le 0 ]]; then
    echo $((count-1))  # 일반 텍스트(0)에서 마지막 상태로
  else
    echo $((idx-1))
  fi
}
