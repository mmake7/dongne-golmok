# 🛠️ 동네골목 — DEV.md (개발 가이드)

> 동네 친구에게 묻는 것처럼 — AI 컨시어지 동네 알림판.
> Architecture: **Single-File + Vercel Serverless Functions** (Option 1 커스터마이즈)
> 작성일: 2026-05-07 (Week 6 Day 후반)

이 문서는 동네골목 v1 MVP의 **구체 구현 계획**이다. MISSION.md(왜·무엇·누구) / CONCEPT.md(느낌) / PAYMENT.md(결제) / ROADMAP.md(시간 축)의 결정을 받아 **"어떻게 만들 것인가"**를 정리한다.

---

## Requirements (v1 파일럿)

> 데모 가능한 최소 요건. MISSION.md Core Features 6개를 코드 단위로 분해.

- [ ] **R1. AI 컨시어지** — 자연어 입력 → Claude API → 한 줄 답변 + 참조 가게 ID 반환
- [ ] **R2. 오늘의 동네 한 줄** — 페이지 로드 시 자동 호출 → 환영 메시지
- [ ] **R3. 가게 목록** — 50개 가게 카드 그리드. 정착형/이동형 토글 + 카테고리 필터
- [ ] **R4. 가게 상세** — 모달 또는 별도 화면. 입고 글·운영시간·결제 옵션
- [ ] **R5. 목업 등록 (데모용)** — `/api/mock-admin/post`로 새 글 1~2개 라이브 등록 (메모리 휘발 OK)
- [ ] **R6. 결제 메타데이터 표시** — 카드 배지(💳/💵/🏦/🎫) + 상세 안내문 ("v2부터 실제 결제")
- [ ] **R7. 시뮬레이션 로그인** — DB 없이 가짜 user 객체 반환 (UI에 "데모유저" 표시 정도)
- [ ] **R8. Vercel 배포** — 공개 URL로 누구나 접속 가능
- [ ] **R9. 8개 데모 시나리오 검증** — `scenarios_mock.md`의 8개 질문 모두 자연스러운 답

---

## Non-goals (v1에서 안 할 것)

> MISSION.md의 Anti-Scope를 코드 관점으로 재정리.

| 항목 | v1에서 안 함 | 이전/이후 처리 |
|---|---|---|
| PostgreSQL / Supabase DB | JSON 파일로 대체 | v1.5에서 마이그레이션 |
| 실제 회원가입 (JWT, bcrypt) | 시뮬레이션 응답 | v2에서 진짜 인증 |
| TossPayments 결제 위젯 | 메타데이터 배지만 | v2 핵심 기능 |
| 1:1 채팅 / 푸시 알림 | 미구현 | v1.5에서 게시판, v2에서 PWA 푸시 |
| 카카오맵 / 진짜 GPS | 행정동 텍스트만 | v1.5 검토 |
| 가게 사진 (fal 생성) | placeholder URL | v1.5에서 fal 일괄 생성 |
| PWA 변환 | 미구현 | v1.5 |
| 매너온도 / 평가 | 미구현 | v2 단골 등록 |
| 가게 사장님 셀프 가입 폼 | 미구현 (데모용 등록만) | v2 모집 시 |

---

## Style (UI/UX 가이드)

> CONCEPT.md의 "따뜻한 흙·크라프트 톤"을 토큰화.

### 컬러 토큰
```css
--bg-cream     : #E8DFD3;  /* 메인 배경 — 크라프트 베이지 */
--bg-warm      : #F5E6C8;  /* 보조 배경 — 따뜻한 옐로우 */
--text-primary : #3E2A1F;  /* 본문 — 짙은 갈색 */
--accent-orange: #D87844;  /* 강조 — 단풍 오렌지 (정착형 / CTA) */
--accent-red   : #A0413A;  /* 강조 보조 — 짙은 적갈색 */
--accent-moss  : #7A8B5C;  /* 이동형 가게 표시 — 모스 그린 */
--paper-edge   : #C8B89C;  /* 카드 테두리 — 종이 결 */
```

### 폰트 (Google Fonts CDN)
- 헤더: **Noto Serif KR** (정성스러운 손글씨 느낌)
- 본문: **Pretendard** (가독성)
- 강조 한 줄(선택): 카페24 빛나는별 또는 Gowun Batang

