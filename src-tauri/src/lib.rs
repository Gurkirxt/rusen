use pulldown_cmark::{html, Parser};

#[tauri::command]
fn read_file(path: &str) -> Result<String, String> {
    std::fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_file(path: &str, content: &str) -> Result<(), String> {
    println!("Saving to: {}", path); // Add logging
    std::fs::write(path, content).map_err(|e| {
        eprintln!("Save error: {}", e); // Log errors
        e.to_string()
    })
}

#[tauri::command]
fn get_directory_tree(path: String) -> Result<Vec<serde_json::Value>, String> {
    let entries = std::fs::read_dir(&path).map_err(|e| e.to_string())?;
    let mut dirs = Vec::new();
    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        let name = entry
            .file_name()
            .into_string()
            .map_err(|_| "Invalid filename".to_string())?;

        if entry_path.is_dir() {
            let children = get_directory_tree(entry_path.to_str().unwrap().to_string())?;
            let mut dir_entry = vec![serde_json::Value::String(name.clone())];
            dir_entry.extend(children);
            dirs.push((name, serde_json::Value::Array(dir_entry)));
        } else {
            files.push(serde_json::Value::String(name));
        }
    }

    // Sort directories and files alphabetically
    dirs.sort_by(|a, b| a.0.cmp(&b.0));
    files.sort_by(|a, b| {
        let a_str = a.as_str().unwrap();
        let b_str = b.as_str().unwrap();
        a_str.cmp(b_str)
    });

    let mut result = Vec::new();
    for (_, dir) in dirs {
        result.push(dir);
    }
    for file in files {
        result.push(file);
    }

    Ok(result)
}
#[tauri::command]
fn markdown_to_html(md: &str) -> String {
    let parser = Parser::new(md);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
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
        ])
        .run(tauri::generate_context!())
        .expect("error in file read write!")
}
