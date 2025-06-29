#!/bin/bash
# todo-asterisk-bullet_forward.sh
# 입력된 각 줄의 상태를 다음 상태로 순환

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/todo-asterisk-bullet_common.sh"

process_input() {
  local input="$1"
  local idx=0
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ $idx -eq 0 ]]; then
      state_idx="$(get_state_index "$line")"
      next_idx="$(get_next_index "$state_idx")"
      echo "$(replace_state_token "$line" "$next_idx")"
    else
      echo "$line"
    fi
    ((idx++))
  done < <(printf "%s" "$input")
}

# 인자가 있으면 인자 처리, 없으면 stdin 처리
if [[ -n "$1" ]]; then
  process_input "$1"
else
  # stdin에서 전체 입력 읽기
  input=$(cat)
  if [[ -n "$input" ]]; then
    process_input "$input"
  fi
fi
