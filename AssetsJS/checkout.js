document.addEventListener('DOMContentLoaded', function() {
  var cepInput = document.getElementById('cep');
  var btnBuscar = document.getElementById('btn-buscar-cep');
  var msg = document.getElementById('msg');
  var logradouro = document.getElementById('logradouro');
  var bairro = document.getElementById('bairro');
  var cidade = document.getElementById('cidade');
  var estado = document.getElementById('estado');
  var frete = document.getElementById('frete-container');

  function setMsg(text, isError) {
    msg.textContent = text;
    if (isError === true) {
      msg.style.color = '#f44336';
    } else {
      msg.style.color = '#4caf50';
    }
  }

  function limparCampos() {
    logradouro.value = '';
    bairro.value = '';
    cidade.value = '';
    estado.value = '';
    frete.textContent = '';
  }

  function calcularFrete(regiao) {
    if (regiao === 'Sudeste') {
      return 20;
    }
    if (regiao === 'Nordeste') {
      return 40;
    }
    if (regiao === 'Sul') {
      return 35;
    }
    if (regiao === 'Centro-Oeste') {
      return 30;
    }
    if (regiao === 'Norte') {
      return 50;
    }
    return 45;
  }

  function formatarCep(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length > 5) {
      return cep.slice(0, 5) + '-' + cep.slice(5);
    }
    return cep;
  }

  async function buscarCep() {
    var cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) {
      setMsg('CEP inválido. Deve conter 8 dígitos.', true);
      limparCampos();
      return;
    }

    btnBuscar.disabled = true;
    btnBuscar.textContent = 'Buscando...';
    setMsg('');

    try {
      var response = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      var data = await response.json();

      if (data.erro) {
        setMsg('CEP não encontrado.', true);
        limparCampos();
      } else {
        if (data.logradouro) {
          logradouro.value = data.logradouro;
        } else {
          logradouro.value = '';
        }

        if (data.bairro) {
          bairro.value = data.bairro;
        } else {
          bairro.value = '';
        }

        if (data.localidade) {
          cidade.value = data.localidade;
        } else {
          cidade.value = '';
        }

        if (data.uf) {
          estado.value = data.uf;
        } else {
          estado.value = '';
        }

        var regiao = data.regiao;
        if (!regiao) {
          regiao = 'Outra Região';
        }

        setMsg('Endereço encontrado.');
        frete.textContent = 'Frete: R$ ' + calcularFrete(regiao).toFixed(2);
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

  cepInput.addEventListener('input', function() {
    cepInput.value = formatarCep(cepInput.value);
  });

  cepInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarCep();
    }
  });
});
