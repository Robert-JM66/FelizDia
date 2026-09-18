/* ==========================================================
   2. EL RAMO (se dibuja solo)
   ========================================================== */

const NS = "http://www.w3.org/2000/svg";
const ramo = document.getElementById("ramo");

const FLORES = [
  { x:50, y:28, esc:.92, rot:  0, t:0.00, v:"6.2s" },
  { x:38, y:27, esc:.82, rot:-10, t:0.10, v:"7.1s" },
  { x:62, y:27, esc:.82, rot: 10, t:0.16, v:"6.6s" },
  { x:29, y:23, esc:.70, rot:-18, t:0.22, v:"7.6s" },
  { x:71, y:23, esc:.70, rot: 18, t:0.28, v:"6.9s" },
  { x:44, y:39, esc:.68, rot: -7, t:0.34, v:"7.8s" },
  { x:56, y:39, esc:.68, rot:  7, t:0.40, v:"7.3s" },
  { x:34, y:37, esc:.60, rot:-15, t:0.46, v:"8.1s" },
  { x:66, y:37, esc:.60, rot: 15, t:0.52, v:"7.7s" },
  { x:24, y:30, esc:.54, rot:-24, t:0.58, v:"8.4s" },
  { x:76, y:30, esc:.54, rot: 24, t:0.64, v:"8.0s" },
  { x:42, y:49, esc:.52, rot: -8, t:0.70, v:"8.6s" },
  { x:58, y:49, esc:.52, rot:  8, t:0.76, v:"8.2s" },
  { x:36, y:45, esc:.56, rot:-12, t:0.82, v:"8.8s" },
  { x:64, y:45, esc:.56, rot: 12, t:0.88, v:"8.5s" }
];

function semillas(){
  let s = "";
  for(let i=0;i<110;i++){
    const r = 2.9*Math.sqrt(i), a = i*2.39996;
    if(r > 26) continue;
    s += `<circle cx="${(r*Math.cos(a)).toFixed(1)}" cy="${(r*Math.sin(a)).toFixed(1)}" r="1.5" fill="#6B4A22" opacity=".55"/>`;
  }
  return s;
}
const SEMILLAS = semillas();

function girasol(f, idx){
  const div = document.createElement("div");
  div.className = "flor";
  div.style.cssText = `left:${f.x}%;bottom:${f.y}%;--rot:${f.rot}deg;--esc:${f.esc};--tardanza:${f.t}s;--vaiven:${f.v}`;

  let petalos = "";
  const N = 14, paso = 360/N;
  for(let i=0;i<N;i++){                       // corona exterior
    petalos += `<g transform="rotate(${i*paso})"><path class="petalo" style="--n:${i}"
      d="M0 -10 C 17 -30, 17 -70, 0 -90 C -17 -70, -17 -30, 0 -10 Z"
      fill="url(#gp${idx})" stroke="#C88A0E" stroke-opacity=".35" stroke-width="1"/></g>`;
  }
  for(let i=0;i<N;i++){                       // corona interior
    petalos += `<g transform="rotate(${i*paso + paso/2}) scale(.7)"><path class="petalo" style="--n:${i+N}"
      d="M0 -10 C 17 -30, 17 -70, 0 -90 C -17 -70, -17 -30, 0 -10 Z"
      fill="url(#gq${idx})" stroke="#C88A0E" stroke-opacity=".25" stroke-width="1"/></g>`;
  }

  div.innerHTML = `
  <div class="mecer">
  <svg viewBox="0 0 200 430" xmlns="${NS}">
    <defs>
      <linearGradient id="gp${idx}" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#E09B12"/><stop offset="55%" stop-color="#FFCE2B"/><stop offset="100%" stop-color="#FFE894"/>
      </linearGradient>
      <linearGradient id="gq${idx}" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#D98F0C"/><stop offset="100%" stop-color="#FFC01E"/>
      </linearGradient>
      <radialGradient id="gc${idx}" cx="38%" cy="32%">
        <stop offset="0%" stop-color="#6B4A22"/><stop offset="70%" stop-color="#3A2312"/><stop offset="100%" stop-color="#22140A"/>
      </radialGradient>
    </defs>

    <path d="M100 150 C 94 250, 106 340, 100 430" stroke="#3F7A2F" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M100 250 C 60 240, 40 268, 30 300 C 66 306, 92 288, 100 262 Z" fill="#4E8B3C"/>
    <path d="M100 318 C 140 308, 160 332, 170 364 C 134 370, 108 352, 100 328 Z" fill="#437A33"/>

    <g transform="translate(100,120)">
      ${petalos}
      <g class="corazon-grupo" style="--tardanza:${f.t}s">
        <circle r="31" fill="url(#gc${idx})"/>
        <circle r="31" fill="none" stroke="#FFC01E" stroke-opacity=".5" stroke-width="2"/>
        ${SEMILLAS}
      </g>
    </g>
  </svg>
  </div>`;
  return div;
}

FLORES.forEach((f,i)=> ramo.appendChild(girasol(f,i)));

/* --- Ajuste del ramo al alto disponible -------------------
   El lienzo ya tiene proporciÃ³n fija, asÃ­ que aquÃ­ solo se
   decide cuÃ¡nto agrandarlo o reducirlo para que llene el hueco
   que queda bajo el saludo, sin que se salgan las flores. */
const escenaEl = document.querySelector(".escena");
const saludoEl = document.querySelector(".saludo");

function ajustarRamo(){
  ramo.style.setProperty("--ajuste", "1");
  const alto  = ramo.getBoundingClientRect().height;
  const libre = escenaEl.getBoundingClientRect().bottom
              - saludoEl.getBoundingClientRect().bottom - 6;
  if(alto > 0){
    const s = Math.min(1.35, Math.max(.55, libre / alto));
    ramo.style.setProperty("--ajuste", s.toFixed(3));
  }
}
ajustarRamo();
addEventListener("resize", ajustarRamo);
addEventListener("orientationchange", ()=> setTimeout(ajustarRamo, 250));
if(document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarRamo);

