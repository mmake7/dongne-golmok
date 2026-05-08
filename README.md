# 동네골목 (Dongne Golmok / GOLMOK.)

> 동네 친구에게 묻는 것처럼.
> 숨어있는 우리동네가게와 주민이 서로를 발견하는 곳.

---

## 이 프로젝트는

**투자자/협력자에게 보여줄 파일럿**으로, **AI 컨시어지가 동네 사람의 자연어 질문을 동네 가게 정보로 답해주는** 동네 알림 서비스입니다.

- 출발: harbor.school 6주차 quest #5 (당근마켓 클론)
- 진화: 단순 클론 → 동네 입고 알림 → AI 컨시어지
- 현재: 본 프로젝트로 분리 결정. quest 마감과 분리해 깊이 가져감.
- 파일럿 지역: 서울 강서구 염창동
- 데이터: 50개 가게 목업으로 데모

핵심 시나리오 한 줄:
> "밤 11시 순대 먹고 싶어" → AI가 염창동에서 지금 열린 순대 가게를 찾아서 답해줌.

대상은 **공식 상권 바깥의 모든 소상공인** — 떡집·양장점·1인 메이커·트럭·노점.

---

## 진행 상태

> **v1 진행 중** — Phase 1·2·3 코드 완료, Vercel 배포는 다음 세션.

| 단계 | 상태 | 메모 |
|---|---|---|
| 기획 문서 (MISSION/CONCEPT/PAYMENT/ROADMAP/scenarios/shops) | ✅ 완료 | docs/ 참조 |
| PPT v4 | ✅ 완료 | docs/pitch_deck/ |
| PPT v5 | ⏳ 다음 세션 | 결제 컨셉 반영 슬라이드 |
| DEV.md (v1 MVP 구현 계획) | ✅ 완료 | Architecture: Single-File + Vercel Serverless |
| **Phase 1 — UI 골격 + 50개 가게 JSON** | ✅ 완료 | `index.html` + `data/shops.json` |
| **Phase 2 — 백엔드 함수 (목업 모드)** | ✅ 완료 | `api/shops.js` / `search.js` / `auth.js` / `mock-admin.js` |
| **Phase 3 — AI 컨시어지 (Claude API)** | ✅ 완료 | `api/ai.js`, prompt caching, 시나리오 3개 빠른 검증 통과 |
| **Phase 4 — Vercel 배포** | ⏳ 다음 세션 | `vercel link` → env → `vercel --prod` |
| 8개 시나리오 풀 톤 검증 | ⏳ 다음 세션 | scenarios_mock.md 8개 |
| 50개 가게 fal 이미지 생성 | ⏳ v1.5 | 현재는 inline SVG placeholder |

### v1에서 의도적으로 안 하는 것

| 항목 | 이유 | 시점 |
|---|---|---|
| PostgreSQL DB | 50개 정적 데이터엔 JSON으로 충분 | v1.5 |
| 실제 회원가입 (JWT) | 데모 시연 충분치 않음 | v2 |
| TossPayments 결제 | 가맹·정산 시스템 v1 영역 X | v2 핵심 기능 |
| 1:1 채팅 / 푸시 알림 | 시간 폭발 위험 | v1.5 게시판, v2 푸시 |
| 카카오맵 / 진짜 GPS | 행정동 텍스트만 | v1.5 |
| 실제 가게 사진 | inline SVG placeholder로 대체 | v1.5 fal 일괄 생성 |

자세한 v1 vs v1.5+ 분리는 `docs/DEV.md` Non-goals 섹션 참조.

---

## 로컬에서 띄우기

### 정적 모드 (Phase 1 동작 — UI 골격 + 50개 가게)

```bash
npx serve .
# → http://localhost:3000 (또는 -l 3088 등으로 포트 지정)
```

`/api/*` 호출은 자동으로 정적 파일 fallback. AI 컨시어지는 안내 메시지만 표시.

### 풀 모드 (Phase 2·3 동작 — 백엔드 + AI 호출)

```bash
npm install
cp .env.example .env
# .env에 ANTHROPIC_API_KEY=sk-ant-... 입력

npx vercel dev
# → http://localhost:3000 — /api/shops, /api/ai, /api/auth, /api/search, /api/mock-admin 모두 동작
```

---

## 기술 스택 (실제 박힌 것 + 예정)

### v1 MVP (현재 박혀있는 것)

