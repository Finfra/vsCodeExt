import { Plugin, Editor, MarkdownView } from 'obsidian';

export default class TodoAsteriskBulletPlugin extends Plugin {
    // 상태 순환 정의
    private readonly STATES = ["[ ]", "[~]", "[v]", "[!]", "[x]"];
    private readonly STATE_REGEXES = [
        /^\s*[-*]\s*\[\s*\]\s*/,
        /^\s*[-*]\s*\[~\]\s*/,
        /^\s*[-*]\s*\[v\]\s*/i,
        /^\s*[-*]\s*\[!\]\s*/,
        /^\s*[-*]\s*\[x\]\s*/i
    ];
    private readonly BULLET_REPLACE = /^\s*[-*]\s*/;
    private readonly INDENT_PATTERN = /^(\s*)/;
    async onload() {
        // 명령어 등록
        this.addCommand({
            id: 'toggle-asterisk-bullet-state',
            name: 'Toggle Asterisk Bullet State',
            editorCallback: (editor: Editor) => {
                this.toggleTodoState(editor);
            }
        });

        // 단축키 등록 (Ctrl/Cmd + Shift + T)
        this.addCommand({
            id: 'toggle-asterisk-bullet-hotkey',
            name: 'Toggle Asterisk Bullet',
            hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 't' }],
            editorCallback: (editor: Editor) => {
                this.toggleTodoState(editor);
            }
        });
    }

    toggleTodoState(editor: Editor) {
        const cursor = editor.getCursor();
        const line = editor.getLine(cursor.line);
        const lineNumber = cursor.line;

        // 들여쓰기 추출
        const indentMatch = line.match(this.INDENT_PATTERN);
        const indent = indentMatch ? indentMatch[1] : '';

        let newLine = '';
        let matched = false;

        // 상태 순환: Text → * [ ] → * [~] → * [v] → * [!] → * [x] → Text
        for (let i = 0; i < this.STATE_REGEXES.length; i++) {
            const regex = this.STATE_REGEXES[i];
            if (regex.test(line)) {
                // 현재 상태가 STATES[i]라면, 다음 상태로
                const textAfter = line.replace(regex, '');
                if (i < this.STATES.length - 1) {
                    newLine = indent + '* ' + this.STATES[i + 1] + ' ' + textAfter;
                } else {
                    // 마지막 상태면 일반 텍스트로
                    newLine = indent + textAfter;
                }
                matched = true;
                break;
            }
        }
        if (!matched) {
            // Text 또는 일반 리스트 → * [ ]
            const textContent = line.replace(this.BULLET_REPLACE, '').replace(/^\s*/, '');
            newLine = indent + '* [ ] ' + textContent;
        }

        // 라인 교체
        editor.setLine(lineNumber, newLine);

        // 커서 위치 조정 (라인 끝으로)
        const newCursorPos = newLine.length;
        editor.setCursor(lineNumber, newCursorPos);
    }

    onunload() {
        // 플러그인 언로드 시 정리 작업
    }
}
