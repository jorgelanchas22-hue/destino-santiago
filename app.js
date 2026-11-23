/* Destino Santiago · 2.º ESO GeH · Salesianos Triana
   Persistencia: Firebase Realtime Database si FIREBASE_CONFIG está relleno;
   si no, modo demostración con localStorage (solo este navegador). */
const FIREBASE_CONFIG = Q0().get("demo") === "1" ? null : {
  apiKey: "AIzaSyDxD8CohD1OBVPEuO-DW8YqLcRuuM2VL-Q",
  authDomain: "destino-santiago.firebaseapp.com",
  databaseURL: "https://destino-santiago-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "destino-santiago",
  storageBucket: "destino-santiago.firebasestorage.app",
  messagingSenderId: "482062221534",
  appId: "1:482062221534:web:8e2a3e5a141d489a37824f"
};
function Q0() { return new URLSearchParams(location.search); }
const PASS_PROFE = "triana2627";
const RAIZ = "destino2627";

const D = window.DS, L = window.LISTAS;
const Q = new URLSearchParams(location.search);
const TABS = [
  { id: "brief", t: "0 · Briefing" }, { id: "m1", t: "1 · Ruta" }, { id: "m2", t: "2 · Mochila" },
  { id: "m3", t: "3 · Dinero" }, { id: "m4", t: "4 · Historia" }, { id: "m5", t: "5 · Imprevisto" },
  { id: "fin", t: "Llegada" }
];

/* ---------- utilidades ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const corto = n => { const p = String(n).split(","); return p.length > 1 ? p[1].trim() + " " + p[0].trim().split(" ")[0] : n; };
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_|_$/g, "");
const equipoId = m => [...m].sort().map(slug).join("__");
const conPorque = s => /porque/i.test(s || "") && (s || "").trim().length >= 15;
const ORDENES = { kmA: [2, 0, 1], kmB: [1, 2, 0], kmC: [0, 2, 1], kmD: [2, 1, 0], cienA: [0, 2, 1], cienB: [2, 1, 0], cienC: [1, 0, 2], cienD: [1, 2, 0], acog: [1, 2, 0], inter: [0, 1, 2], q1: [2, 0, 1], q2: [1, 2, 0], ejemplo: [1, 2, 0] };
const mezcla = (n, clave) => (ORDENES[clave] && ORDENES[clave].length === n) ? ORDENES[clave] : [...Array(n).keys()];
const num = v => (v === "" || v == null || isNaN(+v)) ? null : +v;

/* ---------- almacenamiento ---------- */
const store = {
  modo: "demo", db: null,
  async init() {
    if (!FIREBASE_CONFIG) { this.modo = "demo"; return; }
    await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
    await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js");
    await cargarScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js");
    firebase.initializeApp(FIREBASE_CONFIG);
    await firebase.auth().signInAnonymously();
    this.db = firebase.database(); this.modo = "firebase";
  },
  async get(p) {
    if (this.modo === "demo") { const v = localStorage.getItem("ds:" + p); return v ? JSON.parse(v) : null; }
    const s = await this.db.ref(RAIZ + "/" + p).get(); return s.exists() ? s.val() : null;
  },
  async set(p, v) {
    if (this.modo === "demo") { localStorage.setItem("ds:" + p, JSON.stringify(v)); return; }
    await this.db.ref(RAIZ + "/" + p).set(v);
  },
  async hijos(p) { // devuelve objeto {clave: valor}
    if (this.modo === "demo") {
      const out = {}, pre = "ds:" + p + "/";
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(pre) && !k.slice(pre.length).includes("/")) out[k.slice(pre.length)] = JSON.parse(localStorage.getItem(k)); }
      return out;
    }
    const s = await this.db.ref(RAIZ + "/" + p).get(); return s.exists() ? s.val() : {};
  }
};
function cargarScript(src) { return new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); }

/* ---------- estado ---------- */
let S = null;          // pasaporte del equipo
let tab = "brief";
let sesion = JSON.parse(localStorage.getItem("ds_sesion") || "null"); // {grupo, nombre}
let profe = false;
let tGuardar = null;

function nuevoPasaporte(grupo, miembros, modelo) {
  return {
    grupo, miembros, modelo,
    m1: { orden: [], km: null, cien: null, int: 0, ok: false },
    m2: { sel: [], pares: {}, frase: "", int: 0, ok: false },
    m3: { tra: null, aloj: null, com: null, d: "", c: "", t: "", r: "", just: "", int: 0, ok: false },
    m4: { f: {}, acog: null, inter: null, frase: "", int: 0, ok: false },
    m5: { op: null, tipo: null, rest: "", km: "", compo: null, just: "", int: 0, ok: false },
    ind: {}, creado: Date.now(), upd: Date.now()
  };
}
function M() { return D.MODELOS[S.modelo]; }
function guardar(inmediato) {
  if (!S) return;
  S.upd = Date.now();
  clearTimeout(tGuardar);
  const f = async () => { await store.set(`pasaportes/${slug(S.grupo)}/${equipoId(S.miembros)}`, S); const g = $("#guardado"); if (g) { g.textContent = "Guardado ✓"; } };
  if (inmediato) return f(); tGuardar = setTimeout(f, 600);
}

/* ---------- cálculos y corrección (los usa también el panel) ---------- */
function calc3(st, mod) {
  const tr = mod.transporte.find(x => x.id === st.m3.tra), al = D.ALOJ.find(x => x.id === st.m3.aloj), co = D.COM.find(x => x.id === st.m3.com);
  if (!tr || !al || !co) return null;
  const d = al.p + co.p, c = d * D.DIAS, t = c + tr.p, r = D.PRESUPUESTO - t;
  return { d, c, t, r };
}
function extra5(st, mod) {
  const op = mod.imprevisto.opciones.find(o => o.id === st.m5.op); const k = calc3(st, mod);
  if (!op || !k) return null;
  const extra = op.extra === "diario" ? k.d : op.extra;
  const km = mod.totalKm - op.kmPerdidos;
  return { op, extra, rest: k.r - extra, km, compo: km >= 100 };
}
function evalua(st) {
  const mod = D.MODELOS[st.modelo]; const ordenOK = mod.paradas.filter(p => !p.fija).map(p => p.n);
  const e = {};
  e.m1 = { orden: JSON.stringify(st.m1.orden) === JSON.stringify(ordenOK), km: st.m1.km === 0, cien: st.m1.cien === 0 };
  const buenos = D.MOCHILA.filter(o => o.ok).map(o => o.id).sort();
  e.m2 = { mochila: JSON.stringify([...st.m2.sel].sort()) === JSON.stringify(buenos), paresOk: D.PARES.filter((p, i) => st.m2.pares[i] === p.ok).length, frase: (st.m2.frase || "").trim().length >= 15 };
  const k = calc3(st, mod);
  e.m3 = { calc: !!k && num(st.m3.d) === k.d && num(st.m3.c) === k.c && num(st.m3.t) === k.t && num(st.m3.r) === k.r, reserva: !!k && k.r >= D.RESERVA, just: conPorque(st.m3.just) };
  e.m4 = { funcOk: mod.lugares.filter(l => st.m4.f[l.id] === l.id).length, acog: st.m4.acog === 0, inter: st.m4.inter === 0, frase: (st.m4.frase || "").trim().length >= 15 };
  const x = extra5(st, mod);
  e.m5 = { tipo: !!x && st.m5.tipo === x.op.tipo, rest: !!x && num(st.m5.rest) === x.rest, km: !!x && num(st.m5.km) === x.km, compo: !!x && st.m5.compo === (x.compo ? 0 : 1), alcanza: !!x && x.rest >= 0, just: conPorque(st.m5.just) };
  return e;
}
function discreto(f) { return f >= 0.9 ? 10 : f >= 0.7 ? 7 : f >= 0.5 ? 5 : 2; }
function propuesta(st, nombre) {
  const e = evalua(st), ind = (st.ind || {})[nombre] || {};
  const c2 = discreto(((e.m1.orden ? 2 : 0) + (e.m1.km ? 1 : 0) + (e.m1.cien ? 1 : 0)) / 4);
  const h = e.m2.paresOk / 4 + e.m4.funcOk / 3 + ((e.m4.acog ? 1 : 0) + (e.m4.inter ? 1 : 0)) / 2 + (ind.q1 === D.CIERRE.q1.ok ? 1 : 0) + (ind.q2 === D.CIERRE.q2.ok ? 1 : 0);
  const c1 = discreto(h / 5);
  const dj = (st.m3.ok ? 1 : 0) + (st.m5.ok ? 1 : 0) + ((e.m3.just && e.m5.just) ? 1 : 0) + (conPorque("porque " + (ind.q3f || "")) && (ind.q3f || "").trim().length >= 15 ? 1 : 0);
  const c3 = discreto(dj / 4);
  return { c1, c2, c3, media: Math.round((c1 + c2 + c3) / 3 * 10) / 10 };
}

