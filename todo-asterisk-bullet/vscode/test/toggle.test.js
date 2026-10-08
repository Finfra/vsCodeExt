// 상태 순환 단위 테스트 — node test/toggle.test.js (compile 후 실행)
const assert = require('assert');
const { nextLine, nextEdit } = require('../out/toggle');

const cases = [
    // 순환: (일반 텍스트·bullet 진입) → [] → [~] → [v] → [!] → [>] → [x] → [?] → [] (Text 복귀 없음)
    ['할 일', '* [] 할 일'],
    ['* [] 할 일', '* [~] 할 일'],
    ['* [ ] 할 일', '* [~] 할 일'],
    ['* [~] 할 일', '* [v] 할 일'],
    ['* [v] 할 일', '* [!] 할 일'],
    ['* [!] 할 일', '* [>] 할 일'],
    ['* [>] 할 일', '* [x] 할 일'],
    ['* [x] 할 일', '* [?] 할 일'],
    ['* [?] 할 일', '* [] 할 일'],
    ['  - [?] 들여쓴 모름', '  * [] 들여쓴 모름'],
    // 들여쓰기·하이픈·대문자·빈 괄호 보존·정규화
    ['    - [V] 들여쓴 항목', '    * [!] 들여쓴 항목'],
    ['  * [ ] 공백 괄호(구 표기)', '  * [~] 공백 괄호(구 표기)'],
    ['- 그냥 bullet', '* [] 그냥 bullet'],
    ['\t* [X] 탭', '\t* [?] 탭'],
];

let fail = 0;
for (const [input, expected] of cases) {
    try {
        assert.strictEqual(nextLine(input), expected);
        console.log(`ok   ${JSON.stringify(input)}`);
    } catch (e) {
        fail++;
        console.log(`FAIL ${JSON.stringify(input)} → ${JSON.stringify(nextLine(input))} (기대 ${JSON.stringify(expected)})`);
    }
}
// 최소 편집 + 커서: 접두(표기)만 바꾸고 커서는 접두 뒤(본문 안이면 본문 상대 위치 유지)
const editCases = [
    // [line, cursorCol, 기대 {start,end,text,cursor}]
    ['', 0, { start: 0, end: 0, text: '* [] ', cursor: 5 }],          // 빈 줄 → 공백까지 한 번에, 커서는 공백 뒤
    ['  ', 2, { start: 2, end: 2, text: '* [] ', cursor: 7 }],        // 들여쓰기만 있는 줄
    ['할 일', 0, { start: 0, end: 0, text: '* [] ', cursor: 5 }],     // 줄 머리 커서 → 접두 뒤
    ['할 일', 3, { start: 0, end: 0, text: '* [] ', cursor: 8 }],     // 본문 끝 커서 → 본문 상대 위치 유지
    ['* [] 할 일', 5, { start: 0, end: 5, text: '* [~] ', cursor: 6 }],
    ['* [] 할 일', 2, { start: 0, end: 5, text: '* [~] ', cursor: 6 }], // 접두 안 커서 → 접두 뒤
    ['  * [?] 모름', 10, { start: 2, end: 8, text: '* [] ', cursor: 9 }],
    ['- 그냥', 4, { start: 0, end: 2, text: '* [] ', cursor: 7 }],
];
for (const [line, col, expected] of editCases) {
    const tag = `edit ${JSON.stringify(line)}@${col}`;
    try {
        assert.deepStrictEqual(nextEdit(line, col), expected);
        console.log(`ok   ${tag}`);
    } catch (e) {
        fail++;
        console.log(`FAIL ${tag} → ${JSON.stringify(nextEdit && nextEdit(line, col))} (기대 ${JSON.stringify(expected)})`);
    }
}
const total = cases.length + editCases.length;
console.log(`${total - fail}/${total} pass`);
process.exit(fail ? 1 : 0);
