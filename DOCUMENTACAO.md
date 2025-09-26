
# Documentação do Projeto (Versão Clean – Português)

## Estrutura
- `index.html` – Catálogo (lista de produtos com busca/ordenação).
- `produto.html` – Detalhe do produto (imagem, mini-galeria, adicionar ao carrinho).
- `carrinho.html` – Lista itens do carrinho, altera quantidade, remove, total.
- `checkout.html` – Endereço com ViaCEP, resumo de **Total** (posicionado antes dos dados do cartão), dados de pagamento.
- `AssetsJS/dados.json` – Fonte simples de produtos.
- `AssetsJS/script.js` – Catálogo: carrega produtos, busca/ordenação e renderiza cards.
- `AssetsJS/produto.js` – Página de detalhe: mini-galeria e adicionar ao carrinho.
- `AssetsJS/cart.js` – Módulo do carrinho (localStorage).
- `AssetsJS/carrinho.js` – Página do carrinho: renderização e interações.
- `AssetsJS/checkout.js` – Checkout: calcula Total a partir do carrinho e ViaCEP.
- `AssetsCSS/*` – Estilos.

## Fluxo
1. **Catálogo:** carrega `dados.json`, guarda em memória, aplica filtro (nome/categoria) e ordenação **simples** (Nome A–Z / Preço ↑), e re-renderiza os cards.
2. **Detalhe:** mostra dados, mini-galeria (usa `imagens[]` se existir, senão repete a foto) e adiciona ao carrinho.
3. **Carrinho:** lê itens do `localStorage`, permite alterar/ remover e recalcula subtotal/total.
4. **Checkout:** lê o carrinho + `dados.json` para recompor o total, busca CEP no ViaCEP (com tratamento de erros e `aria-live`) e dá **foco em Número** após sucesso.

## Principais funções (resumo conceitual)
### `AssetsJS/cart.js`
- `read()` (exportado como `Cart.read`) – Lê o carrinho do `localStorage`.
- `add(id, quantidade)` – Adiciona/atualiza item.
- `setQty(id, quantidade)` – Define quantidade.
- `remove(id)` – Remove item.
- `clear()` – Limpa carrinho.
- `count()` – Total de unidades.
- `updateBadge()` – Atualiza o selo do carrinho no header.

### `AssetsJS/script.js` (catálogo)
- Mantém `produtosOriginais` em memória.
- `aplicarFiltroEOrdenacao()` – Filtra por nome/categoria e ordena por **nome** ou **preço**.
- `renderizar(lista)` – Gera os `article.produto-card`.
- `definirBusca(valor)` – API simples para ligar um input externo de busca.

### `AssetsJS/produto.js` (detalhe)
- Mini-galeria: cria até 4 miniaturas; clique troca a imagem principal.
- Botão “Adicionar ao carrinho”: usa `Cart.add(id, 1)`.

### `AssetsJS/carrinho.js`
- Desenha a lista com subtotal por item, permite alterar quantidade e remover, e calcula **total**.

### `AssetsJS/checkout.js`
- `calcularTotalCarrinho()` – Reconstrói e mostra o **Total** a partir do `localStorage` + `dados.json`.
- ViaCEP: máscara 00000-000, mensagens com `aria-live`, tratamento de erro, foco em **Número** após sucesso.

## Acessibilidade e UX
- Mensagens do ViaCEP com `aria-live="polite"`.
- Foco no campo **Número** após CEP com sucesso.
- Botões com rótulos/aria simples.

## Como rodar
- Abrir `index.html` no navegador (opcionalmente com Live Server).
- Fluxo: **Catálogo → Detalhe → Carrinho → Checkout**.

## Observações
- O **Total** no checkout não depende de query string: é recalculado localmente, então funciona mesmo recarregando a página.
- Ordenação via **re-renderização** evita travamentos.
