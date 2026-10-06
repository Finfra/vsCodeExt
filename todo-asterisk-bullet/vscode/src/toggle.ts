// 상태 순환: Text → [ ] 착수전 → [~] 진행 → [v] 완료 → [!] 보류 → [>] 위임 → [x] 취소 → [?] 모름 → Text
export const STATES = ["[ ]", "[~]", "[v]", "[!]", "[>]", "[x]", "[?]"];
const STATE_REGEXES = [
    /^\s*[-*]\s*\[\s*\]\s*/,
    /^\s*[-*]\s*\[~\]\s*/,
    /^\s*[-*]\s*\[v\]\s*/i,
    /^\s*[-*]\s*\[!\]\s*/,
    /^\s*[-*]\s*\[>\]\s*/,
    /^\s*[-*]\s*\[x\]\s*/i,
    /^\s*[-*]\s*\[\?\]\s*/
];
const BULLET_REPLACE = /^\s*[-*]\s*/;
const INDENT_PATTERN = /^(\s*)/;

// 한 줄을 다음 상태로 바꾼 결과를 돌려줌 (들여쓰기 보존, bullet 은 `*` 로 정규화)
export function nextLine(line: string): string {
    const indentMatch = line.match(INDENT_PATTERN);
    const indent = indentMatch ? indentMatch[1] : '';

    for (let i = 0; i < STATE_REGEXES.length; i++) {
        const regex = STATE_REGEXES[i];
        if (regex.test(line)) {
            const textAfter = line.replace(regex, '');
            if (i < STATES.length - 1) {
                return indent + '* ' + STATES[i + 1] + ' ' + textAfter;
            }
            return indent + textAfter;
        }
    }
    const textContent = line.replace(BULLET_REPLACE, '').replace(/^\s*/, '');
    return indent + '* [ ] ' + textContent;
}
