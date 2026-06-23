// ============================================================
// bilhete.js — Gerenciamento do bilhete de apostas
// ============================================================

// Bilhete armazenado em memória e localStorage
let bilhete = JSON.parse(localStorage.getItem('bp_bilhete') || '[]');

// --- SELECIONAR ODD ---
function selecionarOdd(jogoId, mercado, oddValor) {
  const jogo = JOGOS_MOCK.find(j => j.id === jogoId);
  if (!jogo) return;

  // Verificar se já tem esse jogo no bilhete com outra seleção
  const indexExistente = bilhete.findIndex(b => b.jogoId === jogoId);

  if (indexExistente !== -1) {
    // Se clicou na mesma seleção, remove
    if (bilhete[indexExistente].mercado === mercado) {
      bilhete.splice(indexExistente, 1);
    } else {
      // Troca a seleção
      bilhete[indexExistente].mercado = mercado;
      bilhete[indexExistente].odd = oddValor;
      bilhete[indexExistente].mercadoLabel = getMercadoLabel(mercado, jogo);
    }
  } else {
    // Adicionar ao bilhete
    bilhete.push({
      jogoId: jogoId,
      jogo: jogo.casa.nome + ' x ' + jogo.fora.nome,
      liga: jogo.liga,
      mercado: mercado,
      mercadoLabel: getMercadoLabel(mercado, jogo),
      odd: oddValor
    });
  }

  // Salvar e atualizar UI
  localStorage.setItem('bp_bilhete', JSON.stringify(bilhete));
  atualizarBadge();
  renderizarBilhete();
  // Atualizar visual dos botões na lista de jogos
  renderizarJogos();
}

function getMercadoLabel(mercado, jogo) {
  if (mercado === 'casa') return jogo.casa.nome + ' vence';
  if (mercado === 'empate') return 'Empate';
  if (mercado === 'fora') return jogo.fora.nome + ' vence';
  return mercado;
}

// --- RENDERIZAR BILHETE ---
function renderizarBilhete() {
  const lista = document.getElementById('bilhete-lista');
  const resumo = document.getElementById('bilhete-resumo');
  const acoes = document.getElementById('bilhete-acoes');
  const vazio = document.getElementById('bilhete-vazio');

  if (bilhete.length === 0) {
    lista.innerHTML = '';
    resumo.style.display = 'none';
    acoes.style.display = 'none';
    vazio.style.display = 'block';
    atualizarBadge();
    return;
  }

  vazio.style.display = 'none';
  resumo.style.display = 'block';
  acoes.style.display = 'block';

  lista.innerHTML = bilhete.map((b, i) => `
    <div class="aposta-item">
      <div class="aposta-info">
        <div class="aposta-jogo">⚽ ${b.jogo}</div>
        <div class="aposta-mercado">${b.mercadoLabel}</div>
        <div style="font-size:.7rem;color:#7b2ff7;margin-top:3px">${b.liga}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="aposta-odd">${parseFloat(b.odd).toFixed(2)}</div>
        <button class="aposta-remove" onclick="removerAposta(${i})">✕</button>
      </div>
    </div>
  `).join('');

  atualizarResumo();
  atualizarBadge();
}

// --- ATUALIZAR RESUMO ---
function atualizarResumo() {
  const oddTotal = bilhete.reduce((acc, b) => acc * parseFloat(b.odd), 1);
  const valor = parseFloat(document.getElementById('r-valor')?.value || 0);
  const retorno = oddTotal * valor;

  document.getElementById('r-qtd').textContent = bilhete.length;
  document.getElementById('r-odd').textContent = oddTotal.toFixed(2);

  // Classificar risco pelo perfil e odd total
  const risco = calcularRisco(oddTotal, bilhete.length);
  const riscoEl = document.getElementById('r-risco');
  riscoEl.textContent = risco.label;
  riscoEl.style.color = risco.cor;

  if (valor > 0) {
    document.getElementById('r-retorno').textContent = 'R$ ' + retorno.toFixed(2).replace('.', ',');
  } else {
    document.getElementById('r-retorno').textContent = 'R$ 0,00';
  }
}

function calcularRisco(oddTotal, qtdJogos) {
  // Regras de risco
  if (oddTotal < 3) return { label: '🟢 Risco Baixo', cor: '#00ff88', nivel: 'baixo' };
  if (oddTotal <= 8) return { label: '🟡 Risco Médio', cor: '#ffcc00', nivel: 'medio' };
  return { label: '🔴 Risco Alto', cor: '#ff4466', nivel: 'alto' };
}

// --- REMOVER APOSTA ---
function removerAposta(index) {
  bilhete.splice(index, 1);
  localStorage.setItem('bp_bilhete', JSON.stringify(bilhete));
  renderizarBilhete();
  renderizarJogos();
}

// --- LIMPAR BILHETE ---
function limparBilhete() {
  if (bilhete.length === 0) return;
  if (!confirm('Deseja limpar o bilhete?')) return;
  bilhete = [];
  localStorage.setItem('bp_bilhete', JSON.stringify(bilhete));
  renderizarBilhete();
  renderizarJogos();
  document.getElementById('resultado-analise-bilhete').classList.remove('show');
}

// --- BADGE ---
function atualizarBadge() {
  const badge = document.getElementById('bilhete-count');
  if (bilhete.length > 0) {
    badge.textContent = bilhete.length;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// --- ANALISAR BILHETE ---
function analisarBilhete() {
  if (bilhete.length === 0) {
    alert('Adicione apostas ao bilhete primeiro!');
    return;
  }

  const oddTotal = bilhete.reduce((acc, b) => acc * parseFloat(b.odd), 1);
  const qtd = bilhete.length;
  const valor = parseFloat(document.getElementById('r-valor')?.value || 0);

  // Chamar motor de análise
  const resultado = motorDeAnalise(oddTotal, qtd, valor);

  const div = document.getElementById('resultado-analise-bilhete');
  div.innerHTML = gerarHTMLAnalise(resultado, bilhete);
  div.classList.add('show');

  // Salvar no histórico
  salvarNoHistorico(oddTotal, qtd, valor, resultado);
}

function salvarNoHistorico(oddTotal, qtd, valor, analise) {
  const hist = JSON.parse(localStorage.getItem('bp_historico') || '[]');
  hist.push({
    data: new Date().toISOString(),
    jogos: qtd,
    oddTotal: oddTotal.toFixed(2),
    valor: valor,
    lucro: analise.retornoPotencial - valor,
    resultado: 'pending', // pending até o usuário atualizar
    analise: analise.risco
  });
  localStorage.setItem('bp_historico', JSON.stringify(hist));
}
