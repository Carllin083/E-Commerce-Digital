// produto.js: ajusta link do botão comprar, adiciona ao carrinho, mini-galeria --- IGNORE ---
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


document.addEventListener('DOMContentLoaded', function(){
  var id = new URLSearchParams(window.location.search).get('id');
  var btn = document.getElementById('btn-add-carrinho');
  if(btn && id){
    btn.addEventListener('click', function(){
      Cart.add(id, 1);
    });
  }
});

// Mini-galeria simples
document.addEventListener('DOMContentLoaded', function(){
  try{
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const miniaturas = document.getElementById('lista-miniaturas');
    const imgPrincipal = document.getElementById('produto-foto');
    if(!miniaturas || !imgPrincipal) return;
    fetch('./AssetsJS/dados.json')
      .then(r => r.json())
      .then(lista => {
        const prod = Array.isArray(lista) ? lista.find(p => String(p.id) === String(id)) : null;
        const imagens = [];
        if (prod && Array.isArray(prod.imagens) && prod.imagens.length > 0) {
          imagens.push(...prod.imagens);
        } else if (prod && prod.foto) {
          imagens.push(prod.foto, prod.foto, prod.foto);
        }
        imagens.slice(0,4).forEach((url, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.style.border = '1px solid #e5e7eb';
          btn.style.borderRadius = '8px';
          btn.style.padding = '2px';
          btn.style.background = '#fff';
          btn.style.cursor = 'pointer';
          const im = document.createElement('img');
          im.src = url;
          im.alt = 'Miniatura ' + (idx+1);
          im.width = 64; im.height = 64;
          im.style.objectFit = 'cover';
          btn.appendChild(im);
          btn.addEventListener('click', () => { imgPrincipal.src = url; });
          miniaturas.appendChild(btn);
        });
      });
  }catch(e){}
});