### 페르소나 톤 (AI 응답)
- ✅ "오늘 햇살떡에 새 가래떡 나왔대요. 6시 전에 가시면 따끈할 거예요."
- ❌ "검색 결과 3건이 발견되었습니다."
- 한두 문장. 카톡 톤. 친근한 존댓말.

### Anti-Visual
차가운 IT 톤(네이비·검정·산세리프만), 당근마켓 주황+파스텔, 글래스모피즘, ChatGPT풍 단순 챗봇 UI 모두 금지.

---

## Key Concepts (코드 안에서 자주 쓸 용어)

| 용어 | 코드 표기 | 정의 |
|---|---|---|
| 가게 | `shop` | 등록된 50개 중 하나 |
| 정착형 | `type: "정착형"` | 고정 위치 가게 |
| 이동형 | `type: "이동형(정기)"` 또는 `"이동형(가끔)"` | 위치/시간 변동 |
| 등록 글 | `posts: string[]` | 가게가 올린 짧은 글 (오늘의 입고 등) |
| 결제 옵션 | `payment_options: ("card"\|"cash"\|"transfer"\|"prepay")[]` | 4종 다중 |
| 컨시어지 | concierge | AI가 자연어 답변 |
| 오늘의 한 줄 | today's-line | 진입 시 환영 메시지 |
| 시뮬 로그인 | mock-auth | DB 없이 가짜 user 반환 |

---

## Open Questions (DEV 단계 미결정)

1. **이미지 placeholder 전략** — Unsplash random, 단색 SVG, 또는 가게 이름 텍스트 카드? 일단 단색 SVG + 이니셜로 시작하고 v1.5에서 fal.
2. **모바일 우선 vs 데스크톱 우선** — 데모는 노트북에서 시연하지만 실제 사용자는 모바일. Tailwind 기본은 mobile-first. 양쪽 다 OK 한 레이아웃.
3. **AI 응답 캐싱** — 동일 질문 반복 시 Claude API 호출 비용. v1은 캐싱 없음. v1.5에서 단순 in-memory 캐시 검토.
4. **Vercel Serverless 콜드 스타트** — Claude API 호출까지 합치면 응답 3초 목표 빠듯할 수 있음. 첫 요청 후 워밍업되면 OK.
5. **shops.json 50개를 한 번에 Claude에 보낼 때 토큰 비용** — 50개 가게 데이터가 약 5~8K 토큰 추정. Sonnet으로 충분히 감당.

---

## 선택된 개발 구조

### Architecture: Single-File + Vercel Serverless

| 레이어 | 파일/위치 | 기술 |
|---|---|---|
| Frontend | `index.html` | React 18 (CDN) + Tailwind (CDN) + Babel standalone |
| Backend | `api/*.js` | Vercel Serverless Functions (Node 18+) |
| Data | `data/*.json` | 정적 JSON (50개 가게 + 행정동) |
| Static | `public/images/` | 이미지 placeholder |
| AI | Claude API | `@anthropic-ai/sdk`, Sonnet 4.6 또는 4.7 |

### 왜 이 구조인가
- **Single-File HTML**: dev-kickstart 에이전트의 Option 1 그대로. 프로토타입 속도 최대.
- **Vercel Serverless** (vs Express `single.js`): 배포가 `vercel --prod` 한 줄. 별도 서버 인스턴스 관리 불필요. v1 파일럿에 적합.
- **JSON 파일** (vs PostgreSQL): 50개 가게 정적 데이터. v1은 사용자가 데이터 안 추가함. DB는 v1.5에서.
- **Claude Sonnet**: Opus는 비용 부담, Haiku는 한국어 자연스러움 부족. Sonnet 4.6이 톤·비용 균형.

### 의도적으로 안 넣은 것
- jsonwebtoken / bcrypt — 시뮬 로그인이라 불필요
- pg / @supabase/supabase-js — DB 없음
- React Router — 모달 + 상태 전환으로 충분
- 빌드 도구(Vite/webpack) — Babel standalone으로 inline 변환

---

## 프로젝트 구조

