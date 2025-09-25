// Aguarda o carregamento completo da página antes de rodar o código
document.addEventListener('DOMContentLoaded', function () {

  // CAPTURA UMA LISTA DE IDS DO PRODUTO NA URL
  const idsProduto = new URLSearchParams(window.location.search).get('id');
  // Se houver, transforma em array de ids
  const listaIds = idsProduto ? idsProduto.split(',').map(id => id.trim()) : [];

  // ATALHO PARA getElementById
  const $ = id => document.getElementById(id);

  // SELECIONA O CONTAINER PRINCIPAL PARA EXIBIR PRODUTOS
  const produtoSection = $('produto-checkout');

  // SELECIONA CAMPOS DO FORMULÁRIO DE FRETE
  const cepInput = $('cep');
  const btnBuscar = $('btn-buscar-cep');
  const msg = $('msg');
  const frete = $('frete-container');
  const logradouro = $('logradouro');
  const bairro = $('bairro');
  const cidade = $('cidade');
  const estado = $('estado');

  // CRIA ELEMENTOS DINÂMICOS PARA MOSTRAR VALOR DO PRODUTO E TOTAL
  const valorProdutoElem = document.createElement('div');
  valorProdutoElem.id = 'valor-produto';
  const somaTotalElem = document.createElement('div');
  somaTotalElem.id = 'soma-total';

  // ESCONDE ELEMENTOS INICIALMENTE
  valorProdutoElem.style.display = 'none';
  somaTotalElem.style.display = 'none';

  // INSERE OS ELEMENTOS NA PÁGINA LOGO APÓS O CONTAINER DE FRETE
  frete.parentNode.insertBefore(valorProdutoElem, frete.nextSibling);
  frete.parentNode.insertBefore(somaTotalElem, valorProdutoElem.nextSibling);

  // VARIÁVEIS DE CONTROLE
  let valorProduto = null;
  let produtoSelecionado = null;
  let produtoCarregado = false;
  btnBuscar.disabled = true;

  // 1. FUNÇÃO PARA CARREGAR PRODUTOS
  function carregarProdutos(callback) {
    if (!listaIds.length) {
      produtoCarregado = true;
      btnBuscar.disabled = false;
      if (callback) callback();
      return;
    }
    // Carrega os produtos do arquivo JSON
    fetch('./AssetsJS/dados.json')
      .then(res => res.json())
      .then(dados => {
        // Filtra os produtos pelos ids
        const produtos = dados.filter(item => listaIds.includes(String(item.id)));
        if (produtos.length) {
          produtoSelecionado = produtos;
          // Soma o valor total dos produtos
          valorProduto = produtos.reduce((soma, p) => soma + Number(p.preco), 0);
          produtoCarregado = true;
          // Limpa o container
          produtoSection.innerHTML = '';
          // Para cada produto, cria um bloco de exibição
          produtos.forEach(produto => {
            const bloco = document.createElement('div');
            bloco.className = 'produto-checkout-item';
            bloco.innerHTML = `
              <img src="${produto.foto}" style="max-width:120px;max-height:120px;" />
              <div><strong>${produto.nome}</strong></div>
              <div>Categoria: ${produto.categoria}</div>
              <div>Marca: ${produto.marca}</div>
              <div>Preço: R$ ${Number(produto.preco).toFixed(2)}</div>
              <div>${produto.descricao}</div>
              <hr>
            `;
            produtoSection.appendChild(bloco);
          });
          produtoSection.style.display = 'block';
          btnBuscar.disabled = false;
          if (callback) callback();
        }
      });
  }
  // CHAMA A FUNÇÃO PARA CARREGAR OS PRODUTOS AO INICIAR
  carregarProdutos();
  // Exibe mensagem de sucesso ou erro
  function setMsg(text, isError) {
    msg.textContent = text;
    msg.style.color = isError ? '#f44336' : '#4caf50';
  }
  // Limpa os campos do formulário e resultado
  function limparCampos() {
    ['logradouro', 'bairro', 'cidade', 'estado'].forEach(id => $(id).value = '');
    frete.textContent = '';
    valorProdutoElem.style.display = 'none';
    somaTotalElem.style.display = 'none';
  }
  // Calcula o valor do frete baseado na UF
  function calcularFrete(uf) {
    const regioes = {
      'Sudeste': ['SP', 'RJ', 'MG', 'ES'],
      'Nordeste': ['BA', 'PE', 'CE', 'RN', 'PB', 'MA', 'PI', 'AL', 'SE'],
      'Sul': ['RS', 'SC', 'PR'],
      'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
      'Norte': ['AM', 'PA', 'RO', 'RR', 'AP', 'TO', 'AC']
    };

    let regiao = 'Outra Região';
    for (const [nome, ufs] of Object.entries(regioes)) {
      if (ufs.includes(uf)) regiao = nome;
    }
    return {
      'Sudeste': 20,
      'Nordeste': 40,
      'Sul': 35,
      'Centro-Oeste': 30,
      'Norte': 50
    }[regiao] || 45;
  }
  // Formata o CEP colocando hífen
  function formatarCep(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.length > 5 ? cep.slice(0, 5) + '-' + cep.slice(5) : cep;
  }
  // 3. BUSCA O ENDEREÇO VIA API CEP
  async function buscarCep() {
    if (!produtoCarregado) {
      setMsg('Aguarde o carregamento do produto...', true);
      return;
    }

    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      setMsg('CEP inválido. Deve conter 8 dígitos.', true);
      limparCampos();
      return;
    }

    btnBuscar.disabled = true;
    btnBuscar.textContent = 'Buscando...';
    setMsg('');

    try {
      const response = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
      if (!response.ok) throw new Error('Erro na requisição');
      const data = await response.json();

      if (data.erro) {
        setMsg('CEP não encontrado.', true);
        limparCampos();
        return;
      }
      // Preenche os campos de endereço
      logradouro.value = data.logradouro || '';
      bairro.value = data.bairro || '';
      cidade.value = data.localidade || '';
      estado.value = data.uf || '';
      setMsg('Endereço encontrado.');

      // Calcula e exibe o frete
      const valorFrete = calcularFrete(data.uf);
      frete.textContent = 'Frete: R$ ' + valorFrete.toFixed(2);

      // Mostra o valor do produto e o total
      if (typeof valorProduto === 'number' && !isNaN(valorProduto)) {
        valorProdutoElem.textContent = 'Valor do produto: R$ ' + valorProduto.toFixed(2);
        somaTotalElem.textContent = 'Total: R$ ' + (valorProduto + valorFrete).toFixed(2);
        valorProdutoElem.style.display = 'block';
        somaTotalElem.style.display = 'block';
      }
    } catch (error) {
      setMsg('Erro ao buscar o CEP.', true);
      limparCampos();
    } finally {
      btnBuscar.disabled = false;
      btnBuscar.textContent = 'Buscar';
    }
  }
  // EVENTO DE CLIQUE NO BOTÃO DE BUSCAR CEP
  btnBuscar.addEventListener('click', buscarCep);
});
