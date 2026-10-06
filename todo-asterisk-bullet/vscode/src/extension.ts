import * as vscode from 'vscode';
import { nextLine } from './toggle';

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
                editBuilder.replace(document.lineAt(lineNumber).range, nextLine(line));
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
