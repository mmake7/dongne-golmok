// v1 데모용 — 메모리에만 저장. Vercel 함수가 cold start 되면 사라집니다.
// 시연 시 "오늘 한과 새로 했어요" 같은 글을 라이브로 등록해 보여주는 용도.

const shopsData = require('../data/shops.json');

const ephemeralPosts = [];
const MAX_POSTS = 50;

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    // 등록된 임시 글 + 가게별 그룹 정보
    const grouped = {};
    for (const p of ephemeralPosts) {
      if (!grouped[p.shopId]) grouped[p.shopId] = [];
      grouped[p.shopId].push(p);
    }

    return res.status(200).json({
      posts: ephemeralPosts,
      total: ephemeralPosts.length,
      grouped,
      note: 'v1 휘발성 저장. cold start 시 리셋.'
    });
  }

  if (req.method === 'POST') {
    const { shopId, post, ownerNick } = req.body || {};

    if (!shopId || !post) {
      return res.status(400).json({
        error: 'shopId와 post는 필수입니다.',
        example: { shopId: 'g001', post: '오늘 한과 새로 했어요', ownerNick: '한과지기' }
      });
    }

    const shop = shopsData.shops.find((s) => s.id === shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found', shopId });
    }

    if (typeof post !== 'string' || post.length > 200) {
      return res.status(400).json({ error: 'post는 200자 이하의 문자열이어야 합니다.' });
    }

    const newPost = {
      id: `mp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      shopId,
      shopName: shop.name,
      post: post.trim(),
      ownerNick: ownerNick || shop.owner_nick,
      createdAt: new Date().toISOString()
    };

    ephemeralPosts.unshift(newPost);

    // 메모리 보호 — 최대 50개 유지
    if (ephemeralPosts.length > MAX_POSTS) {
      ephemeralPosts.length = MAX_POSTS;
    }

    return res.status(201).json({
      post: newPost,
      total: ephemeralPosts.length,
      note: 'v1 데모용 — 메모리 휘발 저장. 새로고침/cold start 시 사라짐.'
    });
  }

  if (req.method === 'DELETE') {
    const before = ephemeralPosts.length;
    ephemeralPosts.length = 0;
    return res.status(200).json({ cleared: before, note: '임시 글 전체 초기화.' });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
};
