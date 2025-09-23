document.addEventListener('DOMContentLoaded', function() {
  const idProduto = new URLSearchParams(window.location.search).get('id');
  const produtoSection = document.getElementById('produto-checkout');
  const produtoFoto = document.getElementById('checkout-produto-foto');
  const produtoNome = document.getElementById('checkout-produto-nome');
  const produtoCategoria = document.getElementById('checkout-produto-categoria');
  const produtoMarca = document.getElementById('checkout-produto-marca');
  const produtoPreco = document.getElementById('checkout-produto-preco');
  const produtoDescricao = document.getElementById('checkout-produto-descricao');

  if (idProduto) {
    fetch('./AssetsJS/dados.json')
      .then(res => res.json())
      .then(dados => {
        const produto = dados.find(item => item.id == idProduto);
        if (produto) {
          produtoSection.style.display = 'block';
          produtoFoto.src = produto.foto;
          produtoNome.textContent = produto.nome;
          produtoCategoria.textContent = produto.categoria;
          produtoMarca.textContent = produto.marca;
          produtoPreco.textContent = produto.preco.toFixed(2);
          produtoDescricao.textContent = produto.descricao;
        }
      });
  }
  const $ = id => document.getElementById(id);
  const cepInput = $('cep');
  const btnBuscar = $('btn-buscar-cep');
  const msg = $('msg');
  const frete = $('frete-container');
  const logradouro = $('logradouro');
  const bairro = $('bairro');
  const cidade = $('cidade');
  const estado = $('estado');

  const valorProdutoElem = document.createElement('div');
  valorProdutoElem.id = 'valor-produto';
  const somaTotalElem = document.createElement('div');
  somaTotalElem.id = 'soma-total';
  valorProdutoElem.style.display = 'none';
  somaTotalElem.style.display = 'none';
  frete.parentNode.insertBefore(valorProdutoElem, frete.nextSibling);
  frete.parentNode.insertBefore(somaTotalElem, valorProdutoElem.nextSibling);

  let valorProduto = null;
  let produtoCarregado = false;
  btnBuscar.disabled = true;
  function carregarProduto(callback) {
    if (!idProduto) {
      btnBuscar.disabled = false;
      produtoCarregado = true;
      if (callback) callback();
      return;
    }
    fetch('./AssetsJS/dados.json')
      .then(res => res.json())
      .then(dados => {
        const produto = dados.find(item => item.id == idProduto);
        if (produto) valorProduto = Number(produto.preco);
        produtoCarregado = true;
      })
      .finally(() => {
        btnBuscar.disabled = false;
        if (callback) callback();
      });
  }
  carregarProduto();

  function setMsg(text, isError) {
    msg.textContent = text;
    msg.style.color = isError ? '#f44336' : '#4caf50';
  }

  function limparCampos() {
    ['logradouro','bairro','cidade','estado'].forEach(id => $(id).value = '');
    frete.textContent = '';
    valorProdutoElem.style.display = 'none';
    somaTotalElem.style.display = 'none';
  }

  function calcularFrete(uf) {
    const regioes = {
      'Sudeste': ['SP','RJ','MG','ES'],
      'Nordeste': ['BA','PE','CE','RN','PB','MA','PI','AL','SE'],
      'Sul': ['RS','SC','PR'],
      'Centro-Oeste': ['DF','GO','MT','MS'],
      'Norte': ['AM','PA','RO','RR','AP','TO','AC']
    };
    let regiao = 'Outra Região';
    for (const [nome,ufs] of Object.entries(regioes)) {
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

  function formatarCep(cep) {
    cep = cep.replace(/\D/g, '');
    return cep.length > 5 ? cep.slice(0, 5) + '-' + cep.slice(5) : cep;
  }

  async function buscarCep() {
    if (!produtoCarregado) {
      setMsg('Aguarde o carregamento do produto...', true);
      carregarProduto(() => buscarCep());
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
      logradouro.value = data.logradouro || '';
      bairro.value = data.bairro || '';
      cidade.value = data.localidade || '';
      estado.value = data.uf || '';
      setMsg('Endereço encontrado.');
      const valorFrete = calcularFrete(data.uf);
      frete.textContent = 'Frete: R$ ' + valorFrete.toFixed(2);
      if (typeof valorProduto === 'number' && !isNaN(valorProduto)) {
        valorProdutoElem.textContent = 'Valor do produto: R$ ' + valorProduto.toFixed(2);
        somaTotalElem.textContent = 'Total: R$ ' + (valorProduto + valorFrete).toFixed(2);
        valorProdutoElem.style.display = 'block';
        somaTotalElem.style.display = 'block';
      }
    } catch (error) {
      setMsg('Erro ao buscar CEP.', true);
      limparCampos();
    } finally {
      btnBuscar.disabled = false;
      btnBuscar.textContent = 'Buscar CEP';
    }
  }

  btnBuscar.addEventListener('click', buscarCep);
  cepInput.addEventListener('input', () => {
    cepInput.value = formatarCep(cepInput.value);
  });
    cepInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        buscarCep();
      }
    });
  });