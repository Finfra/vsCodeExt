# Todo Asterisk Bullet - VSCode Extension

VSCode용 Todo Asterisk Bullet extension입니다. Markdown에서 asterisk bullet todo 상태를 순환하는 기능을 제공합니다.

## 🔄 상태 순환

```
Text → * [ ] → * [~] → * [v] → * [!] → * [>] → * [x] → * [?] → Text
```

| 표기  | 상태   |
| :---- | :----- |
| `[ ]` | 착수전 |
| `[~]` | 진행   |
| `[v]` | 완료   |
| `[!]` | 보류   |
| `[>]` | 위임   |
| `[x]` | 취소   |
| `[?]` | 모름   |

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

## 변경 이력

- 0.0.5 — 7단 순환으로 확장: `[!]` 보류·`[>]` 위임 분리, `[?]` 모름 추가
