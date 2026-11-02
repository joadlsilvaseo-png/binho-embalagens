/* =====================================================
   BINHO EMBALAGENS
   CATÁLOGO DIGITAL | JAVASCRIPT V1
   ===================================================== */

"use strict";

/* =====================================================
   1. CONFIGURAÇÕES GERAIS
===================================================== */

// Substitua pelo WhatsApp comercial real.
// Formato: 55 + DDD + número, sem espaços ou símbolos.
// Exemplo de formato: 5511999999999
// Deixe vazio enquanto o número não estiver definido.

const WHATSAPP_NUMERO = "5511997410075";

// Intervalo entre banners: 5 segundos.
const TEMPO_CARROSSEL = 5000;

/* =====================================================
   2. MENU HAMBÚRGUER
===================================================== */

const menuToggle = document.getElementById("menu-toggle");
const menuPrincipal = document.getElementById("menu-principal");

function abrirMenu() {
  if (!menuToggle || !menuPrincipal) return;

  menuToggle.classList.add("is-active");
  menuPrincipal.classList.add("is-open");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Fechar menu");

  document.body.classList.add("menu-open");
}

function fecharMenu() {
  if (!menuToggle || !menuPrincipal) return;

  menuToggle.classList.remove("is-active");
  menuPrincipal.classList.remove("is-open");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");

  document.body.classList.remove("menu-open");
}

if (menuToggle && menuPrincipal) {
  menuToggle.addEventListener("click", () => {
    const aberto = menuPrincipal.classList.contains("is-open");

    if (aberto) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  menuPrincipal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
  });

  document.addEventListener("click", (evento) => {
    const clicouNoMenu = menuPrincipal.contains(evento.target);
    const clicouNoBotao = menuToggle.contains(evento.target);

    if (!clicouNoMenu && !clicouNoBotao) {
      fecharMenu();
    }
  });
}

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    fecharMenu();
  }
});

/* =====================================================
   3. CARROSSEL PRINCIPAL
===================================================== */

const carrossel = document.getElementById("hero-carousel");

if (carrossel) {
  const slides = Array.from(carrossel.querySelectorAll(".hero-slide"));

  const indicadores = Array.from(carrossel.querySelectorAll(".carousel-dot"));

  const botaoAnterior = carrossel.querySelector(".carousel-prev");
  const botaoProximo = carrossel.querySelector(".carousel-next");

  let indiceAtual = 0;
  let temporizador = null;

  const movimentoReduzido = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  function mostrarSlide(indice) {
    if (!slides.length) return;

    indiceAtual = (indice + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const ativo = index === indiceAtual;

      slide.hidden = !ativo;
      slide.classList.toggle("is-active", ativo);
    });

    indicadores.forEach((indicador, index) => {
      const ativo = index === indiceAtual;

      indicador.classList.toggle("is-active", ativo);

      if (ativo) {
        indicador.setAttribute("aria-current", "true");
      } else {
        indicador.removeAttribute("aria-current");
      }
    });
  }

  function pararCarrossel() {
    if (temporizador !== null) {
      clearInterval(temporizador);
      temporizador = null;
    }
  }

  function iniciarCarrossel() {
    pararCarrossel();

    if (slides.length < 2 || document.hidden || movimentoReduzido.matches) {
      return;
    }

    temporizador = setInterval(() => {
      mostrarSlide(indiceAtual + 1);
    }, TEMPO_CARROSSEL);
  }

  function navegarPara(indice) {
    mostrarSlide(indice);
    iniciarCarrossel();
  }

  botaoAnterior?.addEventListener("click", () => {
    navegarPara(indiceAtual - 1);
  });

  botaoProximo?.addEventListener("click", () => {
    navegarPara(indiceAtual + 1);
  });

  indicadores.forEach((indicador) => {
    indicador.addEventListener("click", () => {
      const indice = Number(indicador.dataset.slideTo);

      if (Number.isInteger(indice)) {
        navegarPara(indice);
      }
    });
  });

  // Pausa enquanto o usuário interage com o banner.
  carrossel.addEventListener("mouseenter", pararCarrossel);
  carrossel.addEventListener("mouseleave", iniciarCarrossel);

  carrossel.addEventListener("focusin", pararCarrossel);

  carrossel.addEventListener("focusout", (evento) => {
    if (!carrossel.contains(evento.relatedTarget)) {
      iniciarCarrossel();
    }
  });

  // Evita animações automáticas em abas inativas.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pararCarrossel();
    } else {
      iniciarCarrossel();
    }
  });

  movimentoReduzido.addEventListener?.("change", iniciarCarrossel);

  // Inicialização.
  mostrarSlide(0);
  iniciarCarrossel();
}

