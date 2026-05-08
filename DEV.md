# 🔧 동네골목 — DEV.md (v0.1)

> v0.1: 학습 quest #3 충족용 + 본 프로젝트 v1.5 기초 자산.
> 본격 보강은 v1.5 단계 dev-kickstart 에이전트로 진행.
> 더 깊은 구현 가이드는 [`docs/DEV.md`](./docs/DEV.md) (438줄) 참조.

---

## MVP 범위 (v1)

3주 안에 동작 검증할 핵심 기능. **yes/no 명확.**

### ✅ YES (v1에 포함)

1. **AI 컨시어지 검색** — 자연어 질문 → 한 줄 답변 + 추천 가게 ID(들)
2. **가게 목록 + 상세** — 정착형/이동형 토글, 카테고리 필터, 50개 목업 데이터
3. **오늘의 동네 한 줄 환영** — 앱 진입 시 AI가 오늘 동네 정보 묶어 환영 한 줄

### ❌ NO (v1에서 제외, 향후)

- 1:1 채팅 — v1.5에서 *상점 게시판*으로 대체
- 실제 결제 / 정산 — v2 (TossPayments, quest #1·#4 결제 모듈 재활용)
- 매너온도 / 평가 — v2 (단골 등록과 함께)
- 푸시 알림 — v1.5 (PWA 검토)
- GPS 정확도 — v1.5 (카카오맵 결합 검토)
- 실제 가게 모집 — v2 이후 (염창동 파일럿 데모 반응 보고)

---

## 기술 스택

| 영역 | 기술 | 선정 사유 |
|---|---|---|
| Frontend | React 18 (CDN) + Tailwind (CDN) + Babel standalone, **단일 `index.html`** | 빌드 도구 X, lean. v1은 동작 검증 1순위 |
| Backend | Vercel Serverless Functions (`api/*.js` CommonJS) | 서버 인프라 0, Vercel 단일 플랫폼 |
| DB | Supabase PostgreSQL + `pg` 라이브러리 직접 호출 | Supabase JS 클라이언트 종속 회피 (학습 + lean) |
| 이미지 | ImageKit (v1.5에서 검토) | Vercel Blob 비채택 — 종속 회피, 무료 20GB |
| AI | Claude API (Sonnet 4.6) + ephemeral 캐싱 | 컨시어지 핵심. 50개 가게 컨텍스트 10,737 tokens 캐싱 |
| 배포 | Vercel | 단일 플랫폼 |
| Secrets | `.env` + `.gitignore` | Public repo 보안 원칙 |

---

## 주차별 체크리스트

### Week 6 (현재) — Phase 1·2·3·4 완료

- [x] **Phase 1** — UI 골격 (단일 `index.html`)
- [x] **Phase 2** — 백엔드 서버리스 함수 (`api/*.js`)
- [x] **Phase 3** — AI 컨시어지 (Claude API + 50개 가게 목업)
- [x] **Phase 4** — Vercel 프로덕션 배포 ([https://dongne-golmok.vercel.app/](https://dongne-golmok.vercel.app/))

### Week 7 — 디자인 정교화 + 데이터 검증

- [ ] 따뜻한 흙·크라프트 톤 적용 (harbor.school 7주차 디자인 수업 활용)
- [ ] 50개 가게 데이터 톤 검수 + AI 응답 50건 직접 검수
- [ ] 8개 시나리오 풀 톤 검증 (`docs/scenarios_mock.md`)
- [ ] 첫 시연 (협력자 1~2명)

### Week 8 (데모데이) — 외부 검증

- [ ] 투자자/협력자 5명 1:1 시연
- [ ] 피드백 수집 + 첫 협력 의사 표명 1건 이상
- [ ] v1.5 작업 우선순위 결정

### v1.5 (Week 8~12)

- [ ] DEV.md / AUDIENCES.md 본격 보강 (이 v0.1 → v1.0)
- [ ] **상점 게시판** (1:1 채팅 대체) — 가게가 글 올리면 단골이 봄
- [ ] **PWA** 검토 (홈 화면 추가 + 푸시 알림)
- [ ] **카카오맵 결합** 검토 (가게 위치 시각화)
- [ ] 컨시어지 시나리오 8개 → 15개 확장
- [ ] PostgreSQL 본격 (현재는 50개 정적 JSON)
- [ ] JWT 인증 (현재는 시뮬 로그인)
- [ ] fal 이미지 (가게별 자동 일러스트)

---

## 핵심 의사결정 로그

- **Supabase JS client 회피** → `pg` 직접 사용 (학습 + 종속 회피)
- **Vercel Blob 비채택** → ImageKit (종속 회피, 무료 한도 ↑)
- **TossPayments는 v2** → v1은 결제 메타데이터만 표시 (선결제 모델은 v2 통합)
- **디자인 임시 상태** → v1.5에서 본격 (v1은 *동작 검증* 1순위, *비주얼 완성도* 2순위)
- **1:1 채팅 비채택** → v1.5에서 *상점 게시판*으로 대체 (관리 부담·익명 악용 회피)

---

## 잔여 (이 v0.1 다음 보강 영역)

- DB 스키마 ERD (현재는 50개 가게 정적 JSON)
- API 엔드포인트 명세 (각 `api/*.js` request/response 스키마)
- 환경변수 전체 리스트 (현재 `.env.example` 참조)
- 배포 파이프라인 상세 (CI/CD, preview/production 분리)
- 모니터링·로깅 전략 (Sentry/Logtail 검토)
