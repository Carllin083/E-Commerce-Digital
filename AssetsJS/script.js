
// script.js (versão simples BR): catálogo com filtro e ordenação por re-renderização.
document.addEventListener('DOMContentLoaded', async () => {
  const lista = document.getElementById('lista-produtos');
  if (!lista) return;

  let produtosOriginais = [];
  let termoBusca = '';
  let criterioOrdenacao = '';

  // Barra de ordenação
  let barra = document.getElementById('barra-ordenacao');
  if (!barra) {
    barra = document.createElement('div');
    barra.id = 'barra-ordenacao';
    barra.style.display = 'flex';
    barra.style.gap = '12px';
    barra.style.alignItems = 'center';
    barra.style.justifyContent = 'space-between';
    barra.style.margin = '8px 0 12px';

    const esquerda = document.createElement('div');
    esquerda.id = 'controles-esquerda';
    const direita = document.createElement('div');
    direita.id = 'controles-direita';

    const seletor = document.createElement('select');
    seletor.id = 'ordenar-por';
    seletor.innerHTML = '<option value="">Ordenar</option><option value="nome">Nome (A–Z)</option><option value="preco">Preço (menor primeiro)</option>';

    direita.appendChild(seletor);
    lista.parentNode.insertBefore(barra, lista);
    barra.appendChild(esquerda);
    barra.appendChild(direita);

    seletor.addEventListener('change', () => {
      criterioOrdenacao = seletor.value || '';
      aplicarFiltroEOrdenacao();
    });
  }

  function templateProduto(p) {
    const precoFmt = (Number(p.preco) || 0).toFixed(2);
    return `
      <article class="produto-card">
        <img src="${p.foto}" alt="Foto de ${p.nome}" loading="lazy">
        <h3 class="produto-nome">${p.nome}</h3>
        <p class="preco">R$ ${precoFmt}</p>
        <p class="categoria">${p.categoria || ''}</p>
        <div class="card-actions">
          <a href="produto.html?id=${p.id}" class="btn-primario">Ver detalhes</a>
          <button class="btn-add" data-id="${p.id}" aria-label="Adicionar ao carrinho">Adicionar ao carrinho</button>
        </div>
      </article>
    `;
  }

  function renderizar(listaProdutos) {
    if (!Array.isArray(listaProdutos) || listaProdutos.length === 0) {
      lista.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
      return;
    }
    lista.innerHTML = listaProdutos.map(templateProduto).join('');
  }

  function aplicarFiltroEOrdenacao() {
    let base = [...produtosOriginais];
    if (termoBusca) {
      const t = termoBusca.toLowerCase();
      base = base.filter(p => (String(p.nome).toLowerCase().includes(t) ||
                               String(p.categoria || '').toLowerCase().includes(t)));
    }
    if (criterioOrdenacao === 'nome') {
      base.sort((a,b) => String(a.nome).localeCompare(String(b.nome)));
    } else if (criterioOrdenacao === 'preco') {
      base.sort((a,b) => Number(a.preco) - Number(b.preco));
    }
    renderizar(base);
  }

  window.definirBusca = function(valor) {
    termoBusca = String(valor || '').trim();
    aplicarFiltroEOrdenacao();
  };

  try {
    const resp = await fetch('./AssetsJS/dados.json');
    if (!resp.ok) throw new Error('Erro ao carregar o arquivo JSON');
    const produtos = await resp.json();
    produtosOriginais = Array.isArray(produtos) ? produtos : [];
    aplicarFiltroEOrdenacao();
  } catch (e) {
    console.error('Erro ao carregar produtos:', e);
    lista.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
  }
});

document.addEventListener('click', function(e){
  const alvo = e.target;
  if (alvo && alvo.classList && alvo.classList.contains('btn-add')) {
    const id = alvo.getAttribute('data-id');
    if (window.Cart && typeof Cart.add === 'function') {
      Cart.add(id, 1);
    }
  }
});
