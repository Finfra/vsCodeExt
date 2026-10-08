// 상태 순환(7단계): [] 착수전 (구 표기 [ ] 도 인식) → [~] 진행 → [v] 완료 → [!] 보류 → [>] 위임 → [x] 취소 → [?] 모름 → [] …
// 일반 텍스트·체크박스 없는 bullet 은 [] 로 진입. '* ' 만 붙이는 단계는 없음 (shell 의 asterisk.sh 가 담당)
export const STATES = ["[]", "[~]", "[v]", "[!]", "[>]", "[x]", "[?]"];
const STATE_REGEXES = [
    /^\s*[-*]\s*\[\s*\]\s*/,
    /^\s*[-*]\s*\[~\]\s*/,
    /^\s*[-*]\s*\[v\]\s*/i,
    /^\s*[-*]\s*\[!\]\s*/,
    /^\s*[-*]\s*\[>\]\s*/,
    /^\s*[-*]\s*\[x\]\s*/i,
    /^\s*[-*]\s*\[\?\]\s*/
];
const BULLET_PREFIX = /^[-*](?:\s+|$)/; // `*bold*` 같은 강조는 bullet 아님
const INDENT_PATTERN = /^(\s*)/;

// 줄에 적용할 최소 편집 — [start, end) 접두(bullet·상태 표기)만 text 로 바꾸고 본문은 건드리지 않음
export interface ToggleEdit { start: number; end: number; text: string; cursor: number; }

export function nextEdit(line: string, cursorCol: number): ToggleEdit {
    const indentMatch = line.match(INDENT_PATTERN);
    const start = indentMatch ? indentMatch[1].length : 0;

    let end = start;
    let text = '* ' + STATES[0] + ' ';
    let matched = false;
    for (let i = 0; i < STATE_REGEXES.length; i++) {
        const m = line.match(STATE_REGEXES[i]);
        if (m) {
            end = m[0].length;
            text = '* ' + STATES[(i + 1) % STATES.length] + ' ';
            matched = true;
            break;
        }
    }
    if (!matched) {
        const bullet = line.slice(start).match(BULLET_PREFIX);
        if (bullet) { end = start + bullet[0].length; }   // bullet 은 접두로 흡수
    }

    // 커서: 접두 안(또는 경계)이면 새 접두 뒤, 본문 안이면 본문 기준 상대 위치 유지
    const cursor = cursorCol <= end ? start + text.length : cursorCol + text.length - (end - start);
    return { start, end, text, cursor };
}

// 한 줄을 다음 상태로 바꾼 결과를 돌려줌 (들여쓰기 보존, bullet 은 `*` 로 정규화)
export function nextLine(line: string): string {
    const e = nextEdit(line, 0);
    return line.slice(0, e.start) + e.text + line.slice(e.end);
}
