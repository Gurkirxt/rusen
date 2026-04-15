use rusqlite::{Connection, Result};
use std::sync::Mutex;
use lru::LruCache;
use std::num::NonZeroUsize;
use regex::Regex;
use pulldown_cmark::{html, Parser};

#[allow(dead_code)]
pub struct CacheState {
    pub db: Mutex<Connection>,
    pub lru: Mutex<LruCache<String, String>>,
}

#[allow(dead_code)]
impl CacheState {
    pub fn new(db_path: &str) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS notes_cache (
                path TEXT PRIMARY KEY,
                content TEXT,
                html TEXT,
                links TEXT,
                modified_at INTEGER,
                cached_at INTEGER
            )",
            [],
        )?;
        conn.execute(
            "CREATE TABLE IF NOT EXISTS link_graph (
                source TEXT,
                target TEXT,
                link_type TEXT
            )",
            [],
        )?;

        Ok(Self {
            db: Mutex::new(conn),
            lru: Mutex::new(LruCache::new(NonZeroUsize::new(100).unwrap())),
        })
    }
}

pub fn preprocess_wikilinks(md: &str) -> String {
    let re = Regex::new(r"\[\[(.*?)\]\]").unwrap();
    re.replace_all(md, |caps: &regex::Captures| {
        let name = &caps[1];
        format!("<a href=\"rusen://note/{}\" class=\"internal-link\">{}</a>", name, name)
    }).to_string()
}

pub fn render_markdown(md: &str) -> String {
    let preprocessed = preprocess_wikilinks(md);
    let parser = Parser::new(&preprocessed);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    html_output
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_preprocess_single_wikilink() {
        let result = preprocess_wikilinks("See [[my note]] for details.");
        assert!(result.contains(r#"href="rusen://note/my note""#));
        assert!(result.contains(r#"class="internal-link""#));
        assert!(result.contains(">my note</a>"));
    }

    #[test]
    fn test_preprocess_multiple_wikilinks() {
        let result = preprocess_wikilinks("Links: [[note1]] and [[note2]].");
        assert!(result.contains("rusen://note/note1"));
        assert!(result.contains("rusen://note/note2"));
    }

    #[test]
    fn test_preprocess_no_wikilinks() {
        let input = "No special links here.";
        let result = preprocess_wikilinks(input);
        assert_eq!(result, input);
    }

    #[test]
    fn test_render_heading() {
        let result = render_markdown("# Hello");
        assert!(result.contains("<h1>"));
        assert!(result.contains("Hello"));
    }

    #[test]
    fn test_render_bold_italic() {
        let result = render_markdown("**bold** and *italic*");
        assert!(result.contains("<strong>bold</strong>"));
        assert!(result.contains("<em>italic</em>"));
    }

    #[test]
    fn test_render_wikilink_in_paragraph() {
        let result = render_markdown("Check [[other note]] please.");
        assert!(result.contains(r#"href="rusen://note/other note""#));
        assert!(result.contains("other note</a>"));
    }

    #[test]
    fn test_render_code_block() {
        let result = render_markdown("```\nlet x = 1;\n```");
        assert!(result.contains("<code>"));
        assert!(result.contains("let x = 1;"));
    }

    #[test]
    fn test_render_list() {
        let result = render_markdown("- item 1\n- item 2");
        assert!(result.contains("<li>"));
        assert!(result.contains("item 1"));
        assert!(result.contains("item 2"));
    }

    #[test]
    fn test_cache_state_creation() {
        let cache = CacheState::new(":memory:").expect("should create in-memory cache");
        let db = cache.db.lock().unwrap();
        let mut stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").unwrap();
        let tables: Vec<String> = stmt
            .query_map([], |row| row.get(0))
            .unwrap()
            .filter_map(|r| r.ok())
            .collect();
        assert!(tables.contains(&"notes_cache".to_string()));
        assert!(tables.contains(&"link_graph".to_string()));
    }

    #[test]
    fn test_render_performance_large_document() {
        let mut md = String::with_capacity(50_000);
        for i in 0..200 {
            md.push_str(&format!("## Section {}\n\n", i));
            md.push_str("This is a paragraph with **bold**, *italic*, and a [[wikilink]] reference.\n\n");
            md.push_str("- Item one\n- Item two with `code`\n- Item three\n\n");
        }

        let start = std::time::Instant::now();
        let html = render_markdown(&md);
        let elapsed = start.elapsed();

        assert!(!html.is_empty());
        assert!(html.contains("<h2>"));
        assert!(html.contains("internal-link"));
        // ~600 lines of markdown should render in well under 100ms
        assert!(
            elapsed.as_millis() < 100,
            "Rendering took {}ms, expected <100ms",
            elapsed.as_millis()
        );
    }
}