/* =====================================================
   4. FILTROS DE CATEGORIAS
===================================================== */

const produtosGrid = document.getElementById("products-grid");

const produtos = Array.from(document.querySelectorAll(".product-card"));

const filtros = Array.from(document.querySelectorAll("[data-filter]"));

const mensagemVazia = document.getElementById("empty-state");

function filtrarProdutos(categoria) {
  const categoriaSelecionada = categoria || "all";

  let quantidadeVisivel = 0;

  produtos.forEach((produto) => {
    const categoriaProduto = produto.dataset.category;

    const mostrar =
      categoriaSelecionada === "all" ||
      categoriaProduto === categoriaSelecionada;

    produto.hidden = !mostrar;

    if (mostrar) {
      quantidadeVisivel++;
    }
  });

  if (mensagemVazia) {
    mensagemVazia.hidden = quantidadeVisivel > 0;
  }

  // Identifica a categoria selecionada.
  filtros.forEach((filtro) => {
    const ativo = filtro.dataset.filter === categoriaSelecionada;

    if (filtro.classList.contains("category-card")) {
      if (ativo) {
        filtro.setAttribute("aria-current", "true");
      } else {
        filtro.removeAttribute("aria-current");
      }
    }
  });
}

filtros.forEach((filtro) => {
  filtro.addEventListener("click", (evento) => {
    evento.preventDefault();

    const categoria = filtro.dataset.filter || "all";

    filtrarProdutos(categoria);
    fecharMenu();

    document.getElementById("produtos")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  });
});

// Mostra todos os produtos inicialmente.
if (produtosGrid) {
  filtrarProdutos("all");
}

/* =====================================================
   5. CATÁLOGO E MODAL DE PRODUTOS
===================================================== */

const modalProduto = document.getElementById("product-modal");

const modalFechar = document.getElementById("modal-close");

const modalImagem = document.getElementById("modal-product-image");

const modalTitulo = document.getElementById("modal-product-title");

const modalDescricao = document.getElementById("modal-product-description");

const modalWhatsapp = document.getElementById("modal-whatsapp");

// Utiliza as informações cadastradas no próprio HTML.
// Assim, não precisamos manter dois catálogos diferentes.

function encontrarProduto(id) {
  return produtos.find(
    (produto) =>
      produto.querySelector("[data-product]")?.dataset.product === id,
  );
}

function abrirDetalhesProduto(id) {
  const produto = encontrarProduto(id);

  if (!produto || !modalProduto) return;

  const titulo = produto.querySelector(".product-info h3");
  const descricao = produto.querySelector(".product-info p");
  const imagem = produto.querySelector(".product-image img");

  if (!titulo || !descricao || !imagem) return;

  if (modalTitulo) {
    modalTitulo.textContent = titulo.textContent.trim();
  }

  if (modalDescricao) {
    modalDescricao.textContent = descricao.textContent.trim();
  }

  if (modalImagem) {
    modalImagem.src = imagem.getAttribute("src");
    modalImagem.alt = imagem.alt || titulo.textContent.trim();
  }

  if (modalWhatsapp) {
    modalWhatsapp.dataset.message =
      "Olá! Gostaria de consultar o produto: " +
      titulo.textContent.trim() +
      ".";

    configurarLinkWhatsapp(modalWhatsapp);
  }

  if (!modalProduto.open) {
    modalProduto.showModal();
  }
}

// Eventos dos botões "Ver detalhes".
document.querySelectorAll("[data-product]").forEach((botao) => {
  botao.addEventListener("click", () => {
    abrirDetalhesProduto(botao.dataset.product);
  });
});

