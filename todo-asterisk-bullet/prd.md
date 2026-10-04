# Todo Asterisk Bullet - PRD (Product Requirements Document)

## 1. 목적 및 개요
- 마크다운 문서에서 asterisk(*) 기반의 todo bullet 상태를 손쉽게 토글할 수 있는 에디터 확장(Obsidian, VSCode, Zed 등)을 제공한다.
- Obsidian, VSCode Markdown Todo 확장에서 영감을 받아, 직관적이고 반복적인 todo 상태 순환을 지원한다.

## 2. 주요 기능
- 명령어 또는 단축키로 현재 커서 위치 또는 선택된 여러 줄의 todo bullet 상태를 순환 토글한다.
- 상태 순환 로직:  
  Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text
- 여러 줄 선택 시, 각 줄에 대해 동일하게 상태를 순환 적용한다(플랫폼별 멀티라인 지원 방식은 하단 참고).
- 기존 들여쓰기 및 텍스트 내용은 그대로 보존한다.

## 3. 상태 순환 상세 로직
- 순환 순서:
  1. 일반 텍스트(아무것도 없는 줄) → `* [ ]`
  2. `* [ ]` → `* [~]`
  3. `* [~]` → `* [v]`
  4. `* [v]` → `* [>]`
  5. `* [>]` → `* [x]`
  6. `* [x]` → 일반 텍스트(asterisk bullet 및 상태 제거)
- 각 상태는 줄의 맨 앞(들여쓰기 이후)에 위치하며, 기존 텍스트는 변경하지 않는다.

## 4. 사용자 시나리오
- 명령어 또는 단축키로 "Toggle Asterisk Bullet State" 실행 시, 현재 줄 또는 선택 영역의 각 줄 상태가 순환된다.
- 여러 줄 선택 시, 각 줄별로 개별적으로 상태가 순환된다(플랫폼별 멀티라인 지원 방식은 하단 참고).

## 5. 예외 및 비고
- 들여쓰기가 있는 경우, 들여쓰기는 그대로 유지된다.
- 기존 텍스트(할 일 내용)는 상태 변경과 무관하게 보존된다.
- 마크다운 문법을 해치지 않도록, 상태 토글 시 불필요한 공백이나 문법 오류가 발생하지 않도록 한다.

## 6. 참고 (플랫폼별 차이)
- **VSCode**: 명령 팔레트(`Cmd+Shift+P`/`Ctrl+Shift+P`), 단축키(Opt/Alt+Shift+Enter), 멀티라인 선택 지원.
- **Obsidian**: 명령어, 단축키(Ctrl/Cmd+Shift+T), 현재 구현은 한 줄 단위(멀티라인은 반복 호출 필요).
- **Zed**: 추후 구현 시 본 로직 및 규칙을 동일하게 적용.

- 오픈 소스: https://github.com/Finfra/vsCodeExt/tree/main/todo-asterisk-bullet
- 개발자: NamJungGu(nowage@gmail.com) / Finfra Co., Ltd.
