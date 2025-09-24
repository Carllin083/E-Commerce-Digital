document.addEventListener('DOMContentLoaded', function(){
  var listEl = document.getElementById('cart-list');
  var totalEl = document.getElementById('cart-total');

  function formatBR(n){
    return n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  }

  function render(){
    var items = Cart.read();
    if(!items.length){
      listEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
      totalEl.textContent = formatBR(0);
      return;
    }
    fetch('./AssetsJS/dados.json')
      .then(function(r){ return r.json(); })
      .then(function(all){
        var sum = 0;
        listEl.innerHTML = items.map(function(it){
          var prod = all.find(function(p){ return String(p.id)===String(it.id); });
          if(!prod) return '';
          var subtotal = prod.preco * it.qty;
          sum += subtotal;
          return (
            '<div class="cart-item">' +
              '<img src="'+prod.foto+'" alt="Foto de '+prod.nome+'">' +
              '<div class="cart-info">' +
                '<h3>'+prod.nome+'</h3>' +
                '<p class="muted">'+prod.marca+' • '+prod.categoria+'</p>' +
                '<div class="cart-row">' +
                  '<div class="qty">' +
                    '<button class="btn-qty" data-id="'+prod.id+'" data-op="-">-</button>' +
                    '<input class="qty-input" data-id="'+prod.id+'" type="number" min="1" value="'+it.qty+'"/>' +
                    '<button class="btn-qty" data-id="'+prod.id+'" data-op="+">+</button>' +
                  '</div>' +
                  '<div class="prices">' +
                    '<span class="unit">'+formatBR(prod.preco)+'</span>' +
                    '<strong class="subtotal">'+formatBR(subtotal)+'</strong>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<button class="btn-remove" data-id="'+prod.id+'">Remover</button>' +
            '</div>'
          );
        }).join('');
        totalEl.textContent = formatBR(sum);
      });
  }

  listEl.addEventListener('click', function(e){
    var t = e.target;
    if(t.classList.contains('btn-qty')){
      var id = t.getAttribute('data-id');
      var op = t.getAttribute('data-op');
      var items = Cart.read();
      var it = items.find(function(x){ return String(x.id)===String(id); });
      if(!it) return;
      if(op==='+') it.qty += 1; else it.qty = Math.max(1, it.qty-1);
      localStorage.setItem('ecommerce_cart_v1', JSON.stringify(items));
      Cart.updateBadge();
      render();
    }else if(t.classList.contains('btn-remove')){
      var idr = t.getAttribute('data-id');
      Cart.remove(idr);
      render();
    }
  });

  listEl.addEventListener('change', function(e){
    var t = e.target;
    if(t.classList.contains('qty-input')){
      var id = t.getAttribute('data-id');
      var v = parseInt(t.value,10);
      if(isNaN(v) || v<1) v=1;
      Cart.setQty(id, v);
      render();
    }
  });

  render();
});