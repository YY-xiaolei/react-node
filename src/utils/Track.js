/**
 * 
 * @authors Leon.Xu
 * @date    2015-10-16 13:52:32
 */
// usage:
// import Track from '../../utils/Track';
// import Track from '../utils/Track';

const PURCHASE_CACHE = 'purchase';
let Track = {
  log(...args) {},
  // 获取页面的pageName
  getPageName() {
    return location.pathname.replace(/^\//,'');
  },
  // 格式化产品的属性(颜色)
  formatVariantOption(text = '') {
    return text.replace(/Color Group:\s+/i, ''); // Color Group: Black -> Black
  },
  // 根据classifications, 返回符合GA标准的产品类别信息
  formatCategory(classifications = []) {
    let category = classifications.length > 0 ? classifications[0].taxon.pretty_name : '';
    category = category.replace(/\s?->\s?/g, '/').replace(/.*?\//, '');
    return category;
  },
  // 格式化产品列表的product展示信息. Track.formatProdInfo(item, pageName)
  formatProdInfo(item, pageName = Track.getPageName()) {
    const p = item.variants ? item.variants[item.variant || 0] : {};
    return {
      'id': p.sku || item.sku, // ID/SKU
      'name': item.name, // 产品名称
      'price': item.price || p.price || '', // 价格（例如29.20）
      'brand': item.brand || 'Anker', // 品牌
      'category': Track.formatCategory(item.classifications) || item.category, // 所属的类别
      'position': 0, // 在列表或集合中的位置
      'list': pageName, // 所在的列表或集合
    };
  },
  // 格式化line_items里面的product信息. Track.formatLineItem(item)
  formatLineItem(item) {
  	const classifications = item.variant.product && item.variant.product.classifications;
    const ret = {
      'id': item.variant.sku,
      'name': item.variant.name,
      'category': Track.formatCategory(classifications) || item.category || 'Anker',
      'brand': item.brand || 'Anker',
      'variant': Track.formatVariantOption(item.variant.options_text), // Color
      'price': item.price,
      'quantity': item.quantity,
    };
    Track.log('LineItem', ret);
    return ret;
  },
  // 格式化产品(列表/详情)的product信息. Track.formatProdItem(item, index, quantity)
  formatProdItem(item, variantIndex = 0, quantity = 1) {
    const p = item.variants ? item.variants[variantIndex] : {};
    return {
      'id': p.sku, // ID/SKU
      'name': item.name, // 产品名称
      'category': Track.formatCategory(item.classifications) || item.category, // 所属的类别
      'brand': item.brand || 'Anker', // 品牌
      'variant': Track.formatVariantOption(p.options_text), // Color
      'price': p.price || '', // 价格（例如29.20）
      'quantity': quantity,
    };
  },
};

// 统一打印, Track.log()
// Track.log = console.warn.bind(console); // 生产环境可注释本行 // log = function(...args) {console.warn.apply(console, args);};

// ec:衡量展示, Track.ecAddImpression(this.state.data, 'Product');
Track.ecAddImpression = function(data, pageName = Track.getPageName()) {
  data = data || {};
  const products = data.products || [];
  // Track.log(pageName, products);
  // window.gaplugins.EC
  products.map(function(item, i) {
    // console.warn(category, list);
    const prod = Track.formatProdInfo(item, pageName);
    Track.log(pageName, prod);
    ga('ec:addImpression', prod);
  });
  // ga('send', 'pageview');
};

// ec:衡量 列表中的产品链接的点击. Track.ecProdClick({}, 'Product')
Track.ecProdClick = function(item, pageName = Track.getPageName()) {
  const prod = Track.formatProdInfo(item, pageName);
  Track.log(pageName, prod);
  ga('ec:addProduct', prod);
  ga('ec:setAction', 'click', {
    'list': pageName,
  });
  ga('send', 'event', pageName, 'click', '');
};

// ec: 促销信息点击
/*Track.ecPromoClick = function(data, pageName) {
  ga('ec:addPromo', {
    'id': 'PROMO_1234',
    'name': 'Summer Sale',
    'creative': 'summer_banner2',
    'position': 'banner_slot1'
  });
  // Send the promo_click action with an event.
  ga('ec:setAction', 'promo_click');
  ga('send', 'event', 'Internal Promotions', 'click', 'Summer Sale');
};*/

// ec: 产品详情查看
Track.ecViewDetail = function(prod) {
  prod.position = 0;
  delete prod.quantity;
  Track.log('detail', prod);
  ga('ec:addProduct', prod);
  ga('ec:setAction', 'detail');
};

// ec:添加到购物车, Track.ecAddToCart(object, 'Product');
Track.ecAddToCart = function(prod, pageName = Track.getPageName()) {
  if (!prod.brand) prod.brand = 'Anker';
  Track.log(pageName, prod);
  ga('ec:addProduct', prod);
  ga('ec:setAction', 'add');
  ga('send', 'event', pageName, 'click', 'add to cart');
};

// ec:移除购物车, Track.ecRemoveFromCart(object, 'Product');
Track.ecRemoveFromCart = function(item, pageName = Track.getPageName()) {
  const prod = Track.formatLineItem(item);
  ga('ec:addProduct', prod);
  Track.log('ecRemove', prod);
  ga('ec:setAction', 'remove');
  ga('send', 'event', pageName, 'click', 'remove from cart');
};

// ec:衡量结帐流程, Track.ecCheckout(json.line_items, 1);
Track.ecCheckout = function(products, step = 1) {
  Track.log('ecCheckout', step);
  products.map(function(item, i) {
    // console.warn(item);
    const prod = Track.formatLineItem(item);
    ga('ec:addProduct', prod);
    Track.log(prod);
  });
  ga('ec:setAction','checkout', {
    'step': step,
  });
};

// user has completed shipping options, Track.ecShippingComplete(3);
Track.ecShippingComplete = function(step = 3) {
  // Track.log('ecCheckout', step);
  ga('ec:setAction', 'checkout_option', {
    'step': step,
    // "option": "Visa"
  });
  ga('send', 'event', 'Checkout', 'Option');
};

// ec:衡量交易, Track.ecPurchase();
Track.ecPurchase = function() {
  // Track.log('ecPurchase');
  let purchase = Track.getEcPurchase();
  Track.log(purchase.field);
  if (!purchase.field.id) return;
  purchase.prods.map(function(item, i) {
    ga('ec:addProduct', item);
    Track.log(item);
  });
  ga('ec:setAction', 'purchase', purchase.field);
  localStorage.removeItem(PURCHASE_CACHE);
};
Track.saveEcPurchase = function(products, field) { // 付款前缓存购买信息, 给交易完成后的, ga使用. Track.saveEcPurchase(products, field)
  let purchase = {};
  purchase.prods = [];
  products.map(function(item, i) {
    purchase.prods.push(Track.formatLineItem(item));
  });
  purchase.field = {
    'id': field.id, //交易 ID
    'affiliation': 'Anker Store', // 商店或关联公司
    'revenue': field.revenue, // 总收入或总计金额
    'tax': field.tax, // 总税费
    'shipping': field.shipping, //运费
  };
  localStorage.setItem(PURCHASE_CACHE, JSON.stringify(purchase));
};
Track.getEcPurchase = function() { // 获取缓存的购买信息. Track.getEcPurchase();
  const p = localStorage.getItem(PURCHASE_CACHE);
  return p ? JSON.parse(p) : {prods: [], field: {}};
};

export default Track;
