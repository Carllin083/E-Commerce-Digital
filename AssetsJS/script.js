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


<<<<<<< HEAD
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
=======
// === Search + UI Enhancements (2025-09-24) ===
(function(){
  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  const form = document.querySelector('.search-form');
  const input = form ? form.querySelector('input[type="search"], input[type="text"]') : null;
  const clearBtn = form ? form.querySelector('.btn-clear') : null;

  function applyFilter(){
    if(!input) return;
    const term = input.value.trim().toLowerCase();
    if(form){ form.classList.toggle('has-text', term.length>0); }
    const cards = document.querySelectorAll('.card[data-name]');
    let visible = 0;
    cards.forEach(card=>{
      const name = card.getAttribute('data-name') || '';
      const cat = card.getAttribute('data-cat') || '';
      const match = name.includes(term) || cat.includes(term);
      card.style.display = (term==='' || match) ? '' : 'none';
      if(match || term==='') visible++;
    });
    const emptyMsg = document.getElementById('no-results') || (function(){
      const p = document.createElement('p');
      p.id = 'no-results';
      p.textContent = 'Nenhum item corresponde à sua busca.';
      p.style.margin = '16px 0';
      return p;
    })();
    const container = document.getElementById('lista-produtos');
    if(container){
      if(visible===0){ if(!emptyMsg.parentNode) container.appendChild(emptyMsg); }
      else { if(emptyMsg.parentNode) emptyMsg.parentNode.removeChild(emptyMsg); }
    }
  }

  let t;
  if(input){
    input.addEventListener('input', function(){
      clearTimeout(t);
      t = setTimeout(applyFilter, 200);
    });
    if(clearBtn){
      clearBtn.addEventListener('click', function(e){
        e.preventDefault();
        input.value = '';
        applyFilter();
        input.focus();
      });
    }
  }

  // Ensure all Add-to-Cart buttons are consistent
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.btn-add').forEach(btn=>{
      btn.setAttribute('aria-label', 'Adicionar ao carrinho');
      if(!btn.textContent.trim()) btn.textContent = 'Adicionar ao carrinho';
    });
>>>>>>> c715359ce0af3551527f3856b0c3154107e06296
  });
})();


<<<<<<< HEAD
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
=======
// Post-render: decorate cards with searchable attributes
(function(){
  const container = document.getElementById('lista-produtos');
  if(!container) return;
  container.querySelectorAll('.card').forEach(card=>{
    try{
      const nameEl = card.querySelector('[data-field="nome"]') || card.querySelector('h3, h4, .title');
      const catEl = card.querySelector('[data-field="categoria"]') || card.querySelector('.categoria');
      if(nameEl) card.setAttribute('data-name', nameEl.textContent.trim().toLowerCase());
      if(catEl) card.setAttribute('data-cat', catEl.textContent.trim().toLowerCase());
      const addBtn = card.querySelector('.btn-add');
      if(addBtn){ addBtn.classList.add('btn-primary'); }
    }catch(e){}
  });
>>>>>>> c715359ce0af3551527f3856b0c3154107e06296
})();
