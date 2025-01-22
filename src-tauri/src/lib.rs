// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use pulldown_cmark::{html, Options, Parser};
use std::fs;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn render_markdown(file_path: String) -> Result<String, String> {
    // Read the markdown file
    let markdown_input = fs::read_to_string(file_path).map_err(|e| e.to_string())?;

    // Set up the parser and renderer
    let parser = Parser::new_ext(&markdown_input, Options::empty());
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);

    Ok(html_output)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // tauri::Builder::default()
    //     .plugin(tauri_plugin_opener::init())
    //     .invoke_handler(tauri::generate_handler![greet])
    //     .run(tauri::generate_context!())
    //     .expect("error while running tauri application");
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![render_markdown])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
