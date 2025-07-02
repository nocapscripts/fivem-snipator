import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  console.log('FiveM Snipator Activated!');

  // This command enables snippets when manually called
  const initCommand = vscode.commands.registerCommand('fivemsnipator.init', async () => {
    vscode.window.showInformationMessage('FiveM Snipator snippet system activated!');

    const loadSnippets = async (filePath: string): Promise<vscode.CompletionItem[]> => {
      const items: vscode.CompletionItem[] = [];

      try {
        await fs.access(filePath);
        const content = await fs.readFile(filePath, 'utf8');
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
        console.warn(`Failed to load snippets from ${filePath}:`, err);
      }

      return items;
    };

    // Register the actual provider
    const provider = vscode.languages.registerCompletionItemProvider(
      { language: 'lua' },
      {
        async provideCompletionItems() {
          const allItems: vscode.CompletionItem[] = [];

          const basePath = path.join(context.extensionPath, 'snippets');
          const snippetFiles = ['esx.json', 'nc.json', 'qb.json'];

          for (const fileName of snippetFiles) {
            const filePath = path.join(basePath, fileName);
            const items = await loadSnippets(filePath);
            allItems.push(...items);
          }

          return allItems;
        }
      },
      'e', 'n', 'q'
    );

    context.subscriptions.push(provider);
  });

  context.subscriptions.push(initCommand);
}

export function deactivate() {}