// estrellas
const cielo = document.getElementById("cielo");
for(let i=0;i<70;i++){
  const e = document.createElement("span");
  e.className = "estrella";
  e.style.left = Math.random()*100 + "%";
  e.style.top = Math.random()*70 + "%";
  e.style.animationDelay = (Math.random()*4).toFixed(2) + "s";
  e.style.opacity = (.2 + Math.random()*.5).toFixed(2);
  cielo.appendChild(e);
}

// mariposas
const MARIPOSAS = [
  {ruta:"ruta1", vuelo:"19s", t:"0s",  esc:1},
  {ruta:"ruta2", vuelo:"23s", t:"4s",  esc:.8},
  {ruta:"ruta3", vuelo:"17s", t:"8s",  esc:.7},
  {ruta:"ruta1", vuelo:"26s", t:"12s", esc:.6},
  {ruta:"ruta2", vuelo:"21s", t:"16s", esc:.9}
];
const alas = `<svg viewBox="0 0 40 30" xmlns="${NS}">
  <path d="M20 15 C 8 -2, -4 4, 3 14 C -4 24, 8 30, 20 15 Z" fill="#FFD84D" stroke="#7A5A00" stroke-width="1.4"/>
  <path d="M20 15 C 32 -2, 44 4, 37 14 C 44 24, 32 30, 20 15 Z" fill="#FFC01E" stroke="#7A5A00" stroke-width="1.4"/>
  <ellipse cx="20" cy="15" rx="2" ry="6" fill="#4A3300"/>
</svg>`;
MARIPOSAS.forEach(m=>{
  const d = document.createElement("div");
  d.className = "mariposa";
  d.setAttribute("aria-hidden","true");
  d.style.cssText = `--ruta:${m.ruta};--vuelo:${m.vuelo};--tardanza:${m.t};width:${26*m.esc}px`;
  d.innerHTML = `<span>${alas}</span>`;
  document.querySelector(".escena").appendChild(d);
});

// Dedicatorias: el modal no requiere servicios externos y funciona sin conexiÃ³n.
const DEDICATORIAS = {
  amor: [
"Eres esa casualidad bonita que le dio más luz a mis días.",
"Contigo, hasta los días normales se sienten especiales.",
"Que este ramo te recuerde lo mucho que iluminas mi vida.",
"Mi lugar favorito siempre será donde estés tú.",
"No necesito un día especial para agradecer que existas en mi vida.",
"Tu sonrisa tiene la hermosa costumbre de alegrar todo a su alrededor.",
"Si pudiera elegir de nuevo, volvería a encontrarte una y mil veces.",
"Eres mi detalle favorito en la historia de todos mis días.",
"A tu lado aprendí que el amor también se parece a la calma.",
"Que nunca se nos olvide cuidar esto tan bonito que tenemos.",
"Hay personas que llegan y hacen que el mundo se sienta como hogar.",
"Te regalo estas flores, pero mi deseo es verte florecer siempre."
  ],
  amistad: [
   "Gracias por ser esa amistad que hace más ligeros los días difíciles.",
"Una amistad como la tuya merece flores, risas y muchos momentos bonitos.",
"Tu forma de estar hace que todo se sienta un poquito mejor.",
"Que nunca nos falten razones para celebrar nuestra amistad.",
"Las mejores amistades convierten un momento simple en un recuerdo enorme.",
"Gracias por escuchar, acompañar y hacerme reír incluso sin intentarlo.",
"Tenerte cerca es una de esas cosas bonitas que no doy por sentadas.",
"Que la vida nos siga regalando conversaciones largas y risas sinceras.",
"Tu amistad es una luz que siempre sabe llegar en el momento indicado.",
"Las flores son amarillas; nuestra amistad, de las que duran de verdad.",
"Eres de esas personas que hacen que todo se sienta menos complicado.",
"Gracias por ser refugio, aventura y compañía en tantos momentos."
  ]
};
const modal = document.getElementById("modal-mensajes");
const abrirMensajes = document.getElementById("abrir-mensajes");
const cerrarMensajes = document.getElementById("cerrar-mensajes");
const textoDedicatoria = document.getElementById("texto-dedicatoria");
const botonesTipo = [...document.querySelectorAll("[data-tipo]")];
let tipoActual = "amor";
let indiceMensaje = 0;

function mostrarDedicatoria(){
  textoDedicatoria.textContent = DEDICATORIAS[tipoActual][indiceMensaje];
}
function abrirModal(){
  modal.hidden = false;
  mostrarDedicatoria();
  cerrarMensajes.focus();
}
function cerrarModal(){
  modal.hidden = true;
  abrirMensajes.focus();
}
abrirMensajes.addEventListener("click", abrirModal);
cerrarMensajes.addEventListener("click", cerrarModal);
document.getElementById("otro-mensaje").addEventListener("click", ()=>{
  indiceMensaje = (indiceMensaje + 1) % DEDICATORIAS[tipoActual].length;
  mostrarDedicatoria();
});
botonesTipo.forEach(boton=> boton.addEventListener("click", ()=>{
  tipoActual = boton.dataset.tipo;
  indiceMensaje = 0;
  botonesTipo.forEach(item=> item.classList.toggle("activo", item === boton));
  mostrarDedicatoria();
}));
modal.addEventListener("click", evento=>{ if(evento.target === modal) cerrarModal(); });
addEventListener("keydown", evento=>{ if(evento.key === "Escape" && !modal.hidden) cerrarModal(); });
