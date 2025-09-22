document.addEventListener('DOMContentLoaded', () => {
    const parametroUrl = new URLSearchParams(window.location.search);
    const id = parametroUrl.get('id');
    const btnComprar = document.getElementById('btn-comprar');
    if (btnComprar && id) {
        btnComprar.href = `checkout.html?id=${id}`;
    }
    if (!id) return console.error('Parâmetro "id" não encontrado na URL.');

    const carregarProduto = async (id) => {
        try {
            const resposta = await fetch('./AssetsJS/dados.json');
            if (!resposta.ok) throw new Error('Erro ao carregar o arquivo JSON');

            const dados = await resposta.json();
            const produto = dados.find(item => item.id == id);
            if (!produto) return console.error('Produto não encontrado para o id:', id);

            const fotoElem = document.getElementById('produto-foto');
            const nomeElem = document.getElementById('produto-nome');
            const categoriaElem = document.getElementById('produto-categoria');
            const marcaElem = document.getElementById('produto-marca');
            const precoElem = document.getElementById('produto-preco');
            const estoqueElem = document.getElementById('produto-estoque');
            const descricaoElem = document.getElementById('produto-descricao');
            const caracteristicasElem = document.getElementById('produto-caracteristicas');

            if (!fotoElem || !nomeElem || !categoriaElem || !marcaElem || !precoElem || !estoqueElem) {
                console.error('Algum elemento do produto não foi encontrado no DOM.');
                return;
            }

            fotoElem.src = produto.foto;
            fotoElem.alt = `Foto do produto ${produto.nome}`;
            nomeElem.textContent = produto.nome;
            categoriaElem.textContent = produto.categoria;
            marcaElem.textContent = produto.marca;
            precoElem.textContent = produto.preco.toFixed(2);
            estoqueElem.textContent = produto.estoque > 0 ? 'Em estoque' : 'Indisponível';

            if (descricaoElem) descricaoElem.textContent = produto.descricao || '';
            if (caracteristicasElem) {
                caracteristicasElem.innerHTML = '';
                if (produto.caracteristicas && produto.caracteristicas.length) {
                    produto.caracteristicas.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        caracteristicasElem.appendChild(li);
                    });
                }
            }

            return produto;
        } catch (erro) {
            console.error('Erro ao carregar produto:', erro);
        }
    };

    carregarProduto(id);
});
