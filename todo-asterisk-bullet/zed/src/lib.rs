use zed_extension_api as zed;

struct TodoAsteriskBulletExtension;

impl zed::Extension for TodoAsteriskBulletExtension {
    fn new() -> Self {
        Self
    }

    fn run_slash_command(
        &self,
        command: zed::SlashCommand,
        args: Vec<String>,
        _worktree: Option<&zed::Worktree>,
    ) -> Result<zed::SlashCommandOutput, String> {
        if command.name != "todo" {
            return Err("Unknown command".to_string());
        }

        let text = args.join(" ");
        let result = toggle_todo_state(&text);
        
        Ok(zed::SlashCommandOutput {
            text: result,
            sections: vec![],
        })
    }

    fn complete_slash_command_argument(
        &self,
        command: zed::SlashCommand,
        _args: Vec<String>,
    ) -> Result<Vec<zed::SlashCommandArgumentCompletion>, String> {
        if command.name == "todo" {
            Ok(vec![
                zed::SlashCommandArgumentCompletion {
                    label: "Toggle current line todo state".to_string(),
                    new_text: "".to_string(),
                    run_command: true,
                },
            ])
        } else {
            Ok(vec![])
        }
    }
}

fn toggle_todo_state(text: &str) -> String {
    let lines: Vec<&str> = text.lines().collect();
    let mut result_lines = Vec::new();

    for line in lines {
        result_lines.push(toggle_line_state(line));
    }

    result_lines.join("\n")
}

fn toggle_line_state(line: &str) -> String {
    // 들여쓰기 추출
    let indent = extract_indent(line);
    
    // 상태 순환: Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text
    let states = vec!["[ ]", "[~]", "[v]", "[>]", "[x]"];
    // [!] = 구 보류 표기(2026-10-04 이전) — [>] 와 같은 단계로 인식
    const LEGACY_HOLD: &str = "[!]";
    
    // 현재 상태 확인
    for (i, state) in states.iter().enumerate() {
        let legacy = *state == "[>]" && is_match(LEGACY_HOLD, line);
        if is_match(state, line) || legacy {
            let state = if legacy { &LEGACY_HOLD } else { state };
            let text_after = extract_text_after_bullet(line, state);
            if i < states.len() - 1 {
                // 다음 상태로
                return format!("{}* {} {}", indent, states[i + 1], text_after);
            } else {
                // 마지막 상태면 일반 텍스트로
                return format!("{}{}", indent, text_after);
            }
        }
    }

    // 일반 리스트나 텍스트인 경우
    let text_content = extract_content_after_bullet(line);
    format!("{}* [ ] {}", indent, text_content)
}

fn extract_indent(line: &str) -> String {
    line.chars()
        .take_while(|c| c.is_whitespace())
        .collect()
}

fn is_match(state: &str, text: &str) -> bool {
    // 간단한 패턴 매칭 구현
    let trimmed = text.trim_start();
    let patterns = [
        format!("* {} ", state),
        format!("- {} ", state),
        format!("*{} ", state),
        format!("-{} ", state),
    ];
    
    patterns.iter().any(|pattern| trimmed.starts_with(pattern))
}

fn extract_text_after_bullet(line: &str, state: &str) -> String {
    let patterns = vec![
        format!("* {} ", state),
        format!("- {} ", state),
        format!("*{} ", state),
        format!("-{} ", state),
    ];
    
    for pattern in patterns {
        if let Some(pos) = line.find(&pattern) {
            return line[pos + pattern.len()..].to_string();
        }
    }
    
    line.to_string()
}

fn extract_content_after_bullet(line: &str) -> String {
    // 기존 bullet 제거
    let trimmed = line.trim_start();
    
    if trimmed.starts_with("* ") {
        return trimmed[2..].to_string();
    }
    if trimmed.starts_with("- ") {
        return trimmed[2..].to_string();
    }
    if trimmed.starts_with("*") {
        return trimmed[1..].trim_start().to_string();
    }
    if trimmed.starts_with("-") {
        return trimmed[1..].trim_start().to_string();
    }
    
    trimmed.to_string()
}

zed::register_extension!(TodoAsteriskBulletExtension);

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_toggle_states() {
        assert_eq!(toggle_line_state("Hello world"), "* [ ] Hello world");
        assert_eq!(toggle_line_state("* [ ] Hello world"), "* [~] Hello world");
        assert_eq!(toggle_line_state("* [~] Hello world"), "* [v] Hello world");
        assert_eq!(toggle_line_state("* [v] Hello world"), "* [>] Hello world");
        assert_eq!(toggle_line_state("* [>] Hello world"), "* [x] Hello world");
        // 구 보류 표기 [!] 도 보류 단계로 인식
        assert_eq!(toggle_line_state("* [!] Hello world"), "* [x] Hello world");
        assert_eq!(toggle_line_state("* [x] Hello world"), "Hello world");
    }

    #[test]
    fn test_preserve_indent() {
        assert_eq!(toggle_line_state("  Hello world"), "  * [ ] Hello world");
        assert_eq!(toggle_line_state("    * [ ] Hello world"), "    * [~] Hello world");
    }

    #[test]
    fn test_hyphen_lists() {
        assert_eq!(toggle_line_state("- [ ] Hello world"), "* [~] Hello world");
        assert_eq!(toggle_line_state("- Hello world"), "* [ ] Hello world");
    }
}
