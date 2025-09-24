document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('lista-produtos');
  if (!container) return;

  try {
    const resposta = await fetch('./AssetsJS/dados.json');
    if (!resposta.ok) throw new Error('Erro ao carregar o arquivo JSON');

    const produtos = await resposta.json();

    if (!Array.isArray(produtos) || produtos.length === 0) {
      container.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
      return;
    }

    container.innerHTML = produtos.map(produto => `
      <article class="produto-card">
        <img src="${produto.foto}" alt="Foto de ${produto.nome}" loading="lazy">
        <h3>${produto.nome}</h3>
        <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
        <div class="card-actions"><a href="produto.html?id=${produto.id}" class="btn-ver">Ver produto</a><button class="btn-add" data-id="${produto.id}">Adicionar ao carrinho</button></div>
      </article>
    `).join('');
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    container.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
  }
});


document.addEventListener('click', function(e){
  if(e.target && e.target.classList && e.target.classList.contains('btn-add')){
    var id = e.target.getAttribute('data-id');
    Cart.add(id, 1);
  }
});


// === Sorting & OOP demo (2025-09-24) ===
class ProductSorter {
  constructor(containerSelector){ this.container = document.querySelector(containerSelector); }
  sortBy(key){
    if(!this.container) return;
    const cards = Array.from(this.container.querySelectorAll('.card'));
    const get = (el) => {
      if(key==='preco'){
        const priceEl = el.querySelector('[data-field="preco"]');
        const raw = priceEl ? priceEl.getAttribute('data-value') || priceEl.textContent : '0';
        return Number(String(raw).replace(/[^0-9.,]/g,'').replace('.','').replace(',','.')) || 0;
      }
      const nameEl = el.querySelector('[data-field="nome"]') || el.querySelector('h3, h4, .title');
      return (nameEl ? nameEl.textContent : '').toLowerCase();
    };
    cards.sort((a,b)=>{
      const av = get(a), bv = get(b);
      if(key==='preco') return av - bv;
      return av.localeCompare(bv);
    });
    cards.forEach(c => this.container.appendChild(c));
  }
}

(function(){
  const container = document.getElementById('lista-produtos');
  if(!container) return;

  // Inject toolbar if not present
  let toolbar = document.getElementById('catalog-toolbar');
  if(!toolbar){
    toolbar = document.createElement('div');
    toolbar.id = 'catalog-toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '12px';
    toolbar.style.alignItems = 'center';
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.margin = '8px 0 16px';
    const left = document.createElement('div');
    left.id = 'toolbar-left';
    const right = document.createElement('div');
    right.id = 'toolbar-right';
    // Sort select
    const select = document.createElement('select');
    select.id = 'sort-select';
    select.innerHTML = `
      <option value="">Ordenar</option>
      <option value="nome">Nome (A–Z)</option>
      <option value="preco">Preço (menor primeiro)</option>
    `;
    right.appendChild(select);
    // Place before product list
    const main = container.parentNode;
    main.insertBefore(toolbar, container);
    toolbar.appendChild(left);
    toolbar.appendChild(right);

    const sorter = new ProductSorter('#lista-produtos');
    select.addEventListener('change', ()=>{
      if(select.value) sorter.sortBy(select.value);
    });
  }
})();


// Mark fields for sorting/filtering
(function(){
  const container = document.getElementById('lista-produtos');
  if(!container) return;
  container.querySelectorAll('.card').forEach(card=>{
    const nameEl = card.querySelector('h3, h4, .title');
    if(nameEl){ nameEl.setAttribute('data-field','nome'); }
    const priceEl = card.querySelector('.price, .preco, [data-preco]');
    if(priceEl){
      priceEl.setAttribute('data-field','preco');
      const raw = priceEl.textContent || '';
      const num = String(raw).replace(/[^0-9.,]/g,'').replace('.','').replace(',','.');
      priceEl.setAttribute('data-value', num);
    }
  });
})();


// === Catalog observe & auto-decorate (2025-09-24) ===
(function(){
  const list = document.getElementById('lista-produtos');
  if(!list) return;

  function decorate(){
    list.querySelectorAll('.card').forEach(card=>{
      const nameEl = card.querySelector('[data-field="nome"], h3, h4, .title');
      if(nameEl && !nameEl.getAttribute('data-field')) nameEl.setAttribute('data-field','nome');
      const priceEl = card.querySelector('[data-field="preco"], .price, .preco, [data-preco]');
      if(priceEl && !priceEl.getAttribute('data-field')){
        priceEl.setAttribute('data-field','preco');
        const raw = priceEl.textContent || '';
        const num = String(raw).replace(/[^0-9.,]/g,'').replace('.','').replace(',','.');
        priceEl.setAttribute('data-value', num);
      }
    });
  }

  const sorter = new ProductSorter('#lista-produtos');
  function applyCurrentSort(){
    const sel = document.getElementById('sort-select');
    if(sel && sel.value){ sorter.sortBy(sel.value); }
  }

  decorate(); // initial
  const obs = new MutationObserver(()=>{ decorate(); applyCurrentSort(); });
  obs.observe(list, {childList:true, subtree:false});
})();