```
dongne-golmok/
├── index.html              # SPA 진입점 (모든 프론트엔드 코드 포함)
├── api/
│   ├── auth.js             # 시뮬 로그인 (POST /api/auth/login)
│   ├── shops.js            # 가게 목록·상세 (GET /api/shops, /api/shops/:id)
│   ├── search.js           # 키워드 검색 (GET /api/search?q=)
│   ├── ai.js               # AI 컨시어지 (POST /api/ai/concierge)
│   └── mock-admin.js       # 데모용 등록 (POST /api/mock-admin/post)
├── data/
│   ├── shops.json          # 50개 가게 (shops_mock.md → JSON 변환)
│   └── neighborhoods.json  # 염창동 행정동 정보 (간단)
├── public/
│   └── images/
│       └── placeholders/   # SVG 이니셜 카드 50장 (일단 자동 생성)
├── docs/                   # MISSION / CONCEPT / DEV / ROADMAP / PAYMENT / shops_mock / scenarios_mock
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

**index.html 내부 구조** (`<script type="text/babel">` 블록):
1. React Hooks Destructuring (`const { useState, useEffect, useMemo } = React;`)
2. Design Tokens 주입 (`<style>` 또는 Tailwind 커스텀 컬러)
3. Design System Components (`Badge`, `Card`, `Modal`, `Button`)
4. Layout Components (`Header`, `ConciergeBar`, `TodayLine`, `ShopGrid`, `ShopCard`)
5. Page-level (`MainView`, `ShopDetailModal`)
6. App Component (라우팅 = 모달 상태 전환, 데이터 fetch)
7. Rendering (`ReactDOM.createRoot(...).render(<App />)`)

---

## 📋 TODO List (Vibe Coding Phase 순서)

### Phase 1: 디자인 & 프로토타이핑 (UI 골격 + 더미 데이터)
> 끝났을 때: 브라우저에서 50개 가게 카드가 보이고, 정착/이동 토글이 동작하고, 가게 클릭 시 상세 모달이 뜬다. 백엔드 호출 X — `fetch('/data/shops.json')`만 사용.

- [ ] 🟢 `data/shops.json` 생성 — `docs/shops_mock.md`의 50개 가게를 스키마에 맞춰 JSON으로 변환
- [ ] 🟢 `data/neighborhoods.json` 생성 — 염창동 단일 항목 (확장 대비)
- [ ] 🟢 `public/images/placeholders/` 50개 SVG 이니셜 카드 생성 (가게 이름 첫 글자 + 카테고리 색)
- [ ] 🟢 `index.html` 골격 — React/Tailwind/Babel CDN, 디자인 토큰 주입
- [ ] 🟢 `Header` 컴포넌트 — "동네골목 GOLMOK." 로고 + "염창동" 표시
- [ ] 🟢 `ConciergeBar` 컴포넌트 — 큰 텍스트 입력 + "물어보기" 버튼 (Phase 1은 입력만, 호출 X)
- [ ] 🟡 `TodayLine` 컴포넌트 — 더미 환영 메시지 (Phase 3에서 AI 응답으로 교체)
- [ ] 🟡 `ShopGrid` + `ShopCard` — 50개 카드 그리드, 정착/이동 토글, 카테고리 필터
- [ ] 🟡 `ShopDetailModal` — 가게 클릭 시 모달. 입고 글·운영시간·결제 배지·안내문
- [ ] 🟢 `PaymentBadge` 컴포넌트 — 4가지 옵션(💳/💵/🏦/🎫) 매핑
- [ ] 📌 `git commit` — `feat: Phase 1 — UI 골격 + 50개 가게 JSON`
- [ ] 📌 체크포인트: `npx serve .` 또는 `index.html` 직접 열어서 50개 카드·필터·모달 모두 동작 확인

### Phase 2: 기본 기능 — 백엔드 함수 5개 (Vercel Serverless)
> 끝났을 때: 프론트엔드가 더미 데이터 직접 fetch 대신 `/api/*` 호출로 전환됐고, 5개 함수가 모두 응답한다. AI는 아직 X.

- [ ] 🟢 `package.json` 생성 — `@anthropic-ai/sdk` 의존성만
- [ ] 🟢 `npm install` 실행
- [ ] 🟢 `vercel.json` 작성 — static + serverless 빌드 설정
- [ ] 🟢 `api/shops.js` — `GET /api/shops?type=&category=` 필터 로직 + `GET /api/shops/:id` 상세
- [ ] 🟢 `api/search.js` — `GET /api/search?q=` 태그/posts/카테고리 매칭
- [ ] 🟢 `api/auth.js` — `POST /api/auth/login` 가짜 user 반환 (`{ name: "데모유저", neighborhood: "염창동" }`)
- [ ] 🟢 `api/mock-admin.js` — `POST /api/mock-admin/post` 메모리 변수에 글 추가 (휘발 OK)
- [ ] 🟡 프론트엔드 통합 — 직접 fetch JSON → `/api/shops` 호출로 전환
- [ ] 🟡 로컬 테스트 — `vercel dev` 또는 `npx vercel dev`로 5개 엔드포인트 응답 확인
- [ ] 📌 `git commit` — `feat: Phase 2 — 백엔드 함수 5개 (목업 모드)`
- [ ] 📌 체크포인트: 모든 UI가 백엔드 호출로 동작. 함수 5개 모두 200 응답.

### Phase 3: 핵심 & 어려운 기능 — AI 컨시어지 (가장 불확실, 먼저 시도)
> 끝났을 때: ConciergeBar에 자연어 질문 입력 → Claude API → 동네 친구 톤 한 줄 답변 + 참조 가게 강조. 8개 시나리오 검증.

- [ ] 🔴 `api/ai.js` 핵심 구현 ⚠️ 실패 시 우회: Claude API 호출 안 되면 정적 매칭 백업
  - Anthropic SDK 초기화 (`ANTHROPIC_API_KEY` env 사용)
  - `data/shops.json` 전체 로드
  - 시스템 프롬프트 + 가게 데이터 + 사용자 질문 → Claude Sonnet 호출
  - 응답 파싱: `answer` (한두 문장) + `referencedShops` (가게 ID 배열)
  - 모델: `claude-sonnet-4-6` (또는 가능하면 `claude-sonnet-4-7`)
- [ ] 🔴 시스템 프롬프트 작성 — CONCEPT.md의 페르소나 톤 가이드 + 응답 규칙
  - 친근한 존댓말, 한두 문장, 구체적 가게 이름·시간 명시
  - "검색 결과" 같은 시스템 톤 X
  - 영업시간·요일·시간대 고려
  - 응답 포맷 강제 (JSON으로 `{answer, referencedShops}`)
- [ ] 🟡 `ConciergeBar` → `/api/ai/concierge` 호출 + 응답 표시
- [ ] 🟡 참조 가게 ID로 `ShopGrid` 카드 강조 (테두리 단풍 오렌지)
- [ ] 🟡 `TodayLine` 자동 호출 — 페이지 로드 시 `POST /api/ai/concierge` (`initial: true` 플래그)
- [ ] 🔴 `scenarios_mock.md`의 8개 시나리오로 동작 검증
  - 응답이 동네 친구 톤이 아니면 시스템 프롬프트 튜닝
  - 가게 데이터 부족으로 답이 어색하면 `shops.json` 보강
- [ ] 📌 `git commit` — `feat: Phase 3 — AI 컨시어지 통합 (Claude API)`
- [ ] 📌 체크포인트: 8개 시나리오 중 최소 6개에서 자연스러운 한 줄 답변. 평균 응답 < 3초.

### Phase 4: 마무리 & 배포
> 끝났을 때: 공개 URL이 발급되고, 모바일·데스크톱 양쪽에서 핵심 플로우 동작.

- [ ] 🟢 `.env.example` 작성 — `ANTHROPIC_API_KEY`
- [ ] 🟢 `.gitignore` 점검 — `.env`, `node_modules/` 등
- [ ] 🟡 Vercel 프로젝트 연결 (`vercel link`)
- [ ] 🟡 환경변수 등록 — `vercel env add ANTHROPIC_API_KEY production`
- [ ] 🟡 첫 배포 — `vercel --prod`
- [ ] 🟡 배포 URL에서 핵심 플로우 검증 — 카드 50개 / AI 컨시어지 / 모달 / 결제 배지
- [ ] 🟡 모바일 시뮬레이션(Chrome DevTools) — 레이아웃 깨짐 없는지
- [ ] 🟡 README.md 갱신 — 배포 URL + "v1 MVP 배포 완료" 한 줄
- [ ] 📌 `git commit` — `feat: Phase 4 — Vercel 배포 + README 갱신`
- [ ] 📌 체크포인트: 배포 URL이 누구나 접속 가능. 1:1 시연 가능 상태.

---

## Data Schema

### `data/shops.json`

```json
{
  "shops": [
    {
      "id": "g001",
      "name": "햇살떡",
      "owner_nick": "떡할매",
      "type": "정착형",
      "category": "떡·전통과자",
      "location": {
        "address": "강서구 염창동 강서로 안쪽 골목",
        "near": "염창역 5분"
      },
      "schedule": {
        "weekday": "06:00-19:00",
        "saturday": "06:00-15:00",
        "sunday": "휴무",
        "note": null
      },
      "posts": [
        "오늘 가래떡 아침 6시에 다 뽑았어요. 김 모락모락",
        "쑥인절미 한 솥 새로. 봄 쑥이라 향이 진해요",
        "내일 시루떡 미리 주문 받아요. 제사용도 가능"
      ],
      "tags": ["떡", "가래떡", "인절미", "쑥떡", "시루떡", "노포"],
      "payment_options": ["cash", "prepay"],
      "image": "/images/placeholders/g001.svg",
      "notes": "할머니 30년 노포. 카드 단말기 없음."
    }
  ]
}
```

**type 값 4종**: `"정착형"` / `"1인메이커"` / `"이동형(정기)"` / `"이동형(가끔)"`

**payment_options 4종**: `"card"` / `"cash"` / `"transfer"` / `"prepay"`
- 배지 매핑: card→💳 / cash→💵 / transfer→🏦 / prepay→🎫

### `data/neighborhoods.json`

```json
{
  "current": "염창동",
  "neighborhoods": [
    {
      "id": "yeomchang",
      "name": "염창동",
      "district": "강서구",
      "stations": ["염창역", "양천향교역"],
      "active": true,
      "shop_count": 50
    }
  ]
}
```

---

## 외부 설정 필요 항목

### 필수 (Must Have)

| 항목 | 설명 | 획득 방법 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API 호출용 | console.anthropic.com → Settings → API Keys → Create Key. 신용카드 결제 정보 등록 필요. |
| Vercel 계정 | 배포 호스팅 | vercel.com → GitHub로 가입. 무료 Hobby 플랜으로 충분. |
| GitHub 리포 (이미 있음) | 코드 저장 + Vercel 연동 | `mmake7/dongne-golmok` 이미 존재 |

### 선택 (Nice to Have, v1엔 없어도 됨)

| 항목 | 설명 | 시점 |
|---|---|---|
| 커스텀 도메인 | `dongne-golmok.kr` 또는 `golmok.kr` | v1.5 (도메인 결정 후) |
| Vercel Analytics | 방문자 트래킹 | 시연 시작 후 |

### `.env.example`

```bash
# Claude API (필수)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxx

# v1.5 이후 추가될 것 (지금은 비워둠)
# DATABASE_URL=
# JWT_SECRET=
# IMAGEKIT_PUBLIC_KEY=
# IMAGEKIT_PRIVATE_KEY=
# TOSS_PAYMENTS_CLIENT_KEY=
# TOSS_PAYMENTS_SECRET_KEY=
```

---

## 시작하기

### 1. 의존성 설치

```bash
cd D:\Dropbox\workspace\dongne-golmok
npm install
```

### 2. 환경변수 셋업 (로컬)

```bash
copy .env.example .env
# .env 파일 열어서 ANTHROPIC_API_KEY 실제 값 입력
```

### 3. 로컬 개발 서버

```bash
# 옵션 A — 정적 + Serverless 둘 다
npx vercel dev

# 옵션 B — Phase 1까지는 정적 서버로 충분
npx serve .
```

### 4. Vercel 배포 (Phase 4)

```bash
npx vercel link        # 처음 한 번
npx vercel env add ANTHROPIC_API_KEY production
npx vercel --prod
```

### 5. 시연 시 체크리스트

- [ ] AI 컨시어지에 8개 시나리오 중 3개 던져보기
- [ ] 정착/이동 필터 토글
- [ ] 가게 카드 클릭 → 모달
- [ ] 결제 배지 4종 모두 보이는 가게 1개 확인
- [ ] 모바일 사이즈에서도 카드 깨짐 없음

---

## Test Plan (각 Phase 검증법)

| Phase | 검증 방법 | 통과 기준 |
|---|---|---|
| Phase 1 | 브라우저에서 `index.html` 직접 열기 | 50개 카드 표시 / 토글·필터 동작 / 모달 열림 |
| Phase 2 | `npx vercel dev` 후 5개 엔드포인트 curl | 모두 200 + 정상 JSON |
| Phase 3 | `scenarios_mock.md` 8개 질문 입력 | 6/8 이상 동네 친구 톤 + 참조 가게 정확 |
| Phase 4 | 배포 URL을 다른 브라우저(시크릿)에서 접속 | 핵심 플로우 모두 동작 / 모바일 OK |

### scenarios_mock.md 검증 우선순위

데모 시 임팩트 큰 순으로 시나리오 검증 (실제 시나리오는 `scenarios_mock.md` 참조):
1. 시간 인식 ("밤 11시 순대 먹고 싶어")
2. 이동형 인식 ("이번 주 양말차 언제 와?")
3. 결제 인식 ("카드 안 받는 떡집 어디?")
4. 카테고리 모호 ("저녁에 뭐 먹지?")
5. 부재 답변 ("기저귀 어디서 사?" → "그건 다음 단계에서")

---

## Known Limitations (v1에서 의도적으로 안 된 것)

> 시연 시 "왜 이건 안 돼요?" 질문 받으면 이 표를 보여줄 수 있게.

| 안 되는 것 | 이유 | 언제 됨 |
|---|---|---|
| 회원가입 (실제) | DB 없음. 시뮬 로그인만. | v2 |
| 가게 데이터 갱신 | JSON 파일이라 새로고침하면 덮임 | v1.5에서 PostgreSQL |
| 실제 결제 | TossPayments 가맹·정산 미구축 | v2 핵심 기능 |
| 푸시 알림 | 모바일 앱 영역 | v1.5 PWA, v2 푸시 |
| 진짜 GPS / 길찾기 | 행정동 텍스트만 | v1.5 카카오맵 결합 |
| 실제 가게 사진 | placeholder SVG | v1.5 fal 일괄 생성 |
| 가게 사장님 가입 폼 | 모집 안 함 | v2 실제 모집 |
| 1:1 채팅 | 시간 폭발 위험 | v1.5 게시판 형태 |
| 매너온도 / 평가 | 단골은 다른 모양 | v2 단골 등록 |
| 다국어 | 한국어만 | 장기 (v3+) |
| 다른 동네 | 염창동 고정 (파일럿) | v3 강서구 6개 동 |

---

## 개발 시 주의사항

### Single-File 규칙
- 모든 프론트엔드 코드는 `index.html` 하나에 넣는다. 별도 `app.js`, `styles.css` 만들지 말 것.
- React 컴포넌트는 `<script type="text/babel">` 블록 안에 함수로 정의.
- Tailwind는 CDN 사용. 커스텀 컬러는 `<style>` 블록의 CSS 변수 + `tailwind.config` inline 설정.

### Vercel Serverless 규칙
- 각 `api/*.js` 파일은 `export default async function handler(req, res) { ... }` 패턴.
- `data/*.json`은 함수 안에서 `fs.readFileSync(path.join(process.cwd(), 'data/shops.json'))`로 읽음.
- `vercel.json`에서 빌드 설정.

### 한국어 우선
- UI 텍스트, 코드 주석, commit 메시지 모두 한국어 OK.
- 변수명은 영어 (camelCase). 단, 도메인 용어는 한국어 OK (예: `정착형` 그대로).

### 시간 자원 우선순위
- 막히면 멈추고 사용자에게 물어보기 (특히 Phase 3 AI 톤 검증 시점).
- Phase 1·2는 일반적인 패턴이라 순조로움. Phase 3가 변동성 큼.
- Phase 4 배포에서 도메인 / API key 등록은 사용자 액션 필요.

---

## Update Log

- **2026-05-07** (Week 6 Day 후반) — DEV.md 초안. dev-kickstart 에이전트 구조 + 형의 8개 사전결정 반영. Architecture는 Option 1을 Vercel Serverless로 커스터마이즈.