/* ---------- cabecera ---------- */
function sellos() { return S ? ["m1", "m2", "m3", "m4", "m5"].filter(m => S[m].ok).length : 0; }
function pintaCab() {
  const c = $("#cab");
  if (profe) { c.innerHTML = `<span class="marca"><i class="ti ti-shield-check"></i> Panel del profesor · Destino Santiago</span><button class="tab panel" id="salirProfe">Salir del panel</button>`; $("#salirProfe").onclick = () => { profe = false; render(); }; return; }
  c.innerHTML = `<span class="marca"><i class="ti ti-route"></i> 2.º ESO · Destino Santiago</span>` +
    (S ? `<span class="sellos">Sellos: ${sellos()}/5</span>` : "") +
    TABS.map(t => `<button class="tab ${t.id === tab ? "on" : ""} ${S && S[t.id] && S[t.id].ok ? "hecha" : ""}" data-t="${t.id}">${t.t}</button>`).join("") +
    `<button class="tab panel" id="irProfe" title="Panel del profesor"><i class="ti ti-lock"></i></button>`;
  c.querySelectorAll("[data-t]").forEach(b => b.onclick = () => {
    if (b.dataset.t !== "brief" && !S) { tab = "brief"; render(); const e = $("#errLogin"); if (e) e.textContent = "Primero elegid grupo y nombres y pulsad «Empezar»."; return; }
    tab = b.dataset.t; render(); scrollTo(0, 0);
  });
  $("#irProfe").onclick = () => {
    const a = $("#app");
    a.innerHTML = `<h1>Panel del profesor</h1><div class="caja" style="max-width:420px"><label class="et" for="pw">Contraseña</label><input type="password" id="pw" style="width:100%;font-size:17px;padding:10px;border:2px solid #222"><p class="err" id="errPw"></p><div class="fila"><button class="btn" id="okPw">Entrar</button><button class="btn sec" id="noPw">Volver</button></div></div>`;
    const entrar = () => { if ($("#pw").value === PASS_PROFE) { profe = true; render(); } else $("#errPw").textContent = "Contraseña incorrecta."; };
    $("#okPw").onclick = entrar; $("#pw").onkeydown = e => { if (e.key === "Enter") entrar(); }; $("#noPw").onclick = () => render(); $("#pw").focus();
  };
}

/* ---------- pantallas ---------- */
function render() {
  pintaCab();
  const a = $("#app");
  if (profe) return pintaPanel(a);
  ({ brief: pBrief, m1: pM1, m2: pM2, m3: pM3, m4: pM4, m5: pM5, fin: pFin })[tab](a);
}
function cabecera(titulo, sub) { return `<h1>${titulo}</h1><p class="sub">${sub}</p>`; }
function credencial() {
  const nombres = ["Ruta", "Mochila", "Dinero", "Historia", "Imprevisto"];
  return `<div class="cred">${["m1", "m2", "m3", "m4", "m5"].map((m, i) => `<div class="sello ${S && S[m].ok ? "on" : ""}">${S && S[m].ok ? "✓<br>" + nombres[i] : i + 1}</div>`).join("")}</div>`;
}
function siguiente(id) {
  const i = TABS.findIndex(t => t.id === id); const n = TABS[i + 1];
  return n ? `<button class="btn sec" data-ir="${n.id}">Ir a ${n.t} <i class="ti ti-arrow-right"></i></button>` : "";
}
function enlazarIr(a) { a.querySelectorAll("[data-ir]").forEach(b => b.onclick = () => { tab = b.dataset.ir; render(); scrollTo(0, 0); }); }
function fb(ok, txt) { return `<div class="fb ${ok ? "ok" : "mal"}">${txt}</div>`; }

