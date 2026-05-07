const { Anthropic } = require('@anthropic-ai/sdk');
const shopsData = require('../data/shops.json');

// Claude 클라이언트 — ANTHROPIC_API_KEY env 자동 사용
const client = new Anthropic();

// 시스템 프롬프트 — 톤·규칙 (변경 안 되는 부분, 캐시 효과 큼)
const GUIDELINES = `당신은 "동네골목 GOLMOK."의 AI 컨시어지입니다.
서울 강서구 염창동의 50개 작은 가게 정보를 잘 압니다.
사용자가 자연어로 질문하면 동네 사정에 밝은 친구처럼 답합니다.

## 응답 톤 (가장 중요)

✅ 이렇게 말합니다:
- "오늘 햇살떡에 새 가래떡 나왔대요. 6시 전에 가시면 따끈할 거예요."
- "지금 11시면 화요순대는 끝났을 거예요. 대신 365분식이 24시까지 해요."
- "주말이라 양말차는 토요일 저녁에 와요. 미리 가시면 사이즈 다양하대요."

❌ 이렇게 말하지 않습니다:
- "검색 결과 3건이 발견되었습니다."
- "조건에 부합하는 매장은 다음과 같습니다."
- "현재 위치 기반으로 추천드립니다."

## 응답 규칙

1. 친근한 존댓말 (반말 X). 카톡으로 동네 친구가 알려주는 톤.
2. 답변은 **한 문장 또는 두 문장**. 절대 3문장 넘지 말 것.
3. 구체적 가게 이름 · 시간 · 위치 · 요일을 명시.
4. 사용자 질문의 시간 · 요일 · 시즌 맥락을 영업시간과 비교해 답변.
5. 답할 가게가 없으면 솔직히 "오늘은 그건 동네에 없어요" 정도로.
6. 시스템 톤·말투(검색 결과, 추천드립니다, 조건 부합) 절대 X.
7. 한국어로만 답변.

## 출력 형식 (반드시 JSON)

다른 어떤 텍스트도 포함하지 말고, 아래 JSON 형식으로만 응답하세요.
\`\`\`json
{
  "answer": "동네 친구 톤 한두 문장",
  "referencedShops": ["g001", "g041"]
}
\`\`\`

- answer: 사용자에게 보여줄 답변 문장. 1~2문장. 친근한 존댓말.
- referencedShops: 답변에서 언급한 가게의 id 배열. 최대 3개. 없으면 빈 배열.

JSON 외 다른 설명·마크다운은 절대 포함하지 마세요.
`;

// 가게 데이터를 컴팩트하게 직렬화 (캐시 친화적, 토큰 절약)
function buildShopsContext() {
  const compact = shopsData.shops.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    category: s.category,
    near: s.location?.near || s.location?.address,
    schedule: s.schedule,
    posts: s.posts,
    tags: s.tags,
    payment: s.payment_options,
    notes: s.notes
  }));
  return `## 가게 데이터 (염창동 50개)\n\n${JSON.stringify(compact, null, 0)}`;
}

const SHOPS_CONTEXT = buildShopsContext();

// 한국 시간 정보 생성
function getKoreanContext() {
  const now = new Date();
  // Asia/Seoul 시간 + 요일
  const fmt = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  return fmt.format(now);
}

// JSON 추출 — 코드 블록 제거 + 첫 { ... } 매칭
function extractJSON(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json\s*|```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // 첫 { 부터 매칭되는 } 까지 추출
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {}
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.',
      hint: '.env 파일에 ANTHROPIC_API_KEY=sk-ant-... 추가 후 재시작하세요.'
    });
  }

  const { question, initial = false } = req.body || {};

  if (!initial && (!question || !question.trim())) {
    return res.status(400).json({ error: 'question 필드는 필수입니다 (혹은 initial: true).' });
  }

  const koreanTime = getKoreanContext();

  let userMessage;
  if (initial) {
    userMessage = `지금 시간: ${koreanTime}

사용자가 막 동네골목에 들어왔습니다. "오늘의 동네 한 줄" 환영 메시지를 만들어 주세요.
지금 시간·요일 기준으로 영업 중이거나 곧 등장할 가게 1~2곳을 자연스럽게 언급하세요.
"환영합니다" 같은 형식적 인사 X. 동네 친구가 카톡으로 안부 전하듯이.

JSON 형식으로 응답하세요.`;
  } else {
    userMessage = `지금 시간: ${koreanTime}

사용자 질문: ${question.trim()}

JSON 형식으로 응답하세요.`;
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: [
        { type: 'text', text: GUIDELINES, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: SHOPS_CONTEXT, cache_control: { type: 'ephemeral' } }
      ],
      messages: [
        { role: 'user', content: userMessage }
      ]
    });

    const rawText = response.content?.[0]?.text || '';
    const parsed = extractJSON(rawText);

    if (!parsed || typeof parsed.answer !== 'string') {
      // 파싱 실패 — 모델 응답 그대로 반환 + 경고
      return res.status(200).json({
        answer: rawText.slice(0, 300),
        referencedShops: [],
        warning: 'JSON 파싱 실패 — 모델 출력 형식 점검 필요',
        time: koreanTime,
        usage: response.usage
      });
    }

    return res.status(200).json({
      answer: parsed.answer,
      referencedShops: Array.isArray(parsed.referencedShops) ? parsed.referencedShops.slice(0, 3) : [],
      time: koreanTime,
      model: response.model,
      usage: response.usage
    });
  } catch (err) {
    console.error('AI handler error:', err.message || err);
    return res.status(500).json({
      error: 'AI 호출 실패',
      message: err.message || String(err),
      hint: err.status === 401
        ? 'ANTHROPIC_API_KEY가 잘못되었거나 만료되었습니다.'
        : err.status === 429
          ? '레이트 리밋 도달. 잠시 후 다시 시도하세요.'
          : null
    });
  }
};
