(function(){
  var STORAGE_KEY = 'ecommerce_cart_v1';

  function readCart(){
    try{
      var raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return [];
      var arr = JSON.parse(raw);
      if(!Array.isArray(arr)) return [];
      return arr;
    }catch(e){
      console.log('cart_read_error', e && e.message ? e.message : e);
      return [];
    }
  }

  function writeCart(items){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }catch(e){
      console.log('cart_write_error', e && e.message ? e.message : e);
    }
  }

  function findIndex(items, id){
    for(var i=0;i<items.length;i++){ if(String(items[i].id)===String(id)) return i; }
    return -1;
  }

  function addToCart(id, qty){
    var q = parseInt(qty,10); if(isNaN(q) || q<=0) q = 1;
    var items = readCart();
    var idx = findIndex(items, id);
    if(idx>=0){
      items[idx].qty += q;
    }else{
      items.push({id:String(id), qty:q});
    }
    writeCart(items);
    updateCartBadge();
    console.log('cart_add', {id:String(id), qty:q});
  }

  function setQty(id, qty){
    var q = parseInt(qty,10);
    if(isNaN(q) || q<1) q = 1;
    var items = readCart();
    var idx = findIndex(items, id);
    if(idx>=0){
      items[idx].qty = q;
      writeCart(items);
      updateCartBadge();
      console.log('cart_set', {id:String(id), qty:q});
    }
  }

  function removeFromCart(id){
    var items = readCart().filter(function(it){ return String(it.id)!==String(id); });
    writeCart(items);
    updateCartBadge();
    console.log('cart_remove', {id:String(id)});
  }

  function clearCart(){
    writeCart([]);
    updateCartBadge();
    console.log('cart_clear');
  }

  function getCount(){
    var items = readCart();
    var total = 0;
    for(var i=0;i<items.length;i++){ total += items[i].qty; }
    return total;
  }

  function updateCartBadge(){
    var badge = document.getElementById('cart-count');
    if(!badge) return;
    var n = getCount();
    badge.textContent = n>99 ? '99+' : String(n);
    badge.style.display = n>0 ? 'inline-flex' : 'none';
  }

  window.Cart = {
    read: readCart,
    add: addToCart,
    setQty: setQty,
    remove: removeFromCart,
    clear: clearCart,
    count: getCount,
    updateBadge: updateCartBadge
  };

  document.addEventListener('DOMContentLoaded', updateCartBadge);
})();