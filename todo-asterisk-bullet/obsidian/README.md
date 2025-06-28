# Todo Asterisk Bullet

A simple Obsidian plugin to toggle asterisk bullet todo states, similar to VSCode's Markdown Todo extension.
## Todo
* https://claude.ai/share/b174c0fe-e7ca-4070-ab6a-e55d3a3a1b73
## Features
- **Cycle through states**: Text → `*` → `* [ ]` → `* [x]` → `*` → Text
- **Keyboard shortcut**: `Cmd/Ctrl + Shift + T`
- **Text preservation**: Maintains existing text when toggling states
- **Multiple formats**: Supports `[x]`, `[X]`, `[v]`, `[✓]` check marks
- **List compatibility**: Works with both `-` and `*` bullet points (outputs as `*`)
- **Indentation preserved**: Maintains original indentation levels

## Installation

### From Obsidian Community Plugins
1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Todo Asterisk Bullet"
4. Install and enable the plugin

### Manual Installation
1. Download the latest release
2. Extract files to `[VAULT]/.obsidian/plugins/todo-asterisk-bullet/`
3. Enable the plugin in Community Plugins settings

## Usage

### Keyboard Shortcut
- Press `Cmd/Ctrl + Shift + T` on any line

### Command Palette
- Search for "Toggle Asterisk Bullet State"

### Example
```
Initial text
* Initial text (first toggle)
* [ ] Initial text (second toggle)
* [x] Initial text (third toggle)
* Initial text (fourth toggle - cycles back)
```

## Development

### Setup
```bash
git clone https://github.com/[YOUR_USERNAME]/obsidian-todo-asterisk-bullet.git
cd obsidian-todo-asterisk-bullet
npm install
```

### Build
```bash
npm run dev    # Development mode with file watching
npm run build  # Production build
```

### Testing
1. Build the plugin
2. Copy `main.js`, `manifest.json`, and `styles.css` to your test vault's plugin folder
3. Enable the plugin in Obsidian

## Changelog

### 1.0.0
- Initial release
- Support for multiple check mark formats
- Fixed repetitive toggle issues
- Added hyphen list support
- Improved text preservation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/[YOUR_USERNAME]/obsidian-todo-asterisk-bullet/issues) on GitHub.
