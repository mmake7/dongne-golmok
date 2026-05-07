const shopsData = require('../data/shops.json');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, type, category, q } = req.query || {};

  // 단일 가게 상세 — /api/shops?id=g001
  if (id) {
    const shop = shopsData.shops.find((s) => s.id === id);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found', id });
    }
    return res.status(200).json({ shop });
  }

  // 목록 + 필터
  let filtered = shopsData.shops;

  if (type) {
    if (type === 'resident' || type === '정착') {
      filtered = filtered.filter((s) => !s.type.startsWith('이동형'));
    } else if (type === 'mobile' || type === '이동') {
      filtered = filtered.filter((s) => s.type.startsWith('이동형'));
    } else {
      filtered = filtered.filter((s) => s.type === type);
    }
  }

  if (category) {
    filtered = filtered.filter((s) => s.category.includes(category));
  }

  if (q) {
    const needle = q.toLowerCase().trim();
    filtered = filtered.filter((s) => {
      if (s.name.toLowerCase().includes(needle)) return true;
      if (s.category.toLowerCase().includes(needle)) return true;
      if (s.tags && s.tags.some((t) => t.toLowerCase().includes(needle))) return true;
      return false;
    });
  }

  return res.status(200).json({
    shops: filtered,
    total: filtered.length,
    filters: { type: type || null, category: category || null, q: q || null }
  });
};
