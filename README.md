# 동네골목 (Dongne Golmok)

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

| 단계 | 상태 |
|---|---|
| 기획 문서 (MISSION/CONCEPT/ROADMAP/scenarios/shops) | ✅ 완료 |
| PPT v4 | ✅ 완료 |
| 환경 셋업 (폴더 + 에이전트 + GitHub) | 🟡 진행 중 (이 커밋) |
| DEV.md (구현 진입 문서) | ⏳ 다음 세션 (`dev-kickstart` 에이전트로) |
| Phase 1 프로토타입 (50개 가게 + AI 컨시어지) | ⏳ 미시작 |
| 50개 가게 fal 이미지 생성 | ⏳ 미시작 |
| Vercel 배포 | ⏳ 미시작 |

---

## 기술 스택 (예정)

5주차 `harbor-community` 패턴 차용.

- **Frontend**: 단일 `index.html` (React 18 CDN + Tailwind CDN + Babel standalone, no build)
- **Backend**: Vercel Serverless Functions (`api/*.js`, Node.js 18+, `?view=` 분기 패턴)
- **DB**: PostgreSQL (Supabase Pooler)
- **인증**: JWT 7일 + bcryptjs
- **AI**: Anthropic Claude API (Sonnet 4.6) — 컨시어지
- **이미지 생성**: fal.ai (가게 사진 사전 생성, v1.5 이후 ImageKit 검토)
- **폰트**: Pretendard Variable

---

## 폴더 구조

```
dongne-golmok/
├── docs/                     # 기획 문서 (이 커밋에 포함)
│   ├── README.md             # 문서 인덱스
│   ├── MISSION.md            # 정체성·v1 범위·성공기준
│   ├── CONCEPT.md            # AI 컨시어지·차별점·비주얼 톤
│   ├── ROADMAP.md            # v1 → v1.5 → v2 → v3
│   ├── shops_mock.md         # 염창동 50개 가게 목업
│   ├── scenarios_mock.md     # 8개 컨시어지 데모 시나리오
│   └── pitch_deck/
│       └── dongne_golmok_v4.pptx
├── api/                      # Vercel Serverless Functions (예정)
├── public/
│   └── images/               # fal로 생성한 가게 이미지 (예정)
├── .claude/
│   └── agents/               # Claude Code 에이전트
├── .env.example              # 환경변수 템플릿
├── .gitignore
└── README.md                 # 이 파일
```

---

## 환경변수

`.env.example` 참고. 실제 값은 `.env.local` 에 작성 (gitignored).

| 변수 | 용도 |
|---|---|
| `ANTHROPIC_API_KEY` | AI 컨시어지 (Sonnet 4.6) |
| `DATABASE_URL` | Supabase Postgres pooler |
| `FAL_API_KEY` | fal.ai 이미지 생성 |
| `JWT_SECRET` | 인증 토큰 서명 (128 hex) |
| `PORT` | 로컬 dev 포트 (옵션, 기본 3003) |

---

## 기획 문서 진입 순서

이 프로젝트에 새로 합류한 사람(또는 며칠 뒤의 형 자신)을 위한 진입 순서:

1. **README.md** (이 문서) — 전체 그림
2. **docs/MISSION.md** — 정체성 + v1 범위
3. **docs/CONCEPT.md** — 어떤 느낌인지
4. **docs/scenarios_mock.md** — 실제로 어떻게 작동하는지
5. **docs/shops_mock.md** — 데이터 구조
6. **docs/ROADMAP.md** — 어디로 가는지

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

## 라이센스

미정 (파일럿 단계).

## 메인테이너

[@mmake7](https://github.com/mmake7)
