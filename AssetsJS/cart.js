
// cart.js (limpo em português): gerencia o carrinho no localStorage
(function(){
  const CHAVE = 'ecommerce_carrinho_v1';

  function lerCarrinho(){
    try{
      const bruto = localStorage.getItem(CHAVE);
      const lista = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(lista) ? lista : [];
    }catch(e){ console.log('erro_ler_carrinho', e?.message || e); return []; }
  }

  function salvarCarrinho(itens){
    try{ localStorage.setItem(CHAVE, JSON.stringify(itens || [])); }
    catch(e){ console.log('erro_salvar_carrinho', e?.message || e); }
  }

  function contarItens(){
    return lerCarrinho().reduce((s, it) => s + Number(it.qty || it.quantidade || 1), 0);
  }

  function atualizarBadge(){
    const n = contarItens();
    const badge = document.getElementById('cart-count');
    if(badge){
      badge.textContent = n;
      badge.style.display = n > 0 ? 'inline-flex' : 'none';
    }
  }

  function adicionar(id, quantidade){
    const itens = lerCarrinho();
    const idx = itens.findIndex(x => String(x.id) === String(id));
    const q = Number(quantidade || 1);
    if(idx >= 0){ itens[idx].qty = Number(itens[idx].qty || 1) + q; }
    else { itens.push({ id: String(id), qty: q }); }
    salvarCarrinho(itens);
    atualizarBadge();
  }

  function definirQuantidade(id, quantidade){
    const itens = lerCarrinho();
    const idx = itens.findIndex(x => String(x.id) === String(id));
    if(idx >= 0){
      const q = Math.max(1, Number(quantidade || 1));
      itens[idx].qty = q;
      salvarCarrinho(itens);
      atualizarBadge();
    }
  }

  function remover(id){
    const itens = lerCarrinho().filter(x => String(x.id) !== String(id));
    salvarCarrinho(itens);
    atualizarBadge();
  }

  function limpar(){
    salvarCarrinho([]);
    atualizarBadge();
  }

  window.Cart = {
    read: lerCarrinho,
    add: adicionar,
    setQty: definirQuantidade,
    remove: remover,
    clear: limpar,
    count: contarItens,
    updateBadge: atualizarBadge
  };

  document.addEventListener('DOMContentLoaded', atualizarBadge);
})();
