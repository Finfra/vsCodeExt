# Todo Asterisk Bullet - Zed Extension

Zed용 Todo Asterisk Bullet extension입니다. Markdown에서 asterisk bullet todo 상태를 순환하는 기능을 제공합니다.

## 🔄 상태 순환

```
Text → * [ ] → * [~] → * [v] → * [!] → * [x] → Text
```

## 주요 기능

- slash command(`/todo`)로 상태 순환
- 키보드 단축키(Opt+Shift+Enter, keymap.json에서 수동 설정)와 조합 가능
- 여러 줄 선택 시 각 줄별로 상태 순환 적용
- 들여쓰기 및 텍스트 보존

## 단축키 및 사용법

- **Opt+Shift+Enter** (Mac, keymap.json에서 수동 설정)
- **Alt+Shift+Enter** (Windows/Linux, keymap.json에서 수동 설정)
- slash command `/todo` 입력 후 Enter

## 기타

- Obsidian, VSCode Extension과 동일한 상태 순환 로직을 사용합니다.
- 하이픈 리스트(`- [ ]`)도 지원합니다.
