# Todo Asterisk Bullet

마크다운에서 asterisk(*) 기반의 todo bullet 상태를 손쉽게 토글할 수 있는 에디터 확장(Obsidian, VSCode, Zed 등) 통합 프로젝트입니다.

## 상태 순환 예시
| 표기  | 상태 해석 |
| ----- | --------- |
| `[ ]` | 미시작    |
| `[~]` | 진행 중   |
| `[v]` | 완료      |
| `[>]` | 보류      |
| `[x]` | 취소      |

```
Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text
```

## 프로젝트 개요

- 하나의 상태 순환 로직을 Obsidian, VSCode, Zed 등 다양한 에디터에서 동일하게 사용할 수 있도록 구현
- 각 플랫폼별로 최적화된 확장/플러그인 제공
- 상태 순환, 개발 규칙 등은 prd.md, rule.md 참고

## 폴더 구조

- obsidian/ : Obsidian 플러그인
- vscode/   : VSCode 확장
- zed/      : Zed 확장
- prd.md, rule.md : 공통 요구사항 및 개발 규칙

## 플랫폼별 주요 차이

- **상태 순환 구조**:  
  `Text → * [ ] → * [~] → * [v] → * [>] → * [x] → Text`
- **VSCode**: Opt/Alt+Shift+Enter 단축키, 멀티라인 지원, 명령 팔레트 지원
- **Obsidian**: Opt/Alt+Shift+Enter 단축키(권장, 실제 단축키는 keymap에서 변경 가능), 한 줄 단위 동작(멀티라인은 반복 호출 필요), 명령 팔레트 지원
- **Zed**: slash command(`/todo`), Opt/Alt+Shift+Enter(수동 keymap 설정 필요), 여러 줄 지원

---

## 설치 및 배포 방법

### 1. Obsidian

#### 테스트 설치
1. `todo-asterisk-bullet/obsidian` 폴더에서 터미널 실행  
   ```
   npm install
   npm run build
   ```
2. 빌드된 `main.js`, `manifest.json`, `styles.css` 파일을 Obsidian vault의 원하는 플러그인 폴더(예: `~/_doc/.obsidian/plugins/todo-asterisk-bullet`)에 복사
   cp todo-asterisk-bullet/obsidian/main.js todo-asterisk-bullet/obsidian/manifest.json todo-asterisk-bullet/obsidian/styles.css /Users/nowage/_doc/.obsidian/plugins/todo-asterisk-bullet/

3. Obsidian에서 플러그인 활성화
4. 명령어 팔레트에서 "Toggle Asterisk Bullet State" 실행 또는 단축키(**Opt+Shift+Enter (Mac) / Alt+Shift+Enter (Windows/Linux)**) 사용

#### 배포 방법
- 운영 환경에 배포: 빌드된 `main.js`, `manifest.json`, `styles.css` 파일을 `/Users/nowage/_doc/.obsidian/plugins/todo-asterisk-bullet` 폴더에 복사
- 플러그인 폴더를 zip으로 압축 후 GitHub Release에 업로드
- 또는 Obsidian 커뮤니티 플러그인 등록 가이드에 따라 제출

---

### 2. VSCode

#### 테스트 설치
1. `todo-asterisk-bullet/vscode` 폴더에서 터미널 실행
2. 의존성 설치:  
   ```
   npm install
   ```
3. 확장 개발 모드 실행:  
   ```
   code .
   ```
   F5(디버그)로 확장 테스트
4. 또는 `~/.vscode/extensions/todo-asterisk-bullet`에 폴더 복사 후 VSCode 재시작

#### 배포 방법
1. vsce 설치(최초 1회):  
   ```
   npm install -g vsce
   ```
2. 패키징:  
   ```
   vsce package
   ```
   (`.vsix` 파일 생성)

3. 마켓플레이스 배포:  
   * [확장 관리](https://marketplace.visualstudio.com/manage)에서 "+New extension"에 업로드
   

---
### 3. shell
* OS전체에서 작동하도록 keyboardMaestro에서 사용할 목적임. 
* 저장 대상 폴더는 ~/.bin/ 
#### 설정 방법

```sh
# 설치 스크립트 예시
mkdir -p ~/.bin/
cp todo-asterisk-bullet/shell/*  ~/.bin/
chmod +x ~/.bin/todo-asterisk-bullet_forward.sh ~/.bin/todo-asterisk-bullet_backward.sh
```
### 4. Zed
#### 아래 문제점 해결 전까지 사용 못함.
* build는 되나 테스트 설치 실패
* 에디터 직접 조작은 아직 지원 안함 (Zed API 제한)
* AI Assistant 패널에서만 사용 가능
* 단축키 설정은 현재 구현에서 불가

#### 테스트 설치 (Dev Extension)
1. `todo-asterisk-bullet/zed` 폴더에서 터미널 실행:
   ```bash
   cargo build --release
   ```
2. Zed 에디터에서 `Cmd+Shift+P` → "Extensions: Install Dev Extension" 선택
3. `todo-asterisk-bullet/zed` 폴더 선택해서 설치
4. keymap.json에 **Opt+Shift+Enter (Mac) / Alt+Shift+Enter (Windows/Linux)** 단축키를 수동 등록
5. slash command(`/todo`) 또는 단축키로 즉시 사용 가능

#### 배포 방법 (공식 마켓플레이스)
1. **사전 요구사항**: Rust는 반드시 `rustup`으로 설치 (brew 설치 시 동작 안함)
2. **zed-industries/extensions 저장소에 PR 제출**:
   ```bash
   # 1. extensions 저장소 fork 후 clone
   git clone https://github.com/your-username/extensions.git
   cd extensions
   
   # 2. 확장을 submodule로 추가
   git submodule add https://github.com/Finfra/vsCodeExt.git extensions/todo-asterisk-bullet
   
   # 3. extensions.toml에 엔트리 추가:
   [todo-asterisk-bullet]
   submodule = "extensions/todo-asterisk-bullet"
   path = "todo-asterisk-bullet/zed"
   version = "0.1.0"
   
   # 4. 정렬 및 커밋
   pnpm sort-extensions
   git add .
   git commit -m "Add todo-asterisk-bullet extension"
   ```
3. **PR 제출**: 머지되면 자동으로 Zed 확장 레지스트리에 배포
4. **업데이트**: submodule 업데이트 + extensions.toml 버전 수정 후 재 PR

---

## 참고

- 각 플랫폼별 상세 사용법 및 단축키는 각 폴더의 README.md 참고
- 상태 순환, 개발 규칙 등은 prd.md, rule.md 참고
- 오픈 소스: https://github.com/Finfra/vsCodeExt/tree/main/todo-asterisk-bullet
- 문의: NamJungGu(nowage@gmail.com) / Finfra Co., Ltd.
