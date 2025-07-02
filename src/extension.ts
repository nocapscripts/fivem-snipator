import * as vscode from 'vscode';
import * as fs from 'fs/promises'; // use promise-based fs
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('FiveM Snipator Activated!');

  // Register a simple command to confirm activation
  const disposable = vscode.commands.registerCommand('fivemsnipator.init', () => {
    vscode.window.showInformationMessage('Extension is activated!');
  });
  context.subscriptions.push(disposable);

  // Helper to create snippet completion provider from a snippet JSON file
  const registerSnippetProvider = (fileName: string) => {
    return vscode.languages.registerCompletionItemProvider(
      'lua',
      {
        async provideCompletionItems(document, position) {
          console.log('Current languageId:', document.languageId);
          console.log('Extension path:', context.extensionPath);

          const snippetFile = path.join(context.extensionPath, 'src/snippets', fileName);
          const items: vscode.CompletionItem[] = [];

          try {
            // Check if snippet file exists and read snippets
            await fs.access(snippetFile);
            const content = await fs.readFile(snippetFile, 'utf8');
            const snippets = JSON.parse(content);

            for (const [name, snippet] of Object.entries<any>(snippets)) {
              const item = new vscode.CompletionItem(snippet.prefix, vscode.CompletionItemKind.Snippet);
              item.detail = snippet.description || name;
              const body = Array.isArray(snippet.body) ? snippet.body.join('\n') : snippet.body;
              item.insertText = new vscode.SnippetString(body);
              item.documentation = new vscode.MarkdownString(`**${name}**\n\n${snippet.description || ''}`);
              items.push(item);
            }
          } catch (err) {
            console.warn(`Failed to load snippets from ${snippetFile}:`, err);
          }

          return items;
        }
      },
      'e' // Trigger character for suggestions, adjust as needed
    );
  };

  // Register snippet providers for different snippet sets
  const esxSnippets = registerSnippetProvider('esx.json');
  const ncSnippets = registerSnippetProvider('nc.json');
  const qbSnippets = registerSnippetProvider('qb.json');

  context.subscriptions.push(esxSnippets, ncSnippets, qbSnippets);
}

export function deactivate() {}
