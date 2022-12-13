const express = require('express');
const cart = require('../schemas/cart');
const goods = require('../schemas/goods');
const router = express.Router();

// 상품 목록 조회 API
router.get('/goods', (req, res) => {
  res.json({ goods: goods });
});

// 상품 상세 조회 API
router.get('/goods/:goodsId', (req, res) => {
  const { goodsId } = req.params;
  const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId));
  res.json({ detail });
});

// 장바구니 상품 추가 API
const Cart = require('../schemas/cart');
router.post('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCart = await cart.find({ goodsId });
  if (existsCart.length) {
    return res.status(400).json({
      success: false,
      errorMessage: '이미 장바구니에 해당하는 상품이 존재합니다.',
    });
  }
  await Cart.create({ goodsId, quantity });
  res.json({ result: 'success' });
});

// 장바구니 상품 수량 수정 API
router.put('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.updateOne(
      { goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
  }
  res.status(200).json({ success: true });
});

// 장바구니 상품 제거 API
router.delete('/goods/:goodsId/cart', async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId });
  }
  res.json({ result: 'success' });
});

const Goods = require('../schemas/goods.js');
router.post('/goods/', async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: '이미 존재하는 GoodsId입니다.' });
  }

  const createGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });
  res.json({ goods: createGoods });
});

module.exports = router;
