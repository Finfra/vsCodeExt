// 상태 순환 단위 테스트 — node test/toggle.test.js (compile 후 실행)
const assert = require('assert');
const { nextLine } = require('../out/toggle');

const cases = [
    // 순환: Text → [ ] → [~] → [v] → [!] → [>] → [x] → [?] → Text
    ['할 일', '* [ ] 할 일'],
    ['* [ ] 할 일', '* [~] 할 일'],
    ['* [~] 할 일', '* [v] 할 일'],
    ['* [v] 할 일', '* [!] 할 일'],
    ['* [!] 할 일', '* [>] 할 일'],
    ['* [>] 할 일', '* [x] 할 일'],
    ['* [x] 할 일', '* [?] 할 일'],
    ['* [?] 할 일', '할 일'],
    // 들여쓰기·하이픈·대문자·빈 괄호 보존·정규화
    ['    - [V] 들여쓴 항목', '    * [!] 들여쓴 항목'],
    ['  * [] 빈 괄호', '  * [~] 빈 괄호'],
    ['- 그냥 bullet', '* [ ] 그냥 bullet'],
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
console.log(`${cases.length - fail}/${cases.length} pass`);
process.exit(fail ? 1 : 0);
