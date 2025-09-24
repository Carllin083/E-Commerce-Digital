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
  });
})();


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
})();
