// ============================================================
// app.js — Lógica principal: login, navegação, jogos, banca
// ============================================================

// --- DADOS MOCKADOS: 20 partidas ---
const JOGOS_MOCK = [
  // Brasileirão
  {id:1, liga:"Brasileirão Série A", liga_icon:"🇧🇷", casa:{nome:"Flamengo",bandeira:"🔴⚫"},fora:{nome:"Palmeiras",bandeira:"🟢"},hora:"16:00",odds:{casa:2.10,empate:3.20,fora:3.50}},
  {id:2, liga:"Brasileirão Série A", liga_icon:"🇧🇷", casa:{nome:"Corinthians",bandeira:"⚪⚫"},fora:{nome:"São Paulo",bandeira:"🔴⚪"},hora:"19:00",odds:{casa:2.40,empate:3.10,fora:2.90}},
  {id:3, liga:"Brasileirão Série A", liga_icon:"🇧🇷", casa:{nome:"Atletico-MG",bandeira:"⚫🔴"},fora:{nome:"Cruzeiro",bandeira:"🔵"},hora:"21:00",odds:{casa:1.90,empate:3.40,fora:4.00}},
  {id:4, liga:"Brasileirão Série A", liga_icon:"🇧🇷", casa:{nome:"Grêmio",bandeira:"🔵⚫⚪"},fora:{nome:"Internacional",bandeira:"🔴⚪"},hora:"18:30",odds:{casa:2.20,empate:3.15,fora:3.30}},
  {id:5, liga:"Brasileirão Série A", liga_icon:"🇧🇷", casa:{nome:"Fluminense",bandeira:"🔴⚪🟢"},fora:{nome:"Botafogo",bandeira:"⚫⚪"},hora:"20:00",odds:{casa:2.50,empate:3.00,fora:2.80}},
  // Copa do Brasil
  {id:6, liga:"Copa do Brasil", liga_icon:"🏆", casa:{nome:"Bahia",bandeira:"🔵🔴"},fora:{nome:"Fortaleza",bandeira:"🔴🔵⚪"},hora:"19:30",odds:{casa:2.30,empate:3.20,fora:3.00}},
  {id:7, liga:"Copa do Brasil", liga_icon:"🏆", casa:{nome:"Santos",bandeira:"⚪⚫"},fora:{nome:"Vasco",bandeira:"⚫⚪"},hora:"21:30",odds:{casa:2.10,empate:3.10,fora:3.40}},
  // Copa do Mundo 2026
  {id:8, liga:"Copa do Mundo 2026", liga_icon:"🌍", casa:{nome:"Brasil",bandeira:"🇧🇷"},fora:{nome:"Argentina",bandeira:"🇦🇷"},hora:"15:00",odds:{casa:2.60,empate:3.20,fora:2.70}},
  {id:9, liga:"Copa do Mundo 2026", liga_icon:"🌍", casa:{nome:"França",bandeira:"🇫🇷"},fora:{nome:"Espanha",bandeira:"🇪🇸"},hora:"18:00",odds:{casa:2.30,empate:3.30,fora:3.00}},
  {id:10, liga:"Copa do Mundo 2026", liga_icon:"🌍", casa:{nome:"Alemanha",bandeira:"🇩🇪"},fora:{nome:"Portugal",bandeira:"🇵🇹"},hora:"21:00",odds:{casa:2.10,empate:3.40,fora:3.50}},
  {id:11, liga:"Copa do Mundo 2026", liga_icon:"🌍", casa:{nome:"Inglaterra",bandeira:"🏴󠁧󠁢󠁥󠁮󠁧󠁿"},fora:{nome:"Itália",bandeira:"🇮🇹"},hora:"17:00",odds:{casa:1.95,empate:3.50,fora:3.80}},
  {id:12, liga:"Copa do Mundo 2026", liga_icon:"🌍", casa:{nome:"Holanda",bandeira:"🇳🇱"},fora:{nome:"Bélgica",bandeira:"🇧🇪"},hora:"20:00",odds:{casa:2.00,empate:3.30,fora:3.60}},
  // Premier League
  {id:13, liga:"Premier League", liga_icon:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", casa:{nome:"Liverpool",bandeira:"🔴"},fora:{nome:"Chelsea",bandeira:"🔵"},hora:"13:30",odds:{casa:1.85,empate:3.60,fora:4.50}},
  {id:14, liga:"Premier League", liga_icon:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", casa:{nome:"Man City",bandeira:"🩵"},fora:{nome:"Arsenal",bandeira:"🔴⚪"},hora:"16:00",odds:{casa:1.75,empate:3.80,fora:4.80}},
  // La Liga
  {id:15, liga:"La Liga", liga_icon:"🇪🇸", casa:{nome:"Real Madrid",bandeira:"⚪🟡"},fora:{nome:"Barcelona",bandeira:"🔴🔵"},hora:"20:00",odds:{casa:2.00,empate:3.40,fora:3.70}},
  {id:16, liga:"La Liga", liga_icon:"🇪🇸", casa:{nome:"Atletico Madrid",bandeira:"🔴⚪"},fora:{nome:"Sevilla",bandeira:"⚪🔴"},hora:"17:00",odds:{casa:1.90,empate:3.30,fora:4.20}},
  // Ligue 1
  {id:17, liga:"Ligue 1", liga_icon:"🇫🇷", casa:{nome:"PSG",bandeira:"🔵🔴"},fora:{nome:"Marseille",bandeira:"🔵⚪"},hora:"20:45",odds:{casa:1.60,empate:4.00,fora:5.50}},
  // Champions League
  {id:18, liga:"Champions League", liga_icon:"⭐", casa:{nome:"Bayern München",bandeira:"🔴⚪"},fora:{nome:"Inter de Milão",bandeira:"🔵⚫"},hora:"21:00",odds:{casa:1.80,empate:3.70,fora:4.60}},
  {id:19, liga:"Champions League", liga_icon:"⭐", casa:{nome:"Borussia Dortmund",bandeira:"🟡⚫"},fora:{nome:"Juventus",bandeira:"⚫⚪"},hora:"21:00",odds:{casa:2.10,empate:3.20,fora:3.50}},
  // Copa Libertadores
  {id:20, liga:"Copa Libertadores", liga_icon:"🌎", casa:{nome:"Boca Juniors",bandeira:"🔵🟡"},fora:{nome:"River Plate",bandeira:"⚪🔴"},hora:"21:30",odds:{casa:2.40,empate:3.10,fora:3.00}},
];

// --- ESTADO GLOBAL ---
let perfilAtual = localStorage.getItem('bp_perfil') || 'cauteloso';
let ligaFiltro = 'Todos';
let historicoApostas = JSON.parse(localStorage.getItem('bp_historico') || '[]');

// --- LOGIN ---
function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  if (!email) { alert('Digite seu e-mail'); return; }
  if (!pass) { alert('Digite sua senha'); return; }
  // Simulação de autenticação (demo)
  if (email === 'admin@bp.com' && pass === '123456') {
    // Gerar token JWT simulado
    const token = btoa(JSON.stringify({user: email, exp: Date.now() + 86400000}));
    localStorage.setItem('bp_token', token);
    localStorage.setItem('bp_user', email);
    iniciarApp(email);
  } else {
    alert('❌ E-mail ou senha incorretos.\nUse: admin@bp.com / 123456');
  }
}

function doLogout() {
  localStorage.removeItem('bp_token');
  localStorage.removeItem('bp_user');
  document.getElementById('loginArea').style.display = 'flex';
  document.getElementById('appMain').style.display = 'none';
}

function iniciarApp(user) {
  document.getElementById('loginArea').style.display = 'none';
  document.getElementById('appMain').style.display = 'block';
  document.getElementById('nomeUsuario').textContent = user.split('@')[0];
  // Carregar dados salvos
  perfilAtual = localStorage.getItem('bp_perfil') || 'cauteloso';
  setPerfil(perfilAtual, false);
  carregarDashboard();
  carregarJogos();
  renderizarBilhete();
  carregarHistorico('todos');
  carregarBanca();
}

// Verificar se já está logado ao carregar a página
window.onload = function() {
  const token = localStorage.getItem('bp_token');
  const user = localStorage.getItem('bp_user');
  if (token && user) {
    try {
      const dados = JSON.parse(atob(token));
      if (dados.exp > Date.now()) {
        iniciarApp(user);
        return;
      }
    } catch(e) {}
  }
  document.getElementById('loginArea').style.display = 'flex';
};

// Permitir Enter no login
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const la = document.getElementById('loginArea');
    if (la && la.style.display !== 'none') doLogin();
  }
});

