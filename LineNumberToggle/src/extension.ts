import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('line-number-toggle.toggle', () => {
        const config = vscode.workspace.getConfiguration('editor');
        const currentValue = config.get('lineNumbers');
        
        let newValue: string;
        if (currentValue === 'on') {
            newValue = 'off';
        } else {
            newValue = 'on';
        }
        
        config.update('lineNumbers', newValue, vscode.ConfigurationTarget.Global)
            .then(() => {
                vscode.window.showInformationMessage(`Line numbers are now ${newValue}`);
            });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {} 