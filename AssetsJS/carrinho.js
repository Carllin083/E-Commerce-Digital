
document.addEventListener('DOMContentLoaded', function(){
  const listaEl = document.getElementById('cart-list');
  const totalEl = document.getElementById('cart-total');

  function moedaBR(n){ return n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }

  async function carregarProdutos(){
    const r = await fetch('./AssetsJS/dados.json');
    if(!r.ok) throw new Error('Falha ao carregar dados');
    return await r.json();
  }

  async function desenhar(){
    const itens = Cart.read();
    if(!itens.length){
      if (listaEl) listaEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
      if (totalEl) totalEl.textContent = moedaBR(0);
      return;
    }
    const dados = await carregarProdutos();
    const mapa = new Map(dados.map(p => [String(p.id), p]));
    let total = 0;
    const html = itens.map(it => {
      const p = mapa.get(String(it.id));
      const preco = p ? Number(p.preco) : 0;
      const qtd = Number(it.qty || 1);
      const sub = preco * qtd;
      total += sub;
      const foto = p?.foto || '';
      const nome = p?.nome || 'Produto';
      return `
        <div class="cart-item">
          <img src="${foto}" alt="${nome}">
          <div>
            <h4>${nome}</h4>
            <div class="qty-control">
              <label>Qtd:</label>
              <input class="qty-input" type="number" min="1" value="${qtd}" data-id="${it.id}">
              <button class="remove-btn" data-id="${it.id}">Remover</button>
            </div>
          </div>
          <div class="price">${moedaBR(sub)}</div>
        </div>
      `;
    }).join('');
    if (listaEl) listaEl.innerHTML = html;
    if (totalEl) totalEl.textContent = moedaBR(total);
  }

  if (listaEl) {
    listaEl.addEventListener('click', (e)=>{
      const b = e.target;
      if (b.classList.contains('remove-btn')){
        Cart.remove(b.getAttribute('data-id'));
        desenhar();
      }
    });
    listaEl.addEventListener('change', (e)=>{
      const i = e.target;
      if (i.classList.contains('qty-input')){
        const id = i.getAttribute('data-id');
        let v = parseInt(i.value, 10);
        if (isNaN(v) || v < 1) v = 1;
        Cart.setQty(id, v);
        desenhar();
      }
    });
  }

  desenhar();
});
