# Todo Asterisk Bullet - VSCode Extension

Cycle Markdown asterisk-bullet todo states with one shortcut.
단축키 하나로 마크다운 asterisk bullet todo 상태를 순환함.

## 🔄 State cycle · 상태 순환

```
* [ ] → * [~] → * [v] → * [>] → * [!] → * [x] → * [?] → * [ ] …
```

| Mark  | State       | 상태   |
| :---- | :---------- | :----- |
| `[ ]` | To do       | 착수전 |
| `[~]` | In progress | 진행   |
| `[v]` | Done        | 완료   |
| `[>]` | Delegated   | 위임   |
| `[!]` | On hold     | 보류   |
| `[x]` | Cancelled   | 취소   |
| `[?]` | Unknown     | 모름   |

* Plain text or a bullet without a checkbox (`* `, `- `) starts at `* [ ] ` (an `*emphasis*` sentence is not treated as a bullet).
  일반 텍스트·체크박스 없는 bullet(`* `·`- `)에서 누르면 `* [ ] ` 로 시작함(`*강조*` 문장은 bullet 로 보지 않음).
* After `[?]` it returns to `[ ]` — a 7-state loop that never goes back to plain text.
  `[?]` 다음은 `[ ]` 로 돌아감 — 7단계 순환이며 텍스트로 복귀하지 않음.
* Only the prefix (including the trailing space) is replaced in one edit, and the cursor moves right after it.
  접두(뒤 공백 포함)만 한 번에 교체하고 커서는 접두 바로 뒤로 이동함.
* The no-space `[]` form is also recognized as To do.
  붙여 쓴 `[]` 표기도 착수전으로 인식함.

## ✨ Features · 주요 기능

* Cycle the state from the Command Palette or a shortcut.
  명령 팔레트나 단축키로 상태를 순환함.
* With a multi-line selection, each line is cycled separately.
  여러 줄을 선택하면 줄마다 따로 순환함.
* Indentation and line text are preserved.
  들여쓰기와 본문 텍스트는 그대로 유지함.
* Hyphen lists (`- [ ]`) are supported and normalized to `* `.
  하이픈 리스트(`- [ ]`)도 지원하며 `* ` 로 정규화함.

## ⌨️ Shortcut · 단축키

| Platform · 플랫폼 | Key · 키               |
| :---------------- | :--------------------- |
| macOS             | **Option+Shift+Enter** |
| Windows / Linux   | **Alt+Shift+Enter**    |

* Also available as **"Toggle Asterisk Bullet State"** in the Command Palette.
  명령 팔레트의 **"Toggle Asterisk Bullet State"** 로도 실행할 수 있음.

## 📜 Changelog · 변경 이력

* **0.0.6**
  * To do mark is written `[ ]` (with a space) again; the legacy `[]` is still recognized.
    착수전 표기를 `[ ]`(공백 포함)로 되돌림 — 붙여 쓴 `[]` 도 계속 인식함.
* **0.0.5**
  * Extended to a 7-state cycle: added `[>]` Delegated, `[!]` On hold and `[?]` Unknown.
    7단계 순환으로 확장 — `[>]` 위임·`[!]` 보류·`[?]` 모름 추가.
  * To do mark changed from `[ ]` to `[]`; `[?]` loops back to `[]` (no return to plain text).
    착수전 표기를 `[ ]` → `[]` 로 변경, `[?]` 다음은 `[]` (텍스트 복귀 없음).
  * Prefix is replaced in a single edit, and the extension preloads on startup for a snappier first toggle.
    접두를 한 번에 교체하고, 시작 시 사전 로드해 첫 토글 지연을 없앰.
