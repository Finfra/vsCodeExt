import * as vscode from 'vscode';

const STATES = ["[ ]", "[~]", "[v]", "[!]", "[x]"];
const STATE_REGEXES = [
    /^\s*[-*]\s*\[\s*\]\s*/,
    /^\s*[-*]\s*\[~\]\s*/,
    /^\s*[-*]\s*\[v\]\s*/i,
    /^\s*[-*]\s*\[!\]\s*/,
    /^\s*[-*]\s*\[x\]\s*/i
];
const BULLET_REPLACE = /^\s*[-*]\s*/;
const INDENT_PATTERN = /^(\s*)/;

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('todoAsteriskBullet.toggleState', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        const selections = editor.selections;

        editor.edit(editBuilder => {
            for (const selection of selections) {
                const lineNumber = selection.active.line;
                const line = document.lineAt(lineNumber).text;

                const indentMatch = line.match(INDENT_PATTERN);
                const indent = indentMatch ? indentMatch[1] : '';

                let newLine = '';
                let matched = false;

                for (let i = 0; i < STATE_REGEXES.length; i++) {
                    const regex = STATE_REGEXES[i];
                    if (regex.test(line)) {
                        const textAfter = line.replace(regex, '');
                        if (i < STATES.length - 1) {
                            newLine = indent + '* ' + STATES[i + 1] + ' ' + textAfter;
                        } else {
                            newLine = indent + textAfter;
                        }
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    const textContent = line.replace(BULLET_REPLACE, '').replace(/^\s*/, '');
                    newLine = indent + '* [ ] ' + textContent;
                }

                editBuilder.replace(document.lineAt(lineNumber).range, newLine);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
