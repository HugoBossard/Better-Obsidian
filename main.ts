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
			name: 'Insert current selected text by list',
			editorCallback: (editor: Editor) => {
				this.insertList(editor);
			}
		});
	}

	insertList(editor: Editor) {
		const selection = editor.getSelection();

		editor.replaceSelection(
			selection.split('\n').map((line) =>
				"- " + line + "\n"
			).join('')
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