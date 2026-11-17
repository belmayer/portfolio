/* =========================================================
   Portfólio · Isabella Mayer
   ========================================================= */

// Contatos: todos os botões e links de contato usam estes valores.
const CONTATO = {
  whatsapp: "5521992095025",          // DDI + DDD + número, só dígitos
  email: "isabella.mayerrs@gmail.com",
  linkedin: "https://www.linkedin.com/in/isabella-mayer-22b16024a",
  github: "https://github.com/belmayer",
};

const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const telaPequena = () => window.matchMedia("(max-width: 760px)").matches;

/* ---------- Ano no rodapé ---------- */
document.getElementById("ano").textContent = new Date().getFullYear();

/* ---------- Links de contato ---------- */
const linkWhatsApp = (texto = "") =>
  `https://wa.me/${CONTATO.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

// Mensagem dos botões de WhatsApp (e do formulário, quando enviado em branco)
const MENSAGEM_PADRAO = "Olá! Tenho um projeto em mente e gostaria de solicitar mais informações sobre o desenvolvimento.";

const destinos = {
  whatsapp: linkWhatsApp(MENSAGEM_PADRAO),
  email: `mailto:${CONTATO.email}`,
  linkedin: CONTATO.linkedin,
  github: CONTATO.github,
};
const textos = {
  whatsapp: "+" + CONTATO.whatsapp.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, "$1 $2 $3-$4"),
  email: CONTATO.email,
  linkedin: CONTATO.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
  github: CONTATO.github.replace(/^https?:\/\/(www\.)?/, ""),
};
document.querySelectorAll("[data-contato]").forEach((el) => (el.href = destinos[el.dataset.contato]));
document.querySelectorAll("[data-contato-texto]").forEach((el) => (el.textContent = textos[el.dataset.contatoTexto]));

/* ---------- Menu do celular ---------- */
const toggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

const fecharMenu = () => {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menu");
};
toggle.addEventListener("click", () => {
  const aberto = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", aberto);
  toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));
document.addEventListener("keydown", (e) => e.key === "Escape" && fecharMenu());

/* ---------- Cabeçalho ao rolar ---------- */
const header = document.querySelector(".header");
const marcarRolagem = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", marcarRolagem, { passive: true });
marcarRolagem();

/* ---------- Link ativo no menu ---------- */
const linksMenu = [...nav.querySelectorAll("a:not(.btn)")];
const secoesMenu = linksMenu.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
const espiao = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      linksMenu.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + entrada.target.id));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
secoesMenu.forEach((s) => espiao.observe(s));

/* ---------- Entrada progressiva ao rolar ---------- */
if (reduzMovimento) {
  document.documentElement.classList.add("no-reveal");
} else {
  const grupos = [
    ".hero__text > *",
    ".section__head > *",
    ".concept__text > *",
    ".concept__shape",
    ".svc",
    ".work",
    ".about__text > *",
    ".about__panel",
    ".tech__head",
    ".stack li",
    ".contact__text > *",
    ".form",
  ];
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  grupos.forEach((seletor) => {
    document.querySelectorAll(seletor).forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", `${Math.min(i, 6) * 0.08}s`);
      observador.observe(el);
    });
  });
}

/* ---------- Destaque que acompanha o mouse nos cards ---------- */
document.querySelectorAll(".spot").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

/* ---------- Profundidade na composição do hero ---------- */
const hero = document.querySelector(".hero");
const stage = document.getElementById("stage");
if (stage && !reduzMovimento && window.matchMedia("(hover: hover)").matches) {
  hero.addEventListener("pointermove", (e) => {
    if (telaPequena()) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    stage.style.setProperty("--rx", `${x * 6}deg`);
    stage.style.setProperty("--ry", `${-y * 4}deg`);
  });
  hero.addEventListener("pointerleave", () => {
    stage.style.setProperty("--rx", "0deg");
    stage.style.setProperty("--ry", "0deg");
  });
}

/* ---------- Formulário de contato ----------
   Sem servidor: monta a mensagem e abre o WhatsApp ou o e-mail já preenchidos.
   Nunca bloqueia: em branco usa a mensagem padrão; preenchido em parte, usa só o que foi escrito. */
const form = document.getElementById("form-contato");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const via = e.submitter?.dataset.via || "whatsapp";
  const nome = form.nome.value.trim();
  const tipo = form.tipo.value;
  const mensagem = form.mensagem.value.trim();
  const emBranco = !nome && !mensagem;

  const texto = emBranco
    ? MENSAGEM_PADRAO
    : [
        nome ? `Olá, Isabella! Meu nome é ${nome}.` : "Olá, Isabella!",
        `Tipo de projeto: ${tipo}`,
        mensagem ? `\n${mensagem}` : "",
      ].filter(Boolean).join("\n");

  if (via === "email") {
    const assunto = emBranco ? "Contato pelo portfólio" : `Projeto: ${tipo}`;
    window.location.href = `mailto:${CONTATO.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(texto)}`;
  } else {
    window.open(linkWhatsApp(texto), "_blank", "noopener");
  }
});

/* =========================================================
   Campos 3D em canvas
   - "wave":   onda de malha com pontos luminosos (hero e contato)
   - "sphere": forma orgânica de pontos conectados (seção Abordagem)
   Pausam fora da tela e respeitam "reduzir movimento".
   ========================================================= */
const COR = {
  vinho: [142, 50, 66],
  vinhoClaro: [201, 138, 147],
  champagne: [217, 201, 184],
  marrom: [162, 126, 102],
};
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

function criarCampo(canvas) {
  const ctx = canvas.getContext("2d");
  const modo = canvas.dataset.field;
  const horizonte = parseFloat(canvas.dataset.horizon || "0.18");
  let largura = 0, altura = 0, ativo = false, quadro = 0;
  const inicio = performance.now();

  // Esfera: pontos distribuídos (espiral de Fibonacci) e vizinhos pré-calculados
  let pontos = [], pares = [];
  function montarEsfera() {
    const n = telaPequena() ? 220 : 380;
    pontos = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      pontos.push([Math.cos(t) * r, y, Math.sin(t) * r]);
    }
    pares = [];
    const limite = 3.7 / Math.sqrt(n);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pontos[i][0] - pontos[j][0], dy = pontos[i][1] - pontos[j][1], dz = pontos[i][2] - pontos[j][2];
        if (dx * dx + dy * dy + dz * dz < limite * limite) pares.push([i, j]);
      }
    }
  }
  if (modo === "sphere") montarEsfera();

  function redimensionar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = canvas.clientWidth;
    altura = canvas.clientHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!ativo) desenhar(reduzMovimento ? 6 : (performance.now() - inicio) / 1000);
  }

  function desenharOnda(t) {
    const colunas = telaPequena() ? 38 : 64;
    const linhas = telaPequena() ? 16 : 26;
    const cx = largura * 0.5, hy = altura * horizonte;
    const escalaX = largura * 0.6, escalaY = altura * 0.9, camera = 0.6;
    const grade = [];

    for (let r = 0; r < linhas; r++) {
      const z = 1 + (r / (linhas - 1)) * 3.2;
      const p = 1 / z;
      const linha = [];
      for (let c = 0; c < colunas; c++) {
        const x = -2.4 + (c / (colunas - 1)) * 4.8;
        const y =
          0.16 * Math.sin(x * 1.7 + t * 0.45 + z * 0.6) +
          0.10 * Math.sin(z * 2.4 - t * 0.35 + x * 0.8) +
          0.05 * Math.cos(x * 3.1 - t * 0.25);
        linha.push({ sx: cx + x * p * escalaX, sy: hy + (camera - y) * p * escalaY, y, p, z });
      }
      grade.push(linha);
    }

    // linhas da malha (horizontais)
    ctx.lineWidth = 1;
    for (let r = 0; r < linhas; r++) {
      const prof = 1 - r / (linhas - 1);
      ctx.strokeStyle = rgba(COR.vinho, 0.12 + prof * 0.38);
      ctx.beginPath();
      grade[r].forEach((pt, c) => (c ? ctx.lineTo(pt.sx, pt.sy) : ctx.moveTo(pt.sx, pt.sy)));
      ctx.stroke();
    }
    // linhas da malha (profundidade), mais discretas
    for (let c = 0; c < colunas; c += 3) {
      ctx.strokeStyle = rgba(COR.marrom, 0.10);
      ctx.beginPath();
      for (let r = 0; r < linhas; r++) {
        const pt = grade[r][c];
        r ? ctx.lineTo(pt.sx, pt.sy) : ctx.moveTo(pt.sx, pt.sy);
      }
      ctx.stroke();
    }
    // pontos luminosos: champagne nas cristas, vinho no restante
    for (let r = 0; r < linhas; r++) {
      const prof = 1 - r / (linhas - 1);
      for (let c = 0; c < colunas; c += 2) {
        const pt = grade[r][c];
        const crista = Math.max(0, (pt.y - 0.08) / 0.2);
        const tamanho = 0.6 + pt.p * 1.6 + crista * 0.8;
        ctx.fillStyle = crista > 0.15
          ? rgba(COR.champagne, Math.min(0.9, 0.2 + crista * 0.7) * prof)
          : rgba(COR.vinhoClaro, 0.18 + prof * 0.35);
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, tamanho, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function desenharEsfera(t) {
    const cx = largura / 2, cy = altura / 2, raio = Math.min(largura, altura) * 0.36;
    const rotY = t * 0.12, rotX = 0.42;
    const cy1 = Math.cos(rotY), sy1 = Math.sin(rotY), cx1 = Math.cos(rotX), sx1 = Math.sin(rotX);

    const proj = pontos.map(([x, y, z]) => {
      const d = 1 + 0.10 * Math.sin(3 * y + t * 0.7) * Math.cos(2 * x + t * 0.5) + 0.05 * Math.sin(5 * z - t * 0.4);
      let px = x * d, py = y * d, pz = z * d;
      const x1 = px * cy1 + pz * sy1, z1 = -px * sy1 + pz * cy1;
      const y2 = py * cx1 - z1 * sx1, z2 = py * sx1 + z1 * cx1;
      const persp = 2.6 / (2.6 + z2);
      return { sx: cx + x1 * raio * persp, sy: cy + y2 * raio * persp, prof: (1 - z2) / 2 };
    });

    ctx.lineWidth = 0.8;
    for (const [i, j] of pares) {
      const a = proj[i], b = proj[j];
      const prof = (a.prof + b.prof) / 2;
      ctx.strokeStyle = rgba(COR.vinhoClaro, 0.04 + prof * 0.30);
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();
    }
    for (const pt of proj) {
      ctx.fillStyle = pt.prof > 0.62 ? rgba(COR.champagne, 0.25 + (pt.prof - 0.62) * 1.6) : rgba(COR.vinhoClaro, 0.12 + pt.prof * 0.4);
      ctx.beginPath();
      ctx.arc(pt.sx, pt.sy, 0.7 + pt.prof * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function desenhar(t) {
    ctx.clearRect(0, 0, largura, altura);
    if (!largura || !altura) return;
    modo === "sphere" ? desenharEsfera(t) : desenharOnda(t);
  }

  function loop(agora) {
    if (!ativo) return;
    desenhar((agora - inicio) / 1000);
    quadro = requestAnimationFrame(loop);
  }

  new ResizeObserver(redimensionar).observe(canvas);
  redimensionar();

  if (reduzMovimento) return; // desenha um quadro parado e não anima

  let naTela = false;
  const atualizar = () => {
    const visivel = naTela && !document.hidden;
    if (visivel && !ativo) { ativo = true; quadro = requestAnimationFrame(loop); }
    if (!visivel && ativo) { ativo = false; cancelAnimationFrame(quadro); }
  };
  new IntersectionObserver(([entrada]) => { naTela = entrada.isIntersecting; atualizar(); }).observe(canvas);
  document.addEventListener("visibilitychange", atualizar);
}

document.querySelectorAll("canvas[data-field]").forEach(criarCampo);