/* ----- 0 · Briefing ----- */
async function pBrief(a) {
  const grupos = Object.keys(L);
  a.innerHTML = cabecera("Briefing · Destino Santiago", "Simulación escolar. Los precios, los personajes y los imprevistos son inventados.") +
    `<div class="reto"><b>Vuestro reto:</b> salís de Sevilla con ${D.PRESUPUESTO} € cada uno. Tenéis ${D.DIAS} días para llegar andando a Santiago. ¿Lo conseguiréis?</div>
    <h2>Cómo se juega</h2>
    <div class="g3">
      <div class="caja" style="margin:0"><i class="ti ti-map-2" style="font-size:32px"></i><br><b>1.</b> Superad 5 misiones en pareja.</div>
      <div class="caja" style="margin:0"><i class="ti ti-rosette" style="font-size:32px"></i><br><b>2.</b> Cada misión superada da un sello.</div>
      <div class="caja" style="margin:0"><i class="ti ti-user" style="font-size:32px"></i><br><b>3.</b> Al llegar, cada uno responde 3 preguntas solo.</div>
    </div>
    <div class="caja" id="login"></div>
    <h2>Vuestra credencial</h2>${credencial()}
    <h2><i class="ti ti-bulb"></i> Ejemplo resuelto (no cuenta para nota)</h2>
    <div class="caja" id="ejemplo"></div>`;
  pintaEjemplo($("#ejemplo"));
  const lg = $("#login");
  if (S) {
    lg.innerHTML = `<p style="margin:0"><b>Equipo:</b> ${S.miembros.map(esc).join(" · ")}<br><b>Grupo:</b> ${esc(S.grupo)} · <b>Camino:</b> ${esc(M().camino)} desde ${esc(M().inicio)} (modelo ${S.modelo})</p>
      <div class="fila"><button class="btn" data-ir="m1">Empezar misión 1 <i class="ti ti-arrow-right"></i></button><button class="btn sec" id="cambiar">No somos nosotros</button></div>`;
    enlazarIr(lg); $("#cambiar").onclick = () => { S = null; sesion = null; localStorage.removeItem("ds_sesion"); render(); };
    return;
  }
  lg.innerHTML = `<div class="g2">
      <div><label class="et">Grupo</label><select id="gr"><option value="">Selecciona</option>${grupos.map(g => `<option>${g}</option>`).join("")}</select></div>
      <div><label class="et">Tu nombre</label><select id="no" disabled><option value="">Selecciona primero el grupo</option></select></div>
    </div><div id="equipo" style="margin-top:12px"></div><p class="err" id="errLogin"></p>
    <div class="fila"><button class="btn" id="empezar">Empezar <i class="ti ti-arrow-right"></i></button></div>`;
  const gr = $("#gr"), no = $("#no");
  gr.onchange = () => { no.disabled = !gr.value; no.innerHTML = `<option value="">Selecciona</option>` + (L[gr.value] || []).map(n => `<option>${esc(n)}</option>`).join(""); $("#equipo").innerHTML = ""; };
  let fijado = null;
  no.onchange = async () => {
    $("#errLogin").textContent = ""; fijado = null;
    const eq = $("#equipo"); if (!no.value) { eq.innerHTML = ""; return; }
    const equipos = await store.hijos(`equipos/${slug(gr.value)}`);
    fijado = Object.values(equipos).find(e => (e.miembros || []).includes(no.value)) || null;
    if (fijado) {
      eq.innerHTML = `<div class="instr"><b>Tu equipo (lo ha hecho el profe):</b> ${fijado.miembros.map(esc).join(" · ")}<br><b>Vuestro camino:</b> ${esc(D.MODELOS[fijado.modelo].camino)} (modelo ${fijado.modelo})</div>`;
    } else {
      const otros = (L[gr.value] || []).filter(n => n !== no.value);
      eq.innerHTML = `<div class="g3">
        <div><label class="et">Tu pareja</label><select id="p2"><option value="">Selecciona</option>${otros.map(n => `<option>${esc(n)}</option>`).join("")}</select></div>
        <div><label class="et">3.º (solo si sois trío)</label><select id="p3"><option value="">Nadie</option>${otros.map(n => `<option>${esc(n)}</option>`).join("")}</select></div>
        <div><label class="et">Vuestra tarjeta</label><select id="mo">${Object.entries(D.MODELOS).map(([k, v]) => `<option value="${k}" ${v.activo ? "" : "disabled"}>${k} · ${esc(v.camino)}${v.activo ? "" : " (pronto)"}</option>`).join("")}</select></div></div>`;
    }
  };
  $("#empezar").onclick = async () => {
    const e = $("#errLogin");
    if (!gr.value || !no.value) { e.textContent = "Elige tu grupo y tu nombre."; return; }
    let miembros, modelo;
    if (fijado) { miembros = fijado.miembros; modelo = fijado.modelo; }
    else {
      const p2 = $("#p2").value, p3 = $("#p3").value;
      if (!p2) { e.textContent = "Elige a tu pareja."; return; }
      if (p3 && p3 === p2) { e.textContent = "La tercera persona no puede ser tu pareja otra vez."; return; }
      miembros = [no.value, p2].concat(p3 ? [p3] : []); modelo = $("#mo").value;
    }
    if (!D.MODELOS[modelo] || !D.MODELOS[modelo].activo) { e.textContent = "Ese camino todavía no está disponible. Avisa al profe."; return; }
    const ruta = `pasaportes/${slug(gr.value)}/${equipoId(miembros)}`;
    S = (await store.get(ruta)) || nuevoPasaporte(gr.value, miembros, modelo);
    sesion = { grupo: gr.value, nombre: no.value, ruta }; localStorage.setItem("ds_sesion", JSON.stringify(sesion));
    await guardar(true); tab = "m1"; render(); scrollTo(0, 0);
  };
}
function pintaEjemplo(c) {
  const E = D.EJEMPLO;
  c.innerHTML = `<p style="margin-top:0"><b>${E.pregunta}</b></p><div class="pista">${E.pista}</div>
    <div class="g3">${mezcla(3, "ejemplo").map(i => `<button class="op" data-e="${i}"><b>${E.opciones[i]}</b></button>`).join("")}</div><div id="ejr"></div>`;
  c.querySelectorAll("[data-e]").forEach(b => b.onclick = () => {
    c.querySelectorAll("[data-e]").forEach(x => x.classList.remove("sel")); b.classList.add("sel");
    const ok = +b.dataset.e === E.ok;
    $("#ejr").innerHTML = fb(ok, (ok ? "¡Bien! " : "Esa no. Lee otra vez la pista. ") + (ok ? E.explica : ""));
  });
}

