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
        <a href="produto.html?id=${produto.id}" class="btn-ver">Comprar Agora</a>
      </article>
    `).join('');
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    container.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
  }
});
