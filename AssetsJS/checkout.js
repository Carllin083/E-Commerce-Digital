
document.addEventListener('DOMContentLoaded', () => {
  const elTotal = document.getElementById('total-compra');
  const btnBuscar = document.getElementById('btn-buscar-cep');
  const cepInput = document.getElementById('cep');
  const logradouro = document.getElementById('logradouro');
  const bairro = document.getElementById('bairro');
  const cidade = document.getElementById('cidade');
  const estado = document.getElementById('estado');
  const msg = document.getElementById('msg');
  const freteEl = document.getElementById('frete-container'); // precisa existir no HTML

  //  Cria um espaço para mostrar o total final (produtos + frete)
  const totalFinalEl = document.createElement('div');
  totalFinalEl.id = 'total-final';
  if (freteEl) freteEl.parentNode.insertBefore(totalFinalEl, freteEl.nextSibling);

  // Guarda o valor total dos produtos (sem frete)
  let totalProdutos = 0;

  function formatBR(n) { 
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); 
  }

  async function calcularTotalCarrinho() {
    try {
      const itens = (window.Cart && typeof Cart.read === 'function') ? Cart.read() : [];
      if (!Array.isArray(itens) || itens.length === 0) { 
        totalProdutos = 0;
        if (elTotal) elTotal.textContent = formatBR(0); 
        return; 
      }
      const resp = await fetch('./AssetsJS/dados.json');
      const produtos = await resp.json();
      const mapa = new Map(produtos.map(p => [String(p.id), p]));
      let total = 0;
      for (const it of itens) {
        const p = mapa.get(String(it.id));
        const qtd = Number(it.qty || it.quantidade || 1);
        if (p) total += Number(p.preco) * qtd;
      }
      totalProdutos = total; // guarda para usar no cálculo do total final
      if (elTotal) elTotal.textContent = 'Produtos: ' + formatBR(totalProdutos);
    } catch (e) {
      totalProdutos = 0;
      if (elTotal) elTotal.textContent = formatBR(0);
    }
  }

  function setMsg(t, erro) {
    if (!msg) return;
    msg.textContent = t || '';
    msg.style.color = erro ? '#b91c1c' : '#111827';
  }

  function limparCampos() {
    if (logradouro) logradouro.value = '';
    if (bairro) bairro.value = '';
    if (cidade) cidade.value = '';
    if (estado) estado.value = '';
    if (freteEl) freteEl.textContent = '';
    if (totalFinalEl) totalFinalEl.textContent = '';
  }

  function formatarCep(cep) {
    cep = String(cep || '').replace(/\D/g, '');
    return cep.length > 5 ? cep.slice(0, 5) + '-' + cep.slice(5) : cep;
  }

  //  Função de frete simplificada
  function calcularFrete(uf) {
    const tabela = {
      'SP': 20, 'RJ': 20, 'MG': 20, 'ES': 20,
      'BA': 40, 'PE': 40, 'CE': 40, 'RN': 40, 'PB': 40, 'MA': 40, 'PI': 40, 'AL': 40, 'SE': 40,
      'RS': 35, 'SC': 35, 'PR': 35,
      'DF': 30, 'GO': 30, 'MT': 30, 'MS': 30,
      'AM': 50, 'PA': 50, 'RO': 50, 'RR': 50, 'AP': 50, 'TO': 50, 'AC': 50
    };
    return tabela[uf] || 45; // valor padrão
  }

  async function buscarCep() {
    const cepNum = String(cepInput.value || '').replace(/\D/g, '');
    if (cepNum.length !== 8) { 
      setMsg('CEP inválido. Deve conter 8 dígitos.', true); 
      limparCampos(); 
      return; 
    }
    btnBuscar.disabled = true; 
    btnBuscar.textContent = 'Buscando...'; 
    setMsg('');
    try {
      const r = await fetch('https://viacep.com.br/ws/' + cepNum + '/json/');
      if (!r.ok) throw new Error('Falha na consulta');
      const data = await r.json();
      if (data.erro) { 
        setMsg('CEP não encontrado. Preencha manualmente.', true); 
        limparCampos(); 
        return; 
      }
      if (logradouro) logradouro.value = data.logradouro || '';
      if (bairro) bairro.value = data.bairro || '';
      if (cidade) cidade.value = data.localidade || '';
      if (estado) estado.value = data.uf || '';
      const numero = document.getElementById('numero'); 
      if (numero) numero.focus();

      // 🔹 Calcula o frete
      const valorFrete = calcularFrete(data.uf);
      if (freteEl) freteEl.textContent = 'Frete: ' + formatBR(valorFrete);

      // 🔹 Mostra o total final (produtos + frete)
      if (totalFinalEl) {
        const soma = totalProdutos + valorFrete;
        totalFinalEl.textContent = 'Total (produtos + frete): ' + formatBR(soma);
      }

      setMsg('Endereço encontrado.');
    } catch (e) { 
      setMsg('Erro ao buscar CEP. Tente novamente.', true); 
      limparCampos(); 
    }
    finally { 
      btnBuscar.disabled = false; 
      btnBuscar.textContent = 'Buscar CEP'; 
    }
  }

  if (cepInput) {
    cepInput.addEventListener('input', () => { cepInput.value = formatarCep(cepInput.value); });
    cepInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); if (btnBuscar) buscarCep(); } });
  }
  if (btnBuscar) btnBuscar.addEventListener('click', buscarCep);

  calcularTotalCarrinho();
});
