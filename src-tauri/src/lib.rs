mod theme;
mod cache;

#[tauri::command]
fn parse_itermcolors(name: &str, content: &str) -> Result<theme::Base16Theme, String> {
    theme::parse_itermcolors(name, content)
}

#[tauri::command]
fn read_file(path: &str) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_file(path: &str, content: &str) -> Result<(), String> {
    std::fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_directory_tree(path: String) -> Result<Vec<serde_json::Value>, String> {
    let entries = std::fs::read_dir(&path).map_err(|e| e.to_string())?;
    let mut dirs: Vec<(String, serde_json::Value)> = Vec::new();
    let mut files: Vec<(String, serde_json::Value)> = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| "Invalid filename".to_string())?;

        if entry_path.is_dir() {
            let path_str = entry_path
                .to_str()
                .ok_or_else(|| format!("Non-UTF8 path: {:?}", entry_path))?
                .to_string();
            let children = get_directory_tree(path_str)?;
            let mut dir_entry = vec![serde_json::Value::String(name.clone())];
            dir_entry.extend(children);
            dirs.push((name, serde_json::Value::Array(dir_entry)));
        } else {
            files.push((name.clone(), serde_json::Value::String(name)));
        }
    }

    dirs.sort_by(|a, b| a.0.cmp(&b.0));
    files.sort_by(|a, b| a.0.cmp(&b.0));

    let mut result = Vec::new();
    for (_, dir) in dirs {
        result.push(dir);
    }
    for (_, file) in files {
        result.push(file);
    }

    Ok(result)
}

#[tauri::command]
fn markdown_to_html(md: &str) -> String {
    cache::render_markdown(md)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            read_file,
            save_file,
            get_directory_tree,
            markdown_to_html,
            parse_itermcolors,
        ])
        .run(tauri::generate_context!())
        .expect("failed to start tauri application");
}
