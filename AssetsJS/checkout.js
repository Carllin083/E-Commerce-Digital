// Aguarda o carregamento completo da página antes de rodar o código
document.addEventListener('DOMContentLoaded', function () {

  // CAPTURA O ID DO PRODUTO NA URL
  const idProduto = new URLSearchParams(window.location.search).get('id');

  // ATALHO PARA getElementById
  const $ = id => document.getElementById(id);

  // SELECIONA ELEMENTOS DE EXIBIÇÃO DO PRODUTO NA TELA
  const produtoSection = $('produto-checkout');
  const produtoFoto = $('checkout-produto-foto');
  const produtoNome = $('checkout-produto-nome');
  const produtoCategoria = $('checkout-produto-categoria');
  const produtoMarca = $('checkout-produto-marca');
  const produtoPreco = $('checkout-produto-preco');
  const produtoDescricao = $('checkout-produto-descricao');

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

  // 1. FUNÇÃO PARA CARREGAR PRODUTO
  function carregarProduto(callback) {
    if (!idProduto) {
      produtoCarregado = true;
      btnBuscar.disabled = false;
      if (callback) callback();
      return;
    }

    // Carrega o produto do arquivo JSON
    fetch('./AssetsJS/dados.json')
      .then(res => res.json())
      .then(dados => {
        const produto = dados.find(item => item.id == idProduto);
        if (produto) {
          produtoSelecionado = produto;
          valorProduto = Number(produto.preco);
          produtoCarregado = true;

          // Preenche os dados do produto na tela
          produtoSection.style.display = 'block';
          produtoFoto.src = produto.foto;
          produtoNome.textContent = produto.nome;
          produtoCategoria.textContent = produto.categoria;
          produtoMarca.textContent = produto.marca;
          produtoPreco.textContent = produto.preco.toFixed(2);
          produtoDescricao.textContent = produto.descricao;

          btnBuscar.disabled = false;
          if (callback) callback();
        }
      });
  }
  // CHAMA A FUNÇÃO PARA CARREGAR O PRODUTO AO INICIAR
  carregarProduto();
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
