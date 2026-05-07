module.exports = function handler(req, res) {
  // v1 — DB 없는 시뮬레이션 로그인. 실제 인증은 v2부터.

  if (req.method === 'GET') {
    // 현재 세션 조회 시뮬
    return res.status(200).json({
      user: {
        id: 'demo-user-001',
        name: '데모유저',
        neighborhood: '염창동',
        joinedAt: '2026-05-07'
      },
      authenticated: true,
      note: 'v1 시뮬레이션 — 모든 요청에 대해 동일한 데모 user를 반환합니다.'
    });
  }

  if (req.method === 'POST') {
    // body 파싱이 필요하면 req.body 사용 (Vercel은 자동 파싱)
    const { name } = req.body || {};

    return res.status(200).json({
      user: {
        id: 'demo-user-001',
        name: name || '데모유저',
        neighborhood: '염창동',
        joinedAt: '2026-05-07'
      },
      authenticated: true,
      note: 'v1 시뮬레이션 로그인 — JWT/세션 토큰 발급 X. 실제 인증은 v2부터.'
    });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
