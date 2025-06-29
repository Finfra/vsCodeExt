#!/bin/bash

# Zed Todo Asterisk Bullet Extension Development Script

set -e

echo "🔨 Building Todo Asterisk Bullet Extension for Zed..."

# Check if Rust is installed
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust first:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "extension.toml" ]; then
    echo "❌ extension.toml not found. Please run this script from the zed extension directory."
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
cargo test

# Build the extension
echo "🔨 Building extension..."
cargo build --release

echo "✅ Build completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Open Zed"
echo "2. Go to Extensions (Cmd+Shift+P → 'extensions')"
echo "3. Click 'Install Dev Extension'"
echo "4. Select this directory: $(pwd)"
echo ""
echo "🚀 Usage:"
echo "1. Setup keyboard shortcut (recommended):"
echo "   - Open keymap.json (Cmd+K Cmd+S)"
echo "   - Add: {\"context\":\"Editor\",\"bindings\":{\"alt+shift+enter\":\"assistant::InlineAssist\"}}"
echo "   - Select text and press Opt+Shift+Enter, then type '/todo'"
echo ""
echo "2. Direct usage in Assistant Panel:"
echo "   - Open Assistant Panel (Cmd+Shift+A)"
echo "   - Type: /todo your text here"
echo "   - Example: /todo Buy groceries"
echo ""
echo "⚠️  Note: Extension can't register keybindings directly - manual keymap setup required"
