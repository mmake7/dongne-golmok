const shopsData = require('../data/shops.json');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query || {};

  if (!q || !q.trim()) {
    return res.status(200).json({
      results: [],
      total: 0,
      query: q || '',
      note: '검색어를 입력해주세요.'
    });
  }

  const needle = q.toLowerCase().trim();
  const scored = [];

  for (const s of shopsData.shops) {
    let score = 0;
    const matches = [];

    // 가게 이름 — 가장 중요 (가중치 5)
    if (s.name.toLowerCase().includes(needle)) {
      score += 5;
      matches.push('name');
    }

    // 카테고리 — 중요 (가중치 3)
    if (s.category.toLowerCase().includes(needle)) {
      score += 3;
      matches.push('category');
    }

    // 태그 — 중요 (가중치 2)
    if (s.tags && s.tags.some((t) => t.toLowerCase().includes(needle))) {
      score += 2;
      matches.push('tags');
    }

    // 등록 글 — 보조 (가중치 1)
    if (s.posts && s.posts.some((p) => p.toLowerCase().includes(needle))) {
      score += 1;
      matches.push('posts');
    }

    // 위치 — 보조 (가중치 1)
    const addr = (s.location?.address || '').toLowerCase();
    const near = (s.location?.near || '').toLowerCase();
    if (addr.includes(needle) || near.includes(needle)) {
      score += 1;
      matches.push('location');
    }

    if (score > 0) {
      scored.push({ shop: s, score, matches });
    }
  }

  // 점수 내림차순 정렬
  scored.sort((a, b) => b.score - a.score);

  return res.status(200).json({
    results: scored.map((x) => x.shop),
    total: scored.length,
    query: q,
    matchInfo: scored.map((x) => ({ id: x.shop.id, score: x.score, matches: x.matches }))
  });
};