/* ----- 1 · Ruta ----- */
function mapaSVG(m, orden) {
  const ps = m.paradas, lat0 = ps.reduce((s, p) => s + p.lat, 0) / ps.length, k = Math.cos(lat0 * Math.PI / 180);
  const xs = ps.map(p => p.lon * k), ys = ps.map(p => p.lat);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const esc_ = Math.min(520 / Math.max(maxX - minX, 1e-6), 320 / Math.max(maxY - minY, 1e-6));
  const W = 660, H = Math.max(200, Math.round((maxY - minY) * esc_) + 90);
  const offX = (W - (maxX - minX) * esc_) / 2;
  const P = ps.map((p, i) => ({ ...p, x: offX + (xs[i] - minX) * esc_, y: H - 45 - (ys[i] - minY) * esc_ }));
  const vertical = (maxY - minY) * esc_ > (maxX - minX) * esc_;
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-height:440px;border:2px solid var(--linea);background:#f3f8f1" role="img" aria-label="Mapa esquemático del tramo">
    <g transform="translate(626,16)"><polygon points="0,0 -7,18 7,18" fill="#111"/><text x="0" y="34" text-anchor="middle" font-size="14" font-weight="700">N</text></g>
    <polyline fill="none" stroke="#C8102E" stroke-width="5" stroke-dasharray="10 7" points="${P.map(p => p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ")}"/>
    ${P.map((p, i) => {
      const s = p.fija ? p.n : (orden[i - 1] || "");
      const lx = vertical ? p.x + 22 : Math.min(Math.max(p.x, 60), 600), ly = vertical ? p.y + 5 : p.y + (i % 2 ? -22 : 34), anc = vertical ? "start" : "middle";
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="14" fill="${p.fija ? "#C8102E" : "#fff"}" stroke="#111" stroke-width="2"/>
      <text x="${p.x.toFixed(1)}" y="${(p.y + 5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="${p.fija ? "#fff" : "#111"}">${p.fija ? "★" : i}</text>
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anc}" font-size="14" font-weight="700" fill="#111">${esc(s)}</text>`;
    }).join("")}
  </svg>`;
}
function pM1(a) {
  const m = M(), st = S.m1, libres = m.paradas.filter(p => !p.fija);
  const cienOps = ["Porque así se andan al menos los últimos 100 km y se consigue la Compostela", "Porque es la ciudad más grande de Galicia", m.falsoInicio];
  a.innerHTML = cabecera("Misión 1 · Encuentra el camino", `${m.camino}: vuestro tramo empieza en ${m.inicio} y termina en Santiago.`) +
    `<div class="instr">Pulsad las paradas en orden, de ${m.inicio} a Santiago. Se colocarán en el mapa (puntos 1 a 5).</div>
    
    ${mapaSVG(m, st.orden)}
    <div style="margin:10px 0">${libres.map(p => p.n).sort((x, y) => x.localeCompare(y)).map(n => `<span class="chip ${st.orden.includes(n) ? "usado" : ""}" data-p="${esc(n)}">${esc(n)}</span>`).join("")}</div>
    <div class="fila" style="margin-top:0"><button class="btn sec" id="deshacer"><i class="ti ti-arrow-back-up"></i> Quitar la última</button></div>
    <h2>¿Es el Camino entero?</h2>
    <div class="g2"><div><img class="foto" style="aspect-ratio:auto;object-fit:contain;max-height:360px" src="${m.mapaCompleto.src}" alt="Mapa de los caminos" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'pista',textContent:'(No se ha podido cargar el mapa)'}))"><p class="credito">${m.mapaCompleto.credito}</p></div>
    <div><div class="pista"><b>Tarjeta:</b> ${m.completo}</div>
    <label class="et">¿Cuántos km tiene vuestro tramo?</label>
    ${mezcla(3, "km" + S.modelo).map(i => `<button class="op ${st.km === i ? "sel" : ""}" data-km="${i}" style="margin-bottom:6px">${m.kmOpciones[i]}</button>`).join("")}
    </div></div>
    <label class="et" style="margin-top:14px">¿Por qué mucha gente empieza en ${m.inicio}?</label>
    <div class="pista"><b>Tarjeta · La Compostela:</b> es el documento que da la Oficina del Peregrino. Para conseguirla hay que andar al menos los últimos 100 km y llevar la credencial sellada.</div>
    <div class="g3">${mezcla(3, "cien" + S.modelo).map(i => `<button class="op ${st.cien === i ? "sel" : ""}" data-c="${i}">${cienOps[i]}</button>`).join("")}</div>
    <div id="res1">${st.ok ? fb(true, "¡Sello de la Ruta conseguido!") : ""}</div><p class="err" id="err1"></p>
    <div class="fila"><button class="btn" id="comp1"><i class="ti ti-check"></i> Comprobar</button>${siguiente("m1")}<span id="guardado" class="guardado"></span></div>`;
  enlazarIr(a);
  a.querySelectorAll("[data-p]").forEach(c => c.onclick = () => { if (st.orden.includes(c.dataset.p) || st.orden.length >= libres.length) return; st.orden.push(c.dataset.p); guardar(); pM1(a); });
  $("#deshacer").onclick = () => { st.orden.pop(); guardar(); pM1(a); };
  a.querySelectorAll("[data-km]").forEach(b => b.onclick = () => { st.km = +b.dataset.km; guardar(); pM1(a); });
  a.querySelectorAll("[data-c]").forEach(b => b.onclick = () => { st.cien = +b.dataset.c; guardar(); pM1(a); });
  $("#comp1").onclick = () => {
    if (st.orden.length < libres.length || st.km === null || st.cien === null) { $("#err1").textContent = "Completad el mapa y contestad las dos preguntas."; return; }
    st.int++; const e = evalua(S).m1; st.ok = e.orden && e.km && e.cien;
    const f = []; if (!e.orden) f.push("El orden de las paradas no es correcto. Mirad la flecha del norte y dónde está Santiago."); if (!e.km) f.push("Revisad los km: es solo vuestro tramo, no el Camino entero."); if (!e.cien) f.push("Revisad por qué se empieza en " + m.inicio + ": leed la tarjeta de la Compostela.");
    guardar(true); pintaCab();
    $("#res1").innerHTML = st.ok ? fb(true, `¡Sello de la Ruta conseguido! Vuestro tramo: ${libres.map(p => p.n + " (km " + p.km + ")").join(" → ")}.`) : fb(false, f.join("<br>"));
  };
}

/* ----- 2 · Mochila ----- */
function pM2(a) {
  const st = S.m2;
  a.innerHTML = cabecera("Misión 2 · Prepara la mochila", "Solo cabe lo importante: cada kilo pesa 115 km.") +
    `<div class="instr">Elegid <b>5 objetos</b> de estos 8. Después comparad vuestra mochila con la de un peregrino de la Edad Media.</div>
    
    <div class="g4">${D.MOCHILA.map(o => `<button class="op ${st.sel.includes(o.id) ? "sel" : ""}" data-o="${o.id}" style="text-align:center"><i class="ti ${o.i}"></i><b>${o.n}</b></button>`).join("")}</div>
    <p class="mini">Elegidos: ${st.sel.length}/5</p>
    <h2>Hoy y en la Edad Media</h2>
    <div class="pista"><b>Tarjeta:</b> el peregrino medieval llevaba un <b>bordón</b> (bastón largo de madera), un <b>zurrón</b> (bolsa de cuero o tela), una <b>calabaza</b> seca para el agua y un <b>sombrero de ala ancha</b> contra el sol y la lluvia.</div>
    <table class="tabla"><tr><th>Hoy llevamos…</th><th>Un peregrino medieval llevaba…</th></tr>
    ${D.PARES.map((p, i) => `<tr><td>${p.hoy}</td><td><select data-par="${i}"><option value="">Elige</option>${D.PARES_OPC.map(o => `<option ${st.pares[i] === o ? "selected" : ""}>${o}</option>`).join("")}</select></td></tr>`).join("")}</table>
    <label class="et" style="margin-top:14px">Completad la frase</label>
    <input type="text" id="fr2" value="${esc(st.frase)}" placeholder="En la Edad Media no había … por eso llevaban …">
    <div id="res2">${st.ok ? fb(true, "¡Sello de la Mochila conseguido!") : ""}</div><p class="err" id="err2"></p>
    <div class="fila"><button class="btn" id="comp2"><i class="ti ti-check"></i> Comprobar</button>${siguiente("m2")}<span id="guardado" class="guardado"></span></div>`;
  enlazarIr(a);
  a.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { const id = b.dataset.o, i = st.sel.indexOf(id); if (i >= 0) st.sel.splice(i, 1); else if (st.sel.length < 5) st.sel.push(id); else { $("#err2").textContent = "Ya tenéis 5. Quitad uno antes de añadir otro."; return; } guardar(); pM2(a); });
  a.querySelectorAll("[data-par]").forEach(s => s.onchange = () => { st.pares[s.dataset.par] = s.value; guardar(); });
  $("#fr2").oninput = e => { st.frase = e.target.value; $("#err2").textContent = ""; guardar(); };
  $("#comp2").onclick = () => {
    if (st.sel.length !== 5) { $("#err2").textContent = "Elegid exactamente 5 objetos."; return; }
    if (D.PARES.some((p, i) => !st.pares[i])) { $("#err2").textContent = "Completad las 4 filas de la tabla."; return; }
    if ((st.frase || "").trim().length < 15 || /…/.test(st.frase)) { $("#err2").textContent = "Completad la frase con vuestras palabras (sin dejar «…»)."; return; }
    st.int++; const e = evalua(S).m2; st.ok = e.mochila && e.paresOk === 4 && e.frase;
    const f = [];
    if (!e.mochila) { const mal = st.sel.map(id => D.MOCHILA.find(o => o.id === id)).filter(o => !o.ok); f.push(mal.length ? "Sobra algo: " + mal.map(o => `${o.n} (${o.why.toLowerCase()})`).join("; ") : "Revisad la mochila."); }
    if (e.paresOk < 4) f.push(`En la tabla tenéis ${e.paresOk} de 4 bien. Cuidado: el termo y la linterna son inventos modernos.`);
    guardar(true); pintaCab();
    $("#res2").innerHTML = st.ok ? fb(true, "¡Sello de la Mochila conseguido!") : fb(false, f.join("<br>"));
  };
}

/* ----- 3 · Dinero ----- */
function pM3(a) {
  const m = M(), st = S.m3, k = calc3(S, m);
  const opc = (lista, campo, tit, ic) => `<label class="et"><i class="ti ${ic}"></i> ${tit}</label><div class="g3" style="margin-bottom:14px">${lista.map(o => `<button class="op ${st[campo] === o.id ? "sel" : ""}" data-${campo}="${o.id}"><i class="ti ${o.i}"></i><b>${o.n}</b><small>${o.p} € · ${o.d}</small></button>`).join("")}</div>`;
  a.innerHTML = cabecera("Misión 3 · Administra tu dinero", `Tenéis ${D.PRESUPUESTO} € cada uno. Precios inventados.`) +
    `<div class="instr">Elegid viaje, alojamiento y comida. Haced las cuentas para <b>una persona</b>. Tenéis que guardar al menos <b>${D.RESERVA} €</b> para imprevistos.</div>
    <div class="g3" style="margin-bottom:14px"><div class="caja" style="margin:0"><span class="mini">Presupuesto</span><br><b style="font-size:24px">${D.PRESUPUESTO} €</b></div><div class="caja" style="margin:0"><span class="mini">Días de Camino</span><br><b style="font-size:24px">${D.DIAS}</b></div><div class="caja" style="margin:0;border-color:#b88a00"><span class="mini">Reserva mínima</span><br><b style="font-size:24px">${D.RESERVA} €</b></div></div>
    ${opc(m.transporte, "tra", `Viaje ${m.viaje} (ida y vuelta)`, "ti-bus")}
    ${opc(D.ALOJ, "aloj", "Dónde dormir (precio por noche)", "ti-bed")}
    ${opc(D.COM, "com", "Cómo comer (precio por día)", "ti-tools-kitchen-2")}
    
    <table class="tabla">
      <tr><th>Cuenta</th><th>Cómo se hace</th><th style="width:130px">€</th></tr>
      <tr><td>Gasto diario</td><td>dormir + comer</td><td><input type="number" id="c_d" value="${esc(st.d)}"></td></tr>
      <tr><td>Gasto del Camino</td><td>gasto diario × ${D.DIAS}</td><td><input type="number" id="c_c" value="${esc(st.c)}"></td></tr>
      <tr><td>Gasto total</td><td>gasto del Camino + viaje</td><td><input type="number" id="c_t" value="${esc(st.t)}"></td></tr>
      <tr><td>Dinero restante</td><td>${D.PRESUPUESTO} − gasto total</td><td><input type="number" id="c_r" value="${esc(st.r)}"></td></tr>
    </table>
    <label class="et" style="margin-top:14px">Justificad vuestra decisión</label>
    <input type="text" id="j3" value="${esc(st.just)}" placeholder="Elegimos… porque…">
    <div id="res3">${st.ok ? fb(true, `¡Sello del Dinero conseguido! Os quedan ${k ? k.r : "?"} €.`) : ""}</div><p class="err" id="err3"></p>
    <div class="fila"><button class="btn" id="comp3"><i class="ti ti-check"></i> Comprobar</button>${siguiente("m3")}<span id="guardado" class="guardado"></span></div>
    <div class="pista" style="margin-top:18px"><b>¿Y en la Edad Media?</b> El peregrino no pagaba albergue: se alojaba en hospitales de peregrinos y monasterios que lo acogían por caridad, normalmente gratis y durante pocas noches.</div>`;
  enlazarIr(a);
  ["tra", "aloj", "com"].forEach(c => a.querySelectorAll(`[data-${c}]`).forEach(b => b.onclick = () => { st[c] = b.dataset[c]; st.ok = false; guardar(); pM3(a); }));
  [["c_d", "d"], ["c_c", "c"], ["c_t", "t"], ["c_r", "r"]].forEach(([id, f]) => { const el = $("#" + id); el.oninput = () => { st[f] = el.value; $("#err3").textContent = ""; guardar(); }; });
  $("#j3").oninput = e => { st.just = e.target.value; $("#err3").textContent = ""; guardar(); };
  $("#comp3").onclick = () => {
    if (!st.tra || !st.aloj || !st.com) { $("#err3").textContent = "Elegid viaje, alojamiento y comida."; return; }
    if (["d", "c", "t", "r"].some(f => st[f] === "" || st[f] == null)) { $("#err3").textContent = "Rellenad las cuatro casillas de la tabla."; return; }
    if (!conPorque(st.just) || /…/.test(st.just)) { $("#err3").textContent = "Escribid una frase completa con «porque» (sin dejar «…»)."; return; }
    st.int++; const k = calc3(S, m), f = [];
    if (num(st.d) !== k.d) f.push("Gasto diario: sumad dormir + comer.");
    if (num(st.c) !== k.c) f.push(`Gasto del Camino: multiplicad el gasto diario por ${D.DIAS}.`);
    if (num(st.t) !== k.t) f.push("Gasto total: sumad el viaje al gasto del Camino.");
    if (num(st.r) !== k.r) f.push(`Dinero restante: restad el gasto total a ${D.PRESUPUESTO}.`);
    if (f.length) { st.ok = false; guardar(true); $("#res3").innerHTML = fb(false, f.join("<br>")); return; }
    if (k.r < D.RESERVA) { st.ok = false; guardar(true); $("#res3").innerHTML = fb(false, `Las cuentas están bien, pero solo os quedan ${k.r} €. No llegáis a los ${D.RESERVA} € de reserva. Cambiad alguna elección.`); return; }
    st.ok = true; guardar(true); pintaCab();
    $("#res3").innerHTML = fb(true, `¡Sello del Dinero conseguido! Os quedan ${k.r} €: ${D.RESERVA} € de reserva y ${k.r - D.RESERVA} € libres.`);
  };
}

/* ----- 4 · Historia ----- */
function pM4(a) {
  const m = M(), st = S.m4;
  a.innerHTML = cabecera("Misión 4 · El Camino tiene historia", "Tres lugares reales de vuestro tramo.") +
    `<div class="instr">Mirad cada foto y elegid <b>para qué servía</b> ese lugar. Después contestad sobre la acogida y los intercambios.</div>
    <div class="g3">${m.lugares.map(l => `<div><img class="foto" src="${l.img}" alt="${esc(l.n)}, ${esc(l.lugar)}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'foto',textContent:''}))">
      <p class="credito">${l.credito}</p><b>${l.n}</b><br><span class="mini">${l.lugar} · ${l.fecha}</span>
      <details style="margin:6px 0"><summary class="mini">Ver pista</summary><div class="pista">${l.pista}</div></details>
      <select data-f="${l.id}"><option value="">¿Para qué servía?</option>${D.FUNCIONES.map(f => `<option value="${f.id}" ${st.f[l.id] === f.id ? "selected" : ""}>${f.n}</option>`).join("")}</select></div>`).join("")}</div>
    <h2>La acogida al peregrino</h2>
    <div class="pista"><b>Tarjeta:</b> en la Edad Media, iglesias, monasterios, reyes y cofradías mantenían hospitales para acoger a los peregrinos. Allí les daban cama, comida y cuidados, casi siempre gratis y durante pocas noches.</div>
    <label class="et">¿Quién pagaba normalmente la estancia del peregrino en un hospital?</label>
    <div class="g3">${(o => mezcla(3, "acog").map(i => `<button class="op ${st.acog === i ? "sel" : ""}" data-ac="${i}">${o[i]}</button>`).join(""))(["Nadie: era caridad de la Iglesia, los reyes o las cofradías", "El peregrino, como en un hotel", "Los peregrinos no podían dormir en ningún sitio"])}</div>
    <h2>Un camino de intercambios</h2>
    <div class="pista"><b>Tarjeta:</b> por el Camino pasaban peregrinos de Francia, Alemania, Italia, Inglaterra… Hablaban lenguas distintas, contaban noticias, compraban y vendían, y con ellos viajaron ideas y estilos artísticos como el románico.</div>
    <label class="et">¿Qué viajaba con los peregrinos?</label>
    <div class="g3">${(o => mezcla(3, "inter").map(i => `<button class="op ${st.inter === i ? "sel" : ""}" data-in="${i}">${o[i]}</button>`).join(""))(["Ideas, noticias, lenguas, productos y estilos artísticos", "Solo dinero", "Nada: cada uno iba solo y sin hablar"])}</div>
    <label class="et" style="margin-top:14px">Completad la frase</label>
    <input type="text" id="fr4" value="${esc(st.frase)}" placeholder="En un hospital de peregrinos te podías encontrar con gente de … y por eso …">
    <div id="res4">${st.ok ? fb(true, "¡Sello de la Historia conseguido!") : ""}</div><p class="err" id="err4"></p>
    <div class="fila"><button class="btn" id="comp4"><i class="ti ti-check"></i> Comprobar</button>${siguiente("m4")}<span id="guardado" class="guardado"></span></div>`;
  enlazarIr(a);
  a.querySelectorAll("[data-f]").forEach(s => s.onchange = () => { st.f[s.dataset.f] = s.value; guardar(); });
  a.querySelectorAll("[data-ac]").forEach(b => b.onclick = () => { st.acog = +b.dataset.ac; guardar(); pM4(a); });
  a.querySelectorAll("[data-in]").forEach(b => b.onclick = () => { st.inter = +b.dataset.in; guardar(); pM4(a); });
  $("#fr4").oninput = e => { st.frase = e.target.value; $("#err4").textContent = ""; guardar(); };
  $("#comp4").onclick = () => {
    if (m.lugares.some(l => !st.f[l.id]) || st.acog === null || st.inter === null) { $("#err4").textContent = "Elegid la función de los 3 lugares y contestad las 2 preguntas."; return; }
    if ((st.frase || "").trim().length < 15 || /…/.test(st.frase)) { $("#err4").textContent = "Completad la frase con vuestras palabras (sin dejar «…»)."; return; }
    st.int++; const e = evalua(S).m4; st.ok = e.funcOk === 3 && e.acog && e.inter && e.frase;
    const f = []; if (e.funcOk < 3) f.push(`Funciones: ${e.funcOk} de 3 bien. Abrid las pistas de las fotos.`); if (!e.acog) f.push("Acogida: releed la tarjeta."); if (!e.inter) f.push("Intercambios: releed la tarjeta.");
    guardar(true); pintaCab();
    $("#res4").innerHTML = st.ok ? fb(true, "¡Sello de la Historia conseguido!") : fb(false, f.join("<br>"));
  };
}

/* ----- 5 · Imprevisto ----- */
function pM5(a) {
  const m = M(), st = S.m5, im = m.imprevisto, k = calc3(S, m);
  if (!S.m3.ok) { a.innerHTML = cabecera("Misión 5 · Resuelve un imprevisto", "") + fb(false, "Primero terminad la Misión 3 (Dinero): necesitáis saber cuánto dinero os queda.") + `<div class="fila"><button class="btn" data-ir="m3">Ir a la Misión 3</button></div>`; enlazarIr(a); return; }
  const tipos = [["anade", "Se añade a lo que ya teníamos previsto"], ["sustituye", "Sustituye a un gasto que ya teníamos"], ["ambas", "Una parte se añade y otra sustituye"]];
  a.innerHTML = cabecera("Misión 5 · Resuelve un imprevisto", `Tarjeta ${S.modelo} · situación inventada.`) +
    `<div class="reto"><b><i class="ti ti-alert-triangle"></i> ${im.titulo}</b><br>${im.texto}</div>
    <div class="instr">Elegid una solución, actualizad vuestro dinero y explicad la decisión. Ahora os quedan <b>${k.r} €</b>.</div>
    <div class="g3">${im.opciones.map(o => `<button class="op ${st.op === o.id ? "sel" : ""}" data-op="${o.id}"><b>${o.n}</b><small>${o.det}</small></button>`).join("")}</div>
    
    <table class="tabla" style="margin-top:14px">
      <tr><td>El gasto nuevo…</td><td><select id="t5"><option value="">Elige</option>${tipos.map(([v, t]) => `<option value="${v}" ${st.tipo === v ? "selected" : ""}>${t}</option>`).join("")}</select></td></tr>
      <tr><td>Nuevo dinero restante (€)</td><td><input type="number" id="r5" value="${esc(st.rest)}"></td></tr>
      <tr><td>Km que andaréis en total</td><td><input type="number" id="k5" value="${esc(st.km)}"></td></tr>
      <tr><td>¿Conseguiréis la Compostela?</td><td><select id="c5"><option value="">Elige</option><option value="0" ${st.compo === 0 ? "selected" : ""}>Sí</option><option value="1" ${st.compo === 1 ? "selected" : ""}>No</option></select></td></tr>
    </table>
    <label class="et" style="margin-top:14px">Justificad</label>
    <input type="text" id="j5" value="${esc(st.just)}" placeholder="Elegimos… porque…">
    <div id="res5">${st.ok ? fb(true, "¡Sello del Imprevisto conseguido!") : ""}</div><p class="err" id="err5"></p>
    <div class="fila"><button class="btn" id="comp5"><i class="ti ti-check"></i> Comprobar</button>${siguiente("m5")}<span id="guardado" class="guardado"></span></div>`;
  enlazarIr(a);
  a.querySelectorAll("[data-op]").forEach(b => b.onclick = () => { st.op = b.dataset.op; st.ok = false; guardar(); pM5(a); });
  $("#t5").onchange = e => { st.tipo = e.target.value; guardar(); };
  $("#r5").oninput = e => { st.rest = e.target.value; $("#err5").textContent = ""; guardar(); };
  $("#k5").oninput = e => { st.km = e.target.value; $("#err5").textContent = ""; guardar(); };
  $("#c5").onchange = e => { st.compo = e.target.value === "" ? null : +e.target.value; guardar(); };
  $("#j5").oninput = e => { st.just = e.target.value; $("#err5").textContent = ""; guardar(); };
  $("#comp5").onclick = () => {
    if (!st.op) { $("#err5").textContent = "Elegid una solución."; return; }
    if (!st.tipo || st.rest === "" || st.km === "" || st.compo === null) { $("#err5").textContent = "Completad las cuatro filas de la tabla."; return; }
    if (!conPorque(st.just) || /…/.test(st.just)) { $("#err5").textContent = "Escribid una frase completa con «porque» (sin dejar «…»)."; return; }
    st.int++; const x = extra5(S, m), e = evalua(S).m5, f = [];
    if (!e.tipo) f.push("Releed la solución: ¿pagáis algo nuevo, cambiáis un gasto por otro o las dos cosas?");
    if (!e.rest) f.push(`Dinero: a lo que os quedaba (${k.r} €) restadle lo que cuesta la solución.`);
    if (!e.km) f.push(`Km: vuestro tramo tiene ${m.totalKm} km. ¿Perdéis alguno con esta solución?`);
    if (!e.compo) f.push("Compostela: recordad que hay que andar al menos 100 km.");
    if (!f.length && !e.alcanza) f.push("No os llega el dinero con esta solución. Elegid otra.");
    st.ok = !f.length; guardar(true); pintaCab();
    $("#res5").innerHTML = st.ok ? fb(true, `¡Sello del Imprevisto conseguido! Os quedan ${x.rest} € y andaréis ${x.km} km.${x.compo ? "" : " Llegaréis a Santiago, pero sin Compostela."}`) : fb(false, f.join("<br>"));
  };
}

/* ----- Llegada (individual) ----- */
function pFin(a) {
  const C = D.CIERRE;
  a.innerHTML = cabecera("Llegada a Santiago", "Ahora cada uno responde solo. No mires las respuestas de tu compañero.") +
    `<h2>Vuestra credencial</h2>${credencial()}
    ${sellos() < 5 ? fb(false, `Lleváis ${sellos()} de 5 sellos. Podéis responder igualmente, pero intentad conseguirlos todos.`) : fb(true, "¡Credencial completa! Habéis llegado a Santiago.")}
    <div class="instr">Por turnos: cada alumno pulsa su nombre, responde y entrega. Después ya no se puede cambiar.</div>
    <div class="fila" style="margin-top:0">${S.miembros.map(n => `<button class="btn ${S.ind[n] && S.ind[n].entregado ? "sec" : ""}" data-al="${esc(n)}">${esc(corto(n))}${S.ind[n] && S.ind[n].entregado ? " ✓" : ""}</button>`).join("")}</div>
    <div id="indiv"></div>`;
  a.querySelectorAll("[data-al]").forEach(b => b.onclick = () => pintaInd($("#indiv"), b.dataset.al));
}
function pintaInd(c, n) {
  const C = D.CIERRE, r = S.ind[n] || (S.ind[n] = {}), hecho = !!r.entregado;
  const ops = (q, campo) => (campo === "q3" ? [...q.o.keys()] : mezcla(q.o.length, campo)).map(i => `<button class="op ${r[campo] === i ? "sel" : ""}" data-${campo}="${i}" ${hecho ? "disabled" : ""}>${q.o[i]}</button>`).join("");
  c.innerHTML = `<div class="caja"><h2 style="margin-top:0">${esc(n)}</h2>
    <label class="et">1. ${C.q1.t}</label><div class="g3">${ops(C.q1, "q1")}</div>
    <label class="et" style="margin-top:14px">2. ${C.q2.t}</label><div class="g3">${ops(C.q2, "q2")}</div>
    <label class="et" style="margin-top:8px">${C.q2.frase}</label><input type="text" id="q2f" value="${esc(r.q2f || "")}" ${hecho ? "disabled" : ""}>
    <label class="et" style="margin-top:14px">3. ${C.q3.t}</label><div class="g4">${ops(C.q3, "q3")}</div>
    <label class="et" style="margin-top:8px">${C.q3.frase}</label><input type="text" id="q3f" value="${esc(r.q3f || "")}" ${hecho ? "disabled" : ""}>
    <p class="err" id="errI"></p>
    ${hecho ? `<div id="corrI">${correccionInd(r)}</div>` : `<div class="fila"><button class="btn" id="entregar"><i class="ti ti-send"></i> Entregar mis respuestas</button></div>`}</div>`;
  if (hecho) return;
  ["q1", "q2", "q3"].forEach(q => c.querySelectorAll(`[data-${q}]`).forEach(b => b.onclick = () => { r[q] = +b.dataset[q]; c.querySelectorAll(`[data-${q}]`).forEach(x => x.classList.remove("sel")); b.classList.add("sel"); guardar(); }));
  $("#q2f").oninput = e => { r.q2f = e.target.value; guardar(); };
  $("#q3f").oninput = e => { r.q3f = e.target.value; guardar(); };
  $("#entregar").onclick = async () => {
    if (r.q1 == null || r.q2 == null || r.q3 == null) { $("#errI").textContent = "Contesta las tres preguntas."; return; }
    if ((r.q2f || "").trim().length < 10) { $("#errI").textContent = "Escribe un ejemplo en la pregunta 2."; return; }
    if ((r.q3f || "").trim().length < 15 || /…/.test(r.q3f)) { $("#errI").textContent = "Explica en la pregunta 3 por qué defiendes esa decisión."; return; }
    const b = $("#entregar");
    if (!b.dataset.seguro) { b.dataset.seguro = "1"; b.innerHTML = "¿Seguro? Pulsa otra vez para entregar"; $("#errI").textContent = "Después de entregar no podrás cambiar tus respuestas."; return; }
    r.entregado = Date.now(); await guardar(true); pFin($("#app")); pintaInd($("#indiv"), n);
  };
}
function correccionInd(r) {
  const C = D.CIERRE;
  return [fb(r.q1 === C.q1.ok, `Pregunta 1: ${r.q1 === C.q1.ok ? "correcta" : "la respuesta era «" + C.q1.o[C.q1.ok] + "»"}.`),
  fb(r.q2 === C.q2.ok, `Pregunta 2: ${r.q2 === C.q2.ok ? "correcta" : "la respuesta era «" + C.q2.o[C.q2.ok] + "»"}. Tu ejemplo lo corrige el profe.`),
  `<div class="fb ok" style="background:#fff;color:#111;border-color:#111">Pregunta 3: la corrige el profe.</div>`].join("");
}

/* ---------- Panel del profesor ---------- */
let pGrupo = Object.keys(L)[1] || Object.keys(L)[0], pVista = "seg";
async function pintaPanel(a) {
  a.innerHTML = `<h1>Panel del profesor</h1><p class="sub">Modo: ${store.modo === "demo" ? "demostración (datos solo en este navegador)" : "Firebase"}</p>
    <div class="fila" style="margin-top:0"><select id="pg" style="width:auto">${Object.keys(L).map(g => `<option ${g === pGrupo ? "selected" : ""}>${g}</option>`).join("")}</select>
    <button class="tab ${pVista === "seg" ? "on" : ""}" data-v="seg">Seguimiento y notas</button><button class="tab ${pVista === "eq" ? "on" : ""}" data-v="eq">Parejas y caminos</button></div><div id="pv"><p>Cargando…</p></div>`;
  $("#pg").onchange = e => { pGrupo = e.target.value; pintaPanel(a); };
  a.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { pVista = b.dataset.v; pintaPanel(a); });
  if (pVista === "seg") return panelSeg($("#pv")); return panelEq($("#pv"));
}
async function panelSeg(c) {
  const ps = Object.values(await store.hijos(`pasaportes/${slug(pGrupo)}`));
  if (!ps.length) { c.innerHTML = `<p>Todavía no hay pasaportes en ${pGrupo}.</p>`; return; }
  const filas = [];
  ps.sort((x, y) => x.miembros[0].localeCompare(y.miembros[0])).forEach(p => p.miembros.forEach((n, i) => { const pr = propuesta(p, n); filas.push({ p, n, pr, primero: i === 0 }); }));
  c.innerHTML = `<p class="mini">Notas propuestas con valores 10 · 7 · 5 · 2 por criterio (C1 comprensión histórica · C2 orientación espacial · C3 decisiones justificadas) y media. Los textos los valoras tú.</p>
    <table class="tabla panelt"><tr><th>Alumno/a</th><th>Equipo · camino</th><th>Sellos</th><th>Intentos M1–M5</th><th>Cierre</th><th>C1</th><th>C2</th><th>C3</th><th>Media</th></tr>
    ${filas.map(f => `<tr><td>${esc(f.n)}</td><td>${f.primero ? esc(f.p.miembros.map(corto).join(" · ")) + " · " + f.p.modelo : ""}</td><td>${["m1", "m2", "m3", "m4", "m5"].filter(m => f.p[m].ok).length}/5</td><td>${["m1", "m2", "m3", "m4", "m5"].map(m => f.p[m].int).join("·")}</td><td>${(f.p.ind || {})[f.n] && f.p.ind[f.n].entregado ? "✓" : "—"}</td><td>${f.pr.c1}</td><td>${f.pr.c2}</td><td>${f.pr.c3}</td><td class="nota">${f.pr.media}</td></tr>`).join("")}</table>
    <div class="fila"><button class="btn sec" id="csv"><i class="ti ti-table-export"></i> Descargar CSV</button></div>
    <h2>Textos de cada equipo</h2>${ps.map(p => `<details class="caja"><summary>${esc(p.miembros.join(" · "))} · ${p.modelo}</summary>
      <p><b>M2 frase:</b> ${esc(p.m2.frase)}</p><p><b>M3:</b> ${esc([p.m3.tra, p.m3.aloj, p.m3.com].join(" + "))} — ${esc(p.m3.just)}</p>
      <p><b>M4 frase:</b> ${esc(p.m4.frase)}</p><p><b>M5:</b> opción ${esc(p.m5.op)} — ${esc(p.m5.just)}</p>
      ${p.miembros.map(n => { const r = (p.ind || {})[n] || {}; return `<p><b>${esc(corto(n))}:</b> Q2: ${esc(r.q2f || "—")} · Q3 (${r.q3 != null ? esc(D.CIERRE.q3.o[r.q3]) : "—"}): ${esc(r.q3f || "—")}</p>`; }).join("")}</details>`).join("")}`;
  $("#csv").onclick = () => {
    const rows = [["Grupo", "Alumno", "Equipo", "Modelo", "Sellos", "C1", "C2", "C3", "Media"]].concat(filas.map(f => [pGrupo, f.n, f.p.miembros.join(" / "), f.p.modelo, ["m1", "m2", "m3", "m4", "m5"].filter(m => f.p[m].ok).length, f.pr.c1, f.pr.c2, f.pr.c3, f.pr.media]));
    const blob = new Blob(["﻿" + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(";")).join("\n")], { type: "text/csv" });
    const u = URL.createObjectURL(blob), l = document.createElement("a"); l.href = u; l.download = `destino-santiago-${slug(pGrupo)}.csv`; l.click();
  };
}
async function panelEq(c) {
  const eqs = await store.hijos(`equipos/${slug(pGrupo)}`), lista = L[pGrupo] || [];
  const asignados = new Set(Object.values(eqs).flatMap(e => e.miembros));
  const libres = lista.filter(n => !asignados.has(n));
  const modOpts = sel => Object.entries(D.MODELOS).map(([k, v]) => `<option value="${k}" ${k === sel ? "selected" : ""}>${k} · ${esc(v.camino)}${v.activo ? "" : " (pronto)"}</option>`).join("");
  c.innerHTML = `<div class="instr">Si haces aquí las parejas, el alumnado solo elige su nombre y le salen su pareja y su camino. Si no, las eligen ellos.</div>
    <h2>Parejas de ${pGrupo} (${Object.keys(eqs).length})</h2>
    <table class="tabla panelt"><tr><th>Equipo</th><th>Camino</th><th></th></tr>${Object.entries(eqs).map(([id, e]) => `<tr><td>${e.miembros.map(esc).join(" · ")}</td><td><select data-mod="${id}">${modOpts(e.modelo)}</select></td><td><button class="btn sec" data-del="${id}">Quitar</button></td></tr>`).join("") || `<tr><td colspan="3">Ninguna todavía.</td></tr>`}</table>
    <h2>Añadir una pareja a mano</h2>
    <div class="g4"><select id="e1"><option value="">Alumno/a 1</option>${libres.map(n => `<option>${esc(n)}</option>`).join("")}</select><select id="e2"><option value="">Alumno/a 2</option>${libres.map(n => `<option>${esc(n)}</option>`).join("")}</select><select id="e3"><option value="">3.º (trío)</option>${libres.map(n => `<option>${esc(n)}</option>`).join("")}</select><select id="em">${modOpts("A")}</select></div>
    <p class="err" id="errE"></p><div class="fila"><button class="btn" id="addE">Añadir</button></div>
    <h2>Proponer parejas por nivel</h2>
    <div class="pista">Pega una línea por alumno: <b>Apellidos, Nombre; nota</b>. Se empareja el de nota más alta con el de nota más baja, y así sucesivamente; si sois impares, sale un trío. <b>Las notas no se guardan</b>: solo se guardan las parejas.</div>
    <textarea id="notas" placeholder="Bejarano Izaguirre, Lucía; 8&#10;Bermejo Moreno, Guzmán; 5"></textarea>
    <p class="err" id="errN"></p><div class="fila"><button class="btn sec" id="prop">Ver propuesta</button></div><div id="propuesta"></div>`;
  c.querySelectorAll("[data-mod]").forEach(s => s.onchange = async () => { const e = eqs[s.dataset.mod]; e.modelo = s.value; await store.set(`equipos/${slug(pGrupo)}/${s.dataset.mod}`, e); });
  c.querySelectorAll("[data-del]").forEach(b => b.onclick = async () => { if (!b.dataset.seguro) { b.dataset.seguro = "1"; b.textContent = "¿Seguro?"; return; } await store.set(`equipos/${slug(pGrupo)}/${b.dataset.del}`, null); if (store.modo === "demo") localStorage.removeItem(`ds:equipos/${slug(pGrupo)}/${b.dataset.del}`); panelEq(c); });
  $("#addE").onclick = async () => {
    const m = [$("#e1").value, $("#e2").value, $("#e3").value].filter(Boolean);
    if (m.length < 2 || new Set(m).size !== m.length) { $("#errE").textContent = "Elige al menos dos alumnos distintos."; return; }
    await store.set(`equipos/${slug(pGrupo)}/${equipoId(m)}`, { miembros: m, modelo: $("#em").value }); panelEq(c);
  };
  $("#prop").onclick = () => {
    const filas = $("#notas").value.split("\n").map(l => l.trim()).filter(Boolean).map(l => { const i = l.lastIndexOf(";"); return { n: l.slice(0, i).trim(), v: parseFloat(l.slice(i + 1).replace(",", ".")) }; });
    const malos = filas.filter(f => !lista.includes(f.n) || isNaN(f.v));
    if (!filas.length || malos.length) { $("#errN").textContent = malos.length ? "No reconozco: " + malos.map(f => f.n || "(vacío)").join(", ") + ". Copia el nombre tal como sale en la lista." : "Pega al menos dos líneas."; return; }
    $("#errN").textContent = "";
    const ord = [...filas].sort((x, y) => y.v - x.v), eq = [];
    let i = 0, j = ord.length - 1; while (i < j) { eq.push([ord[i].n, ord[j].n]); i++; j--; }
    if (i === j) eq[eq.length - 1].push(ord[i].n);
    const mods = Object.keys(D.MODELOS).filter(k => D.MODELOS[k].activo);
    const prop = eq.map((m, k) => ({ miembros: m, modelo: mods[k % mods.length] }));
    $("#propuesta").innerHTML = `<table class="tabla panelt"><tr><th>Equipo propuesto</th><th>Camino</th></tr>${prop.map(p => `<tr><td>${p.miembros.map(esc).join(" · ")}</td><td>${p.modelo}</td></tr>`).join("")}</table><div class="fila"><button class="btn" id="guardarProp">Guardar estas parejas</button></div>`;
    $("#guardarProp").onclick = async () => { for (const p of prop) await store.set(`equipos/${slug(pGrupo)}/${equipoId(p.miembros)}`, p); $("#notas").value = ""; panelEq(c); };
  };
}

/* ---------- arranque ---------- */
(async function () {
  try { await store.init(); } catch (e) { store.modo = "demo"; }
  if (store.modo === "demo") { const b = $("#banner"); b.textContent = "Modo demostración: los datos se guardan solo en este navegador."; b.classList.remove("oculto"); }
  
  if (sesion && sesion.ruta) { S = await store.get(sesion.ruta); if (!S) { sesion = null; localStorage.removeItem("ds_sesion"); } }
  render();
})();