// --- NAVEGAÇÃO ---
function irParaAba(aba) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('aba-' + aba).classList.add('active');
  document.getElementById('nav-' + aba).classList.add('active');
  if (aba === 'dashboard') carregarDashboard();
  if (aba === 'historico') carregarHistorico(filtroHistoricoAtual);
}

// --- PERFIL DE RISCO ---
function setPerfil(perfil, salvar = true) {
  perfilAtual = perfil;
  if (salvar) localStorage.setItem('bp_perfil', perfil);
  document.querySelectorAll('.perfil-opcao').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('p-' + perfil);
  if (el) el.classList.add('active');
}

// --- DASHBOARD ---
function carregarDashboard() {
  const hist = JSON.parse(localStorage.getItem('bp_historico') || '[]');
  const bancaI = parseFloat(localStorage.getItem('bp_banca_inicial') || '0');
  const bancaA = parseFloat(localStorage.getItem('bp_banca_atual') || '0');
  const total = hist.length;
  const ganhas = hist.filter(h => h.resultado === 'green').length;
  const lucro = hist.reduce((acc, h) => acc + (h.lucro || 0), 0);
  const totalInvestido = hist.reduce((acc, h) => acc + (h.valor || 0), 0);
  const acerto = total > 0 ? ((ganhas / total) * 100).toFixed(1) : 0;
  const roi = bancaI > 0 ? (((bancaA - bancaI) / bancaI) * 100).toFixed(1) : 0;
  const yieldVal = totalInvestido > 0 ? ((lucro / totalInvestido) * 100).toFixed(1) : 0;

  document.getElementById('d-banca').textContent = 'R$ ' + (bancaA || 0).toFixed(2).replace('.', ',');
  document.getElementById('d-lucro').textContent = (lucro >= 0 ? '+' : '') + 'R$ ' + lucro.toFixed(2).replace('.', ',');
  document.getElementById('d-roi').textContent = roi + '%';
  document.getElementById('d-acerto').textContent = acerto + '%';
  document.getElementById('d-total').textContent = total;
  document.getElementById('d-yield').textContent = yieldVal + '%';
}

