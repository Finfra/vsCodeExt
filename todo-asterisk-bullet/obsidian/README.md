# Todo Asterisk Bullet - Obsidian Plugin

Obsidian용 Todo Asterisk Bullet plugin입니다. Markdown에서 asterisk bullet todo 상태를 순환하는 기능을 제공합니다.

## 🔄 상태 순환

```
Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text
```

## 주요 기능

- 명령어 또는 단축키로 상태 순환
- 한 줄 단위로 상태 순환(멀티라인은 반복 호출 필요)
- 들여쓰기 및 텍스트 보존

## 단축키

- **Cmd+Shift+T** (Mac)
- **Ctrl+Shift+T** (Windows)
- 명령 팔레트에서 "Toggle Asterisk Bullet State"로도 사용 가능

## 기타

- VSCode, Zed Extension과 동일한 상태 순환 로직을 사용합니다.
- 하이픈 리스트(`- [ ]`)도 지원합니다.