- **Frontend**: 단일 `index.html` — React 18 CDN + Tailwind CDN + Babel standalone (no build)
- **Backend**: Vercel Serverless Functions — `api/*.js` (Node 18+, CommonJS)
- **Data**: 정적 JSON (`data/shops.json`, `data/neighborhoods.json`)
- **AI**: Anthropic Claude API (Sonnet 4.6) — 시스템 프롬프트 + 가게 50개 컨텍스트 + ephemeral prompt caching
- **폰트**: Noto Serif KR (헤더, 손글씨 느낌) + Pretendard (본문)
- **디자인**: 따뜻한 흙·크라프트 톤 (#E8DFD3 베이지 / #3E2A1F 짙은 갈색 / #D87844 단풍 오렌지 / #7A8B5C 모스 그린)

### v1.5+ 예정

- **DB**: Supabase PostgreSQL (현재 JSON 파일)
- **인증**: JWT + bcryptjs (현재 시뮬 로그인)
- **이미지**: fal.ai 사전 생성 → ImageKit (현재 inline SVG)
- **결제**: TossPayments 통합 (v2 핵심)
- **PWA**: 모바일 홈화면 추가 (v1.5)
- **카카오맵**: 가게 위치 정확도 + 길찾기 (v1.5)

---

## 폴더 구조

```
dongne-golmok/
├── index.html              # SPA 진입점 (모든 프론트엔드 코드 포함)
├── api/
│   ├── shops.js            # GET /api/shops?type=&category=&id=&q=
│   ├── search.js           # GET /api/search?q= (가중치 기반)
│   ├── auth.js             # GET·POST /api/auth (시뮬 로그인)
│   ├── mock-admin.js       # GET·POST·DELETE /api/mock-admin (메모리 휘발 글)
│   └── ai.js               # POST /api/ai { question | initial }
├── data/
│   ├── shops.json          # 50개 가게 (정착 33 / 메이커 7 / 이동정기 6 / 이동가끔 4)
│   └── neighborhoods.json  # 염창동 정보
├── docs/
│   ├── README.md
│   ├── MISSION.md          # 정체성·v1 범위·성공기준
│   ├── CONCEPT.md          # AI 컨시어지·차별점·비주얼 톤
│   ├── ROADMAP.md          # v1 → v1.5 → v2 → v3
│   ├── PAYMENT.md          # 결제 컨셉·4가지 모델·v2 도입 계획
│   ├── DEV.md              # v1 MVP 구현 계획 (Phase 1~4)
│   ├── shops_mock.md       # 염창동 50개 가게 목업 원본
│   ├── scenarios_mock.md   # 8+2개 컨시어지 데모 시나리오
│   ├── sessions/           # Claude Code 세션 작업 지시서
│   └── pitch_deck/
│       └── dongne_golmok_v4.pptx
├── public/
│   └── images/             # 가게 이미지 (v1.5에서 fal 생성)
├── .claude/
│   └── agents/             # Claude Code 프로젝트 에이전트
├── package.json            # @anthropic-ai/sdk
├── vercel.json
├── .env.example
├── .gitignore
└── README.md               # 이 파일
```

---

## 환경변수

`.env.example` 참고. 실제 값은 `.env`에 작성 (`.gitignore`로 보호됨).

### v1 필수

| 변수 | 용도 |
|---|---|
| `ANTHROPIC_API_KEY` | AI 컨시어지 (Sonnet 4.6) |

### v1.5+ 예정

| 변수 | 용도 | 시점 |
|---|---|---|
| `DATABASE_URL` | Supabase Postgres pooler | v1.5 |
| `JWT_SECRET` | 인증 토큰 서명 (128 hex) | v2 |
| `FAL_API_KEY` | fal.ai 이미지 생성 | v1.5 |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` | 이미지 호스팅 | v1.5 |
| `TOSS_PAYMENTS_CLIENT_KEY` / `TOSS_PAYMENTS_SECRET_KEY` | 결제 통합 | v2 |

---

## 기획 문서 진입 순서

이 프로젝트에 새로 합류한 사람(또는 며칠 뒤의 형 자신)을 위한 진입 순서:

1. **README.md** (이 문서) — 전체 그림 + 진행 상태
2. **docs/MISSION.md** — 정체성 + v1 범위
3. **docs/CONCEPT.md** — 어떤 느낌인지 (페르소나·톤)
4. **docs/scenarios_mock.md** — 실제로 어떻게 작동하는지 (8개 시나리오)
5. **docs/shops_mock.md** — 데이터 구조 (50개 가게)
6. **docs/PAYMENT.md** — 결제 컨셉 (v2 핵심)
7. **docs/ROADMAP.md** — 어디로 가는지 (v1 → v1.5 → v2 → v3)
8. **docs/DEV.md** — 구현 계획 (Phase 1~4 + TODO + 외부 설정)

---

## 의사결정 원칙

이 프로젝트는 **"수능시험도 아니고 결국 내 발전을 위한 거"**라는 마음으로 진행한다.

- 마감 압박 X
- 시간 두고 깊이 가져감
- 흥분 상태가 아닌 차분한 상태의 사유가 모이는 곳
- 산책·출퇴근·잠들기 전에 떠오른 것은 살아있는 문서로 추가

---

## 메타

- **출자 구조 (예정)**: 형 51% / 누리인포스 49%
- **첫 IP**: 누리인포스 JV의 자체 서비스로 발전 가능성
- **장기 비전**: 서울 25개 자치구의 동마다 작동하는 AI 컨시어지 네트워크

---

## 통합 기획안 PDF

본 프로젝트의 정체성·문제·사용자·v1 범위·미래 비전을 한 PDF로 정리한 통합 기획안.

- **파일**: [`docs/dongne-golmok-plan.pdf`](./docs/dongne-golmok-plan.pdf)
- **GitHub raw**: https://github.com/mmake7/dongne-golmok/blob/main/docs/dongne-golmok-plan.pdf
- **활용**:
  - 투자자·협력자 1:1 시연 자료
  - harbor.school 6주차 quest #3 (개인 프로젝트 기획서) 충족 자산
  - 단톡방·외부 공유용 (민감 정보 점검 완료)

PDF 외에 같은 내용은 분할 마크다운으로도 보존 (`docs/MISSION.md` / `CONCEPT.md` / `ROADMAP.md` / `DEV.md` + 루트 `DEV.md` v0.1 / `AUDIENCES.md` v0.1).

---

## 라이센스

미정 (파일럿 단계).

## 메인테이너

[@mmake7](https://github.com/mmake7)
