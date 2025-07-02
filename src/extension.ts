import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('FiveM Snipator Activated!');

  const disposable = vscode.commands.registerCommand('fivemsnipator.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World from FiveM Snipator!');
  });
  context.subscriptions.push(disposable);

  const registerSnippetProvider = (fileName: string) => {
    return vscode.languages.registerCompletionItemProvider(
      'lua',
      {
        provideCompletionItems(document, position) {
          console.log('Current languageId:', document.languageId);
          console.log('Current loc:', context.extensionPath);

          const snippetFile = path.join(context.extensionPath, 'src/snippets', fileName);
          const items: vscode.CompletionItem[] = [];

          try {
            if (fs.existsSync(snippetFile)) {
              const content = fs.readFileSync(snippetFile, 'utf8');
              const snippets = JSON.parse(content);

              for (const [name, snippet] of Object.entries<any>(snippets)) {
                const item = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet);
                item.detail = snippet.description || name;
                const body = Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body;
                item.insertText = new vscode.SnippetString(body);
                item.documentation = new vscode.MarkdownString(`**${name}**\n\n${snippet.description || ''}`);
                items.push(item);
              }
            } else {
              console.warn(`Snippet file not found: ${snippetFile}`);
            }
          } catch (err) {
            console.error('Error reading snippet file:', err);
          }

          return items;
        }
      },
      'e' // trigger character (you can customize)
    );
  };

  const esxSnippets = registerSnippetProvider('esxsnippets.json');
  const ncSnippets = registerSnippetProvider('nc.json');
  const qbSnippets = registerSnippetProvider('qb.json');

  context.subscriptions.push(esxSnippets, ncSnippets, qbSnippets);
}

export function deactivate() {}
