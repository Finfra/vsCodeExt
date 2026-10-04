import { Plugin, Editor, MarkdownView, SettingTab, App, PluginSettingTab } from 'obsidian';

export default class TodoAsteriskBulletPlugin extends Plugin {
    // 상태 순환 정의
    private readonly STATES = ["[ ]", "[~]", "[v]", "[>]", "[x]"];
    private readonly STATE_REGEXES = [
        /^\s*[-*]\s*\[\s*\]\s*/,
        /^\s*[-*]\s*\[~\]\s*/,
        /^\s*[-*]\s*\[v\]\s*/i,
        /^\s*[-*]\s*\[[>!]\]\s*/, // [!] = 구 보류 표기(2026-10-04 이전) 호환
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

        // 단축키 등록 (Opt/Alt + Shift + Enter)
        this.addCommand({
            id: 'toggle-asterisk-bullet-hotkey',
            name: 'Toggle Asterisk Bullet',
            hotkeys: [{ modifiers: ['Alt', 'Shift'], key: 'Enter' }],
            editorCallback: (editor: Editor) => {
                this.toggleTodoState(editor);
            }
        });

        // 설정 탭 추가 (상태 순환 구조 및 사용법 안내)
        this.addSettingTab(new TodoAsteriskBulletSettingTab(this.app, this));
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

        // 상태 순환: Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text
        for (let i = 0; i < this.STATE_REGEXES.length; i++) {
            const regex = this.STATE_REGEXES[i];
            if (regex.test(line)) {
                // 현재 상태가 STATES[i]라면, 다음 상태로
                const textAfter = line.replace(regex, '').replace(/^\s+/, '');
                if (i < this.STATES.length - 1) {
                    // 상태 기호 뒤에 항상 한 칸 공백
                    newLine = indent + '* ' + this.STATES[i + 1] + ' ' + textAfter;
                } else {
                    // 마지막 상태면 일반 텍스트로(공백 없이)
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

        // 상태 기호 뒤에 항상 한 칸 공백이 있도록 보정 (단, 일반 텍스트는 예외)
        newLine = newLine.replace(/^(\s*\* \[[ ~v!x]\])(\S)/, '$1 $2');

        // 불필요한 중복 공백 제거
        newLine = newLine.replace(/ {2,}/g, ' ').replace(/\s+$/, '');

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

// 설정 탭: 플러그인 설정 화면에 설명/상태 순환/사용법 안내
class TodoAsteriskBulletSettingTab extends PluginSettingTab {
    plugin: TodoAsteriskBulletPlugin;

    constructor(app: App, plugin: TodoAsteriskBulletPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Todo Asterisk Bullet - 안내' });

        containerEl.createEl('p', { text: '마크다운에서 asterisk(*) 기반의 todo bullet 상태를 손쉽게 토글할 수 있는 플러그인입니다.' });

        containerEl.createEl('h3', { text: '상태 순환 구조' });
        containerEl.createEl('pre', { text: 'Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text' });

        containerEl.createEl('h3', { text: '주요 단축키' });
        containerEl.createEl('ul', {});
        const ul = containerEl.querySelector('ul');
        if (ul) {
            ul.createEl('li', { text: 'Opt+Shift+Enter (Mac)' });
            ul.createEl('li', { text: 'Alt+Shift+Enter (Windows/Linux)' });
            ul.createEl('li', { text: '명령어 팔레트: "Toggle Asterisk Bullet State"' });
        }

        containerEl.createEl('h3', { text: '기능 요약' });
        containerEl.createEl('ul', {});
        const ul2 = containerEl.querySelectorAll('ul')[1];
        if (ul2) {
            ul2.createEl('li', { text: '한 줄 단위로 상태 순환(멀티라인은 반복 호출 필요)' });
            ul2.createEl('li', { text: '들여쓰기 및 텍스트 보존' });
            ul2.createEl('li', { text: '하이픈 리스트(- [ ])도 지원' });
        }
    }
}
