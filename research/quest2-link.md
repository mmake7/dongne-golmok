# 경쟁 서비스 리서치 (학습 quest #2 산출물)

학습 quest #2 (경쟁 서비스 3곳 Chrome MCP 리서치)의 결과물로 동네골목의 차별점을 정리. 본 프로젝트(이 repo)와 학습 repo의 *연결 지점* 역할.

## 본 산출물 위치 (학습 repo)

- 통합 비교 리포트: https://github.com/mmake7/harbor-school/blob/main/week6/quest2-research-agent/research.md
- 개별 deep dive 3건: https://github.com/mmake7/harbor-school/tree/main/week6/quest2-research-agent/research
- 1p 전략 인사이트: https://github.com/mmake7/harbor-school/blob/main/week6/quest2-research-agent/insights/2026-05-07-dongne-golmok-differentiation.md
- 스크린샷 9장: https://github.com/mmake7/harbor-school/tree/main/week6/quest2-research-agent/screenshots

## 핵심 인사이트 — "동네 가게 발견의 4가지 양식"

| 양식 | 동기 | 메커니즘 | 선점자 |
|---|---|---|---|
| 재미로 발견 | 영상 보다 우연히 | 인플루언서·알고리즘 | 인스타 (#신당동맛집 69만 릴스) |
| 검색으로 발견 | 명확한 키워드 | 카탈로그 + 별점·리뷰 | 네이버 플레이스 |
| 가까워서 발견 | "우리 동네에 뭐 있나" | GPS + 동(洞) 필터 | 당근 (4,300만 가입자) |
| **맥락으로 발견** | "오늘 비 와서 따끈한 거" | **AI 비서 + 50개 골목 컨텍스트** | **🟢 동네골목** |

## 동네골목 차별화 3축 (vs 3 경쟁자)

| | 경쟁자 | 차별 축 | 동네골목 답 |
|---|---|---|---|
| 1 | **vs 당근** | 주체·수익 모형 | *광고 없는 큐레이션* (당근은 광고 매출 본진) |
| 2 | **vs 네이버 지도** | UX 모델 | *대화로 발견* (네이버는 검색·카탈로그) |
| 3 | **vs 인스타** | 책임 위치 | *큐레이터 책임 50개* (인스타는 알고리즘 + 인플루언서) |

→ **세 거인 모두 "맥락 발견" 양식을 못 만든다 — 못 만드는 게 아니라 *각자 사업 모델 때문에 안 만드는 게 합리적*이라서다.** 동네골목은 그 빈 슬롯에 들어간다.

## AI 시스템 프롬프트·랜딩·MISSION에 반영

본 리서치의 결과는 동네골목 코드·문서에 직접 반영됨:

- `api/ai.js` GUIDELINES 톤: "검색 엔진이 아니라 골목 비서다. 맥락을 받아서 골라준다"
- `index.html` 안내 문구: "AI 컨시어지(Claude)가 50개 가게 컨텍스트로 답합니다"
- `docs/MISSION.md`: 당근/네이버/인스타와의 비교 표 흡수
- `docs/CONCEPT.md`: AI 컨시어지 컨셉의 출발점이 본 리서치의 "4가지 발견 양식"

## quest 학습/사업 자산 흐름

```
[학습 quest #2: Chrome MCP 리서치]
        ↓ 4가지 발견 양식 도출
[동네골목 quest #5 pivot]
        ↓ 차별점 정의 + 컨셉 명문화
[v1 MVP — Phase 1·2·3·4 라이브]
        https://dongne-golmok.vercel.app/
```

학습 quest의 산출물이 *본 프로젝트의 컨셉 코어*가 된 케이스. quest #2 ↔ quest #5는 *서로 자산을 주고받는* 관계.
