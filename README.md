# Rusen 📝✨

**Modern Knowledge Management with Rust**  
_Tauri-powered desktop app for networked note-taking and idea exploration_

---

![Rusen Interface](demo.png)  
_Write, link, and visualize notes with native performance_

## 🌟 Planned Capabilities

### **Networked Notes**

- `[[Wiki Links]]` between ideas
- **Backlinks Panel**: Track note relationships
- **Graph Explorer**: 3D visualization of connections

### **Developer-First Design**

- **Plain Markdown Storage**: Full control over your data
- **CLI Integration**: Manage notes via terminal
- **Extensible API**: Build custom plugins with WASM

### **Native Performance**

- Instant search (1M+ notes benchmark)
- <100MB memory usage
- 60 FPS graph rendering

### **Cross-Platform**

- Windows/macOS/Linux support
- Android/iOS (beta)
- Web export (static HTML/JSON)

---

## 🚀 Steps to run locally

````bash
# Clone & build (requires Rust + Bun)
git clone git@github.com:Gurkirxt/rusen.git
cd rusen && bun install

# Start development mode
bun run tauri dev ```
````
