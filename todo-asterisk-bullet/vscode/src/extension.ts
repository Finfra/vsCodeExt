import * as vscode from 'vscode';
import { nextEdit } from './toggle';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('todoAsteriskBullet.toggleState', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const document = editor.document;
        // 같은 줄의 다중 커서는 한 번만 편집 (첫 커서 기준)
        const byLine = new Map<number, number>();
        for (const selection of editor.selections) {
            const ln = selection.active.line;
            if (!byLine.has(ln)) { byLine.set(ln, selection.active.character); }
        }

        const edits = [...byLine].map(([ln, col]) => ({ ln, e: nextEdit(document.lineAt(ln).text, col) }));

        // 접두만 한 번에 교체(공백 포함) → 커서를 새 접두 뒤로 직접 지정
        const ok = await editor.edit(editBuilder => {
            for (const { ln, e } of edits) {
                editBuilder.replace(new vscode.Range(ln, e.start, ln, e.end), e.text);
            }
        }, { undoStopBefore: true, undoStopAfter: true });
        if (!ok) { return; }

        editor.selections = edits.map(({ ln, e }) => new vscode.Selection(ln, e.cursor, ln, e.cursor));
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
