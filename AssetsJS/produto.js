window.addEventListener('DOMContentLoaded', function() {
  if (window.lucide) lucide.createIcons();
  // Corrige o link do botão para passar o id do produto
  const parametroUrl = new URLSearchParams(window.location.search);
  const id = parametroUrl.get('id');
  const btnComprar = document.getElementById('btn-comprar');
  if (btnComprar && id) {
    btnComprar.href = `checkout.html?id=${id}`;
  }
});
