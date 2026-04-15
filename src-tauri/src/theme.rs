use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Base16Theme {
    pub name: String,
    pub colors: HashMap<String, String>, // base00 to base0F
}

pub fn parse_itermcolors(name: &str, content: &str) -> Result<Base16Theme, String> {
    let plist_data: plist::Value = plist::from_bytes(content.as_bytes())
        .map_err(|e| format!("Failed to parse plist: {}", e))?;

    let dict = plist_data
        .into_dictionary()
        .ok_or_else(|| "Root is not a dictionary".to_string())?;

    let mut colors = HashMap::new();
    let mut color_index = 0;

    // We'll just map the first 16 ANSI colors to base00-base0F for simplicity
    for i in 0..16 {
        let key = format!("Ansi {} Color", i);
        if let Some(color_dict) = dict.get(&key).and_then(|v| v.as_dictionary()) {
            let r = color_dict.get("Red Component").and_then(|v| v.as_real()).unwrap_val_or_zero();
            let g = color_dict.get("Green Component").and_then(|v| v.as_real()).unwrap_val_or_zero();
            let b = color_dict.get("Blue Component").and_then(|v| v.as_real()).unwrap_val_or_zero();

            let hex = format!(
                "#{:02X}{:02X}{:02X}",
                (r * 255.0) as u8,
                (g * 255.0) as u8,
                (b * 255.0) as u8
            );

            colors.insert(format!("base{:02X}", color_index), hex);
            color_index += 1;
        }
    }

    // Fallback if Ansi colors are missing
    if colors.is_empty() {
        return Err("No Ansi colors found in theme".to_string());
    }

    Ok(Base16Theme {
        name: name.to_string(),
        colors,
    })
}

trait UnwrapValOrZero {
    fn unwrap_val_or_zero(self) -> f64;
}

impl UnwrapValOrZero for Option<f64> {
    fn unwrap_val_or_zero(self) -> f64 {
        self.unwrap_or(0.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_itermcolors() {
        let xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Ansi 0 Color</key>
    <dict>
        <key>Blue Component</key>
        <real>0.1</real>
        <key>Green Component</key>
        <real>0.2</real>
        <key>Red Component</key>
        <real>0.3</real>
    </dict>
</dict>
</plist>"#;

        let theme = parse_itermcolors("Test Theme", xml).unwrap();
        assert_eq!(theme.name, "Test Theme");
        assert_eq!(theme.colors.get("base00").unwrap(), "#4C3319");
    }
}
