# Rusen 📝✨

> Modern, lightning-fast knowledge management and networked note-taking. Built with Rust and Tauri.

[![Built with Tauri](https://img.shields.io/badge/Built_with-Tauri-24C8DB?logo=tauri&logoColor=white)](https://tauri.app/)
[![Built with Rust](https://img.shields.io/badge/Built_with-Rust-black?logo=rust)](https://www.rust-lang.org/)
[![Powered by Bun](https://img.shields.io/badge/Powered_by-Bun-black?logo=bun)](https://bun.sh/)

## Why This Exists

Most modern note-taking apps are either slow, bloated Electron wrappers that consume gigabytes of RAM, or proprietary silos that lock your data away. 

**Rusen** is built differently. It's a developer-first, native desktop application that treats your notes as plain Markdown files. By leveraging Rust and Tauri, it delivers instant search, a 60 FPS 3D graph explorer, and a memory footprint under 100MB—all while keeping you in complete control of your data.

## Quick Start

Get Rusen running locally in under a minute.

**Prerequisites:**
- [Rust](https://www.rust-lang.org/tools/install)
- [Bun](https://bun.sh/)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) (OS-specific dependencies)

```bash
# Clone the repository
git clone git@github.com:Gurkirxt/rusen.git
cd rusen

# Install dependencies
bun install

# Start the development server and native app
bun run tauri dev
```

## Features & Roadmap

### 🧠 Networked Thought
- **`[[Wiki Links]]`**: Frictionless linking between ideas.
- **Backlinks Panel**: Automatically track note relationships and unlinked references.
- **Graph Explorer**: 60 FPS 3D visualization of your knowledge graph.

### ⚡ Native Performance
- **Lightweight**: Consumes <100MB of memory.
- **Instant Search**: Full-text search across thousands of markdown files with zero lag.
- **Cross-Platform**: Windows, macOS, and Linux support out of the box (Mobile & Web planned).

### 🛠 Developer-First
- **Plain Markdown**: No databases, no proprietary formats. Just files in a folder.
- **CLI Integration**: Manage, search, and script your notes directly from the terminal.
- **Extensible API**: Build custom plugins using WASM.

## Contributing

We welcome contributions! Whether it's adding a new feature, fixing a bug, or improving documentation, please feel free to open an issue or submit a Pull Request.

## License

MIT © [Gurkirxt](https://github.com/Gurkirxt)
