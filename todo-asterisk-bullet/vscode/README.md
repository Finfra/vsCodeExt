# Todo Asterisk Bullet - VSCode Extension

VSCode용 Todo Asterisk Bullet extension입니다. Markdown에서 asterisk bullet todo 상태를 순환하는 기능을 제공합니다.

## 🔄 상태 순환

```
Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text
```

## 주요 기능

- 명령 팔레트 또는 단축키로 상태 순환
- 여러 줄 선택 시 각 줄별로 상태 순환 적용
- 들여쓰기 및 텍스트 보존

## 단축키

- **Opt+Shift+Enter** (Mac)
- **Alt+Shift+Enter** (Windows/Linux)
- 명령 팔레트에서 "Toggle Asterisk Bullet State"로도 사용 가능

## 기타

- Obsidian, Zed Extension과 동일한 상태 순환 로직을 사용합니다.
- 하이픈 리스트(`- [ ]`)도 지원합니다.
