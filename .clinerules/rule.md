# Todo Asterisk Bullet - 에디터 확장 개발 규칙
## 0. PRD파일 위치
../todo-asterisk-bullet/prd.md
## 1. 상태 순환 로직
- 순환 순서:  
  일반 텍스트 → `* [ ]` → `* [~]` → `* [v]` → `* [>]` → `* [x]` → 일반 텍스트
- 각 상태는 줄의 맨 앞(들여쓰기 이후)에 위치하며, 기존 텍스트는 변경하지 않는다.

## 2. 들여쓰기 및 텍스트 보존
- 기존 들여쓰기는 반드시 유지해야 한다.
- 할 일 내용(텍스트)은 상태 변경과 무관하게 보존되어야 한다.

## 3. 명령어 및 단축키
- 명령어: "Toggle Asterisk Bullet State" (플랫폼별 명령 팔레트/커맨드 시스템에 등록)
- 단축키:  
  - VSCode: Opt/Alt + Shift + Enter  
  - Obsidian: Opt/Alt + Shift + Enter  
  - Zed: Opt/Alt + Shift + Enter 

## 4. 멀티라인 지원
- VSCode: 멀티라인 선택 시 각 줄에 대해 상태 순환이 자동 적용되어야 한다.
- Obsidian: 현재 구현은 한 줄 단위로만 동작. 멀티라인 선택 시 각 줄에 대해 반복적으로 toggleTodoState를 호출해야 한다.
- Zed: 추후 구현 시 본 규칙을 동일하게 적용.

## 5. 기타
- 마크다운 문법을 해치지 않도록, 상태 토글 시 불필요한 공백이나 문법 오류가 발생하지 않도록 주의한다.
- 각 에디터의 플러그인/확장 구조 및 API 변경 시, 본 규칙을 참고하여 일관성 있게 유지보수한다.

## 6. 테스트 절차 및 예시
- shell에서 아래 명령어로 상태 순환 동작을 검증한다.

```sh
# 여러 줄 입력도 각 줄별로 독립적으로 처리됨을 보장해야 함
echo '입력값' | ./todo-asterisk-bullet/shell/todo-asterisk-bullet_forward.sh
```
예시:
```sh
echo '* [ ] dkfjdkf
jdk' | ./todo-asterisk-bullet/shell/todo-asterisk-bullet_forward.sh
```
기대 결과:
dkfjdkf
jdk

| 입력                | 기대 결과                |
|---------------------|-------------------------|
| *[ ] dkfjdkfjdk     | * [~] dkfjdkfjdk        |
| *[~] dkfjdkfjdk     | * [v] dkfjdkfjdk        |
| *[v] dkfjdkfjdk     | * [>] dkfjdkfjdk        |
| *[>] dkfjdkfjdk     | * [x] dkfjdkfjdk        |
| *[x] dkfjdkfjdk     | dkfjdkfjdk              |
| dkfjdkfjdk          | * [ ] dkfjdkfjdk        |
| *[*] dkfjdkfjdk     | * [ ] dkfjdkfjdk        |

- 정의되지 않은 상태 토큰(예: *[*])이 들어와도 기존 토큰을 모두 제거하고 새 상태 토큰만 남아야 한다.
- 들여쓰기, 본문 텍스트는 반드시 보존되어야 한다.