// Fechar pelo botão X.
modalFechar?.addEventListener("click", () => {
  modalProduto?.close();
});

// Fechar ao clicar fora da caixa do modal.
modalProduto?.addEventListener("click", (evento) => {
  if (evento.target !== modalProduto) return;

  const caixa = modalProduto.getBoundingClientRect();

  const clicouDentro =
    evento.clientX >= caixa.left &&
    evento.clientX <= caixa.right &&
    evento.clientY >= caixa.top &&
    evento.clientY <= caixa.bottom;

  if (!clicouDentro) {
    modalProduto.close();
  }
});

// A tecla ESC já fecha o <dialog> nativamente.

/* =====================================================
   6. WHATSAPP COMERCIAL
===================================================== */

const numeroLimpo = WHATSAPP_NUMERO.replace(/\D/g, "");

const whatsappConfigurado = /^[1-9]\d{9,14}$/.test(numeroLimpo);

function criarUrlWhatsapp(mensagem) {
  return (
    "https://wa.me/" + numeroLimpo + "?text=" + encodeURIComponent(mensagem)
  );
}

function configurarLinkWhatsapp(link) {
  if (!link) return;

  const mensagem =
    link.dataset.message ||
    "Olá! Gostaria de conhecer os produtos da Binho Embalagens.";

  if (whatsappConfigurado) {
    link.href = criarUrlWhatsapp(mensagem);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#contato";
    link.removeAttribute("target");
    link.removeAttribute("rel");
  }
}

function mostrarAvisoContato() {
  const contato = document.getElementById("contato");

  if (!contato) return;

  let aviso = document.getElementById("aviso-whatsapp");

  if (!aviso) {
    aviso = document.createElement("p");
    aviso.id = "aviso-whatsapp";
    aviso.setAttribute("role", "status");

    aviso.style.cssText = `
      margin-top: 16px;
      max-width: 560px;
      padding: 12px 16px;
      border: 1px solid #d8e5fa;
      border-radius: 10px;
      background: #ffffff;
      color: #102858;
      font-size: 14px;
      line-height: 1.6;
    `;

    const areaTexto = contato.querySelector(".contact-text");

    (areaTexto || contato).appendChild(aviso);
  }

  aviso.textContent =
    "O atendimento pelo WhatsApp estará disponível " +
    "assim que o número comercial for configurado.";

  contato.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Configuração inicial de todos os links.
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  configurarLinkWhatsapp(link);

  link.addEventListener("click", (evento) => {
    if (whatsappConfigurado) return;

    evento.preventDefault();

    // Não enviamos mensagens para números fictícios.
    if (modalProduto?.open) {
      modalProduto.close();
    }

    mostrarAvisoContato();
  });
});

/* =====================================================
   7. NAVEGAÇÃO E LINKS INTERNOS
===================================================== */

// Os links comuns com âncora utilizam a rolagem
// nativa definida no CSS.

document.querySelectorAll('a[href="#inicio"]').forEach((link) => {
  link.addEventListener("click", () => {
    fecharMenu();
  });
});

/* =====================================================
   8. ANO AUTOMÁTICO DO RODAPÉ
===================================================== */

const elementoAno = document.getElementById("current-year");

if (elementoAno) {
  elementoAno.textContent = new Date().getFullYear();
}

/* =====================================================
   9. TRATAMENTO SIMPLES DE IMAGENS AUSENTES
===================================================== */

// Evita que uma imagem inexistente exiba o ícone
// quebrado do navegador. A imagem deve ser adicionada
// à pasta assets para aparecer normalmente.

document.querySelectorAll("img").forEach((imagem) => {
  imagem.addEventListener("error", () => {
    imagem.style.visibility = "hidden";
  });

  imagem.addEventListener("load", () => {
    imagem.style.visibility = "visible";
  });

  if (imagem.complete && imagem.naturalWidth === 0) {
    imagem.style.visibility = "hidden";
  }
});

/* =====================================================
   10. INICIALIZAÇÃO
===================================================== */

console.info("Binho Embalagens | Catálogo iniciado.");

if (!whatsappConfigurado) {
  console.info("WhatsApp pendente: configure WHATSAPP_NUMERO no script.js.");
}
