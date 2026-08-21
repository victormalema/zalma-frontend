/* =========================================================
   ZALMA API client
   Wraps every backend call in one place so pages don't need
   raw fetch() code scattered everywhere.

   Include this BEFORE each page's own <script> block:
     <script src="api.js"></script>
   ========================================================= */

// Change this once you deploy the backend to Render (Step 11):
const API_BASE = 'https://zalma-backend-1.onrender.com/api';

const ZalmaAPI = {

  // ---------- token storage ----------
  _token(){ return localStorage.getItem('zalma_token'); },
  setToken(token){ localStorage.setItem('zalma_token', token); },
  clearToken(){ localStorage.removeItem('zalma_token'); },
  isLoggedIn(){ return !!this._token(); },

  // ---------- core request helper ----------
  async _request(path, options = {}){
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    const token = this._token();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(API_BASE + path, Object.assign({}, options, { headers }));
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    return data;
  },

  // ---------- auth ----------
  signup(payload){ return this._request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }); },
  login(payload){ return this._request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }); },
  me(){ return this._request('/auth/me'); },

  // ---------- products & collections ----------
  getCollections(){ return this._request('/collections'); },
  getProducts(collectionSlug){
    const q = collectionSlug ? ('?collection=' + encodeURIComponent(collectionSlug)) : '';
    return this._request('/products' + q);
  },
  getProduct(slug){ return this._request('/products/' + encodeURIComponent(slug)); },

  // ---------- cart ----------
  getCart(){ return this._request('/cart'); },
  addToCart(payload){ return this._request('/cart', { method: 'POST', body: JSON.stringify(payload) }); },
  updateCartItem(itemId, quantity){ return this._request('/cart/' + itemId, { method: 'PATCH', body: JSON.stringify({ quantity }) }); },
  removeCartItem(itemId){ return this._request('/cart/' + itemId, { method: 'DELETE' }); },

  // ---------- wishlist ----------
  getWishlist(){ return this._request('/wishlist'); },
  addToWishlist(productId){ return this._request('/wishlist', { method: 'POST', body: JSON.stringify({ product_id: productId }) }); },
  removeFromWishlist(productId){ return this._request('/wishlist/' + productId, { method: 'DELETE' }); },

  // ---------- checkout & orders ----------
  checkout(shippingAddress){ return this._request('/checkout', { method: 'POST', body: JSON.stringify({ shipping_address: shippingAddress }) }); },
  getOrders(){ return this._request('/orders'); },
  getOrder(orderId){ return this._request('/orders/' + orderId); },

  // ---------- rewards ----------
  getRewards(){ return this._request('/rewards'); },
  redeemPoints(points){ return this._request('/rewards/redeem', { method: 'POST', body: JSON.stringify({ points }) }); },

  // ---------- badges ----------
  getBadges(){ return this._request('/badges'); },
// ---------- rank / tiers ----------
  getRank(){ return this._request('/rank'); },
// ---------- social follows ----------
  claimFollow(platform){ return this._request('/social/follow', { method: 'POST', body: JSON.stringify({ platform }) }); },
  getClaimedFollows(){ return this._request('/social/follow'); },

  // ---------- unboxing ----------
  submitUnboxing(videoUrl){ return this._request('/unboxing', { method: 'POST', body: JSON.stringify({ video_url: videoUrl }) }); },
  getUnboxings(){ return this._request('/unboxing'); },

  // ---------- wall of honor ----------
  getLeaderboard(){ return this._request('/wall/leaderboard'); },
  getTestimonials(){ return this._request('/wall/testimonials'); },
  submitTestimonial(content, image){ return this._request('/wall/testimonials', { method: 'POST', body: JSON.stringify({ content, image }) }); }
};