// --- JOGOS ---
function carregarJogos() {
  // Montar filtros de liga únicos
  const ligas = ['Todos', ...new Set(JOGOS_MOCK.map(j => j.liga))];
  const filtroDiv = document.getElementById('filtroLiga');
  filtroDiv.innerHTML = '';
  ligas.forEach(liga => {
    const btn = document.createElement('button');
    btn.className = 'filtro-btn' + (liga === ligaFiltro ? ' active' : '');
    btn.textContent = liga === 'Todos' ? '🌍 Todos' : liga;
    btn.onclick = () => filtrarLiga(liga);
    filtroDiv.appendChild(btn);
  });
  renderizarJogos();
}

function filtrarLiga(liga) {
  ligaFiltro = liga;
  document.querySelectorAll('#filtroLiga .filtro-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.replace('🌍 ', '') === liga || (liga === 'Todos' && b.textContent === '🌍 Todos'));
  });
  renderizarJogos();
}

function renderizarJogos() {
  const lista = document.getElementById('lista-jogos');
  const jogos = ligaFiltro === 'Todos' ? JOGOS_MOCK : JOGOS_MOCK.filter(j => j.liga === ligaFiltro);

  if (jogos.length === 0) {
    lista.innerHTML = '<div class="bilhete-vazio"><div class="icon">⚽</div><div>Nenhum jogo encontrado</div></div>';
    return;
  }

  lista.innerHTML = jogos.map(j => `
    <div class="jogo-card" onclick="abrirDetalheJogo(${j.id})">
      <div class="jogo-liga">${j.liga_icon} ${j.liga}</div>
      <div class="jogo-times">
        <div class="time-info">          <div class="time-bandeira">${j.casa.bandeira}</div>
          <div class="time-nome">${j.casa.nome}</div>
        </div>
        <div class="jogo-vs">VS</div>
        <div class="time-info">
          <div class="time-bandeira">${j.fora.bandeira}</div>
          <div class="time-nome">${j.fora.nome}</div>
        </div>
      </div>
      <div style="text-align:center"><span class="jogo-hora">⏰ ${j.hora}</span></div>
      <div class="jogo-odds">
        <div class="odd-btn ${isSelecionado(j.id,'casa')}" onclick="event.stopPropagation();selecionarOdd(${j.id},'casa',${j.odds.casa})">
          <span class="odd-label">Casa</span>
          <span class="odd-valor">${j.odds.casa.toFixed(2)}</span>
        </div>
        <div class="odd-btn ${isSelecionado(j.id,'empate')}" onclick="event.stopPropagation();selecionarOdd(${j.id},'empate',${j.odds.empate})">
          <span class="odd-label">Empate</span>
          <span class="odd-valor">${j.odds.empate.toFixed(2)}</span>
        </div>
        <div class="odd-btn ${isSelecionado(j.id,'fora')}" onclick="event.stopPropagation();selecionarOdd(${j.id},'fora',${j.odds.fora})">
          <span class="odd-label">Fora</span>
          <span class="odd-valor">${j.odds.fora.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function isSelecionado(jogoId, mercado) {
  return bilhete.some(b => b.jogoId === jogoId && b.mercado === mercado) ? 'selecionado' : '';
}

function abrirDetalheJogo(id) {
  const j = JOGOS_MOCK.find(x => x.id === id);
  if (!j) return;
  // Redirecionar para aba bilhete com foco nesse jogo
  irParaAba('jogos');
}

// --- BANCA ---
function carregarBanca() {
  const bi = localStorage.getItem('bp_banca_inicial') || '';
  const ba = localStorage.getItem('bp_banca_atual') || '';
  const sw = localStorage.getItem('bp_stop_win') || '';
  const sl = localStorage.getItem('bp_stop_loss') || '';
  if (bi) document.getElementById('bancaInicial').value = bi;
  if (ba) document.getElementById('bancaAtual').value = ba;
  if (sw) document.getElementById('stopWin').value = sw;
  if (sl) document.getElementById('stopLoss').value = sl;
  if (bi && ba) calcularBanca();
}

function calcularBanca() {
  const bi = parseFloat(document.getElementById('bancaInicial').value) || 0;
  const ba = parseFloat(document.getElementById('bancaAtual').value) || 0;
  if (!bi || !ba) return;
  const lucro = ba - bi;
  const roi = ((lucro / bi) * 100).toFixed(2);
  const hist = JSON.parse(localStorage.getItem('bp_historico') || '[]');
  const totalInv = hist.reduce((acc, h) => acc + (h.valor || 0), 0);
  const totalLucro = hist.reduce((acc, h) => acc + (h.lucro || 0), 0);
  const yieldVal = totalInv > 0 ? ((totalLucro / totalInv) * 100).toFixed(2) : '0.00';
  const sw = parseFloat(document.getElementById('stopWin').value) || 0;
  const sl = parseFloat(document.getElementById('stopLoss').value) || 0;

  document.getElementById('b-lucro').textContent = (lucro >= 0 ? '+' : '') + 'R$ ' + lucro.toFixed(2).replace('.', ',');
  document.getElementById('b-lucro').style.color = lucro >= 0 ? '#00ff88' : '#ff4466';
  document.getElementById('b-roi').textContent = roi + '%';
  document.getElementById('b-yield').textContent = yieldVal + '%';
  document.getElementById('b-stopwin-status').textContent = sw ? (ba >= sw ? '✅ Meta atingida!' : `Faltam R$ ${(sw - ba).toFixed(2)}`) : '-';
  document.getElementById('b-stoploss-status').textContent = sl ? (ba <= sl ? '🛑 STOP LOSS atingido!' : `Margem: R$ ${(ba - sl).toFixed(2)}`) : '-';
  document.getElementById('banca-resultado').style.display = 'block';
}

function salvarBanca() {
  const bi = document.getElementById('bancaInicial').value;
  const ba = document.getElementById('bancaAtual').value;
  const sw = document.getElementById('stopWin').value;
  const sl = document.getElementById('stopLoss').value;
  if (!bi || !ba) { alert('Preencha a banca inicial e atual'); return; }
  localStorage.setItem('bp_banca_inicial', bi);
  localStorage.setItem('bp_banca_atual', ba);
  localStorage.setItem('bp_stop_win', sw);
  localStorage.setItem('bp_stop_loss', sl);
  calcularBanca();
  alert('✅ Banca salva com sucesso!');
  carregarDashboard();
}

// --- HISTÓRICO ---
let filtroHistoricoAtual = 'todos';

function carregarHistorico(filtro) {
  filtroHistoricoAtual = filtro;
  document.querySelectorAll('.filtros-historico .filtro-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.toLowerCase() === filtro || (filtro === 'todos' && b.textContent === 'Todos'));
  });
  const hist = JSON.parse(localStorage.getItem('bp_historico') || '[]');
  const agora = new Date();
  let filtrados = hist.filter(h => {
    const d = new Date(h.data);
    if (filtro === 'hoje') return d.toDateString() === agora.toDateString();
    if (filtro === 'semana') { const s = new Date(agora); s.setDate(s.getDate() - 7); return d >= s; }
    if (filtro === 'mes') { const m = new Date(agora); m.setMonth(m.getMonth() - 1); return d >= m; }
    return true;
  });

  const lista = document.getElementById('historico-lista');
  if (filtrados.length === 0) {
    lista.innerHTML = '<div class="bilhete-vazio"><div class="icon">📋</div><div>Nenhuma aposta encontrada</div></div>';
    return;
  }

  lista.innerHTML = filtrados.reverse().map(h => `
    <div class="historico-card">
      <div class="historico-header">
        <span class="historico-data">📅 ${new Date(h.data).toLocaleDateString('pt-BR')} ${new Date(h.data).toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'})}</span>
        <span class="historico-resultado resultado-${h.resultado}">${h.resultado === 'green' ? '✅ Ganhou' : h.resultado === 'red' ? '❌ Perdeu' : '⏳ Pendente'}</span>
      </div>
      <div class="historico-info">🎲 ${h.jogos} jogo(s) · Odd: <strong>${parseFloat(h.oddTotal).toFixed(2)}</strong></div>
      <div class="historico-info">💰 Apostado: R$ ${parseFloat(h.valor || 0).toFixed(2)}</div>
      <div class="historico-lucro" style="color:${h.resultado === 'green' ? '#00ff88' : h.resultado === 'red' ? '#ff4466' : '#ffcc00'}">
        ${h.resultado === 'green' ? '+R$ ' + parseFloat(h.lucro || 0).toFixed(2) : h.resultado === 'red' ? '-R$ ' + parseFloat(h.valor || 0).toFixed(2) : '⏳ Aguardando'}
      </div>
    </div>
  `).join('');
}

function filtrarHistorico(tipo) {
  carregarHistorico(tipo);
}
