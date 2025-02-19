import { Editor, Menu, Notice, Plugin } from 'obsidian';

interface MyPluginSettings {
	mySettings: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySettings: 'default'
}

export default class BetterObsidian extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('menu', 'Open menu', (event) => {
			const menu = new Menu();

			menu.addItem((item) =>
				item
				.setTitle('Hello')
				.setIcon('hand')
				.onClick(() => {
					new Notice('Hello world!');
				})
			);

			menu.showAtMouseEvent(event);
		});

		this.addCommand({
			id: 'insert-list',
			name: 'Insert list on current selected text',
			editorCallback: (editor: Editor) => {
				this.insertList(editor);
			}
		});

		this.addCommand({
			id: 'insert-links',
			name: 'Insert links to files in current folder',
			editorCallback: (editor: Editor) => {
				this.insertLinksToCurrentFolder(editor);
			}
		});
	}

	insertList(editor: Editor) {
		const selection = editor.getSelection();

		const splitedSelection = selection.split("\n");

		if (splitedSelection.length === 1) {
			editor.replaceSelection(
				"- " + splitedSelection[0]
			);

			return;
		}

		editor.replaceSelection(
			selection.split('\n').map((line) =>
				"- " + line + "\n"
			).join("")
		);
	}

	getCurrentFile() {
		const currentFile = this.app.workspace.getActiveFile();

		return currentFile;
	}

	insertLinksToCurrentFolder(editor: Editor) {
		const currentFile = this.getCurrentFile();

		if (!currentFile) {
			return;
		}

		const pathToFolder = currentFile.parent?.path;

		if (!pathToFolder) {
			return;
		}

		const currentFolder = this.app.vault.getFolderByPath(pathToFolder);

		let filesInFolder = currentFolder?.children.filter((file) => file.name != currentFile.name);

		if (!filesInFolder) {
			return;
		}

		filesInFolder = filesInFolder.sort((file1, file2) => file1.name.localeCompare(file2.name));

		editor.replaceSelection(
			filesInFolder.map((file) => 
				"![[" + file.name + "]] \n \n"
			).join("")
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}