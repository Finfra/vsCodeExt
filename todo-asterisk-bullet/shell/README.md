# todo-asterisk-bullet Shell 스크립트

## 개요
`todo-asterisk-bullet`의 상태 순환 로직을 쉘 환경에서 테스트하거나, 외부에서 간단히 사용할 수 있도록 제공하는 shell 스크립트 모음입니다.

- **상태 순환 규칙**:  
  일반 텍스트 → `* ` → `* [ ]` → `* [~]` → `* [v]` → `* [>]` → `* [x]` → 일반 텍스트  
  (정의되지 않은 상태 토큰도 모두 제거 후 새 토큰만 남김)
- **들여쓰기 및 본문 텍스트**는 항상 보존됩니다.

## 파일 설명

- `todo-asterisk-bullet_forward.sh`  
  선택한 줄(또는 첫 줄)의 상태를 "다음" 상태로 순환시킵니다.
- `todo-asterisk-bullet_backward.sh`  
  선택한 줄(또는 첫 줄)의 상태를 "이전" 상태로 순환시킵니다.
- `todo-asterisk-bullet_common.sh`  
  상태 추출/변환 공통 함수 및 순환 규칙 정의.
- `todo-asterisk-bullet_config.yml`  
  상태 순환 정의(yq로 파싱).

## 사용법
### 단일 줄

```sh
./todo-asterisk-bullet_forward.sh '일반 텍스트'
# 결과: * [ ] 일반 텍스트

./todo-asterisk-bullet_backward.sh '* [v] 할 일'
# 결과: * [~] 할 일
```

### 멀티라인 입력

- 여러 줄 입력 시 **첫 번째 줄만** 상태 순환, 나머지 줄은 그대로 출력됩니다.

```sh
echo -e 'aa\nxxx' | ./todo-asterisk-bullet_forward.sh
# 결과:
# * [ ] aa
# xxx

echo -e 'bb\nxxx' | ./todo-asterisk-bullet_backward.sh
# 결과:
# * [>] bb
# xxx
```

## 테스트 예시

```sh
# 상태 순환 동작 검증
echo '* [x] aa' | ./todo-asterisk-bullet_forward.sh
# 결과: aa

echo 'bb' | ./todo-asterisk-bullet_backward.sh
# 결과: * [>] bb

echo -e 'aa\nxxx' | ./todo-asterisk-bullet_forward.sh
# 결과:
# * [ ] aa
# xxx

echo -e 'bb\nxxx' | ./todo-asterisk-bullet_backward.sh
# 결과:
# * [>] bb
# xxx
```

## 의존성

- [yq](https://github.com/mikefarah/yq) (상태 정의 파싱용)

## 테스트 코드
```
./todo-asterisk-bullet_forward.sh  '* [x] aa'
./todo-asterisk-bullet_backward.sh  'bb'
./todo-asterisk-bullet_forward.sh  'aa
xxx'
./todo-asterisk-bullet_backward.sh  'bb
xxx'
./todo-asterisk-bullet_forward.sh  '* [v] aa'
./todo-asterisk-bullet_backward.sh  '* [v] bb'
./todo-asterisk-bullet_forward.sh  '* aa'
./todo-asterisk-bullet_backward.sh  '* bb'
```
* 결과
```
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_forward.sh  '* [x] aa'
aa
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_backward.sh  'bb'
* [>] bb
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_forward.sh  'aa
xxx'
* [ ] aa
xxx
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_backward.sh  'bb
xxx'
* [>] bb
xxx
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_forward.sh  '* [v] aa'
* [>] aa
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_backward.sh  '* [v] bb'
* [~] bb
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_forward.sh  '* aa'
* [ ] aa
  ~/_git/__all/vsCodeExt main$ ./todo-asterisk-bullet/shell/todo-asterisk-bullet_backward.sh  '* bb'
* bb
```
## 배포
```
cp  ~/_git/__all/vsCodeExt/todo-asterisk-bullet/shell/todo-asterisk-bullet* ~/.bin/
```

## 참고

- 상태 순환 규칙 및 상세 요구사항은 상위 디렉토리의 `../prd.md` 및 `.clinerules/rule.md` 참고
