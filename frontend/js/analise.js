// ============================================================
// analise.js — Motor de análise de bilhetes + OCR Tesseract
// ============================================================

// --- MOTOR DE ANÁLISE PRINCIPAL ---
// Recebe oddTotal, qtdJogos e valor apostado
// Retorna objeto completo com risco, confiança, recomendação e dicas
function motorDeAnalise(oddTotal, qtdJogos, valorAposta) {
  // Calcular nível de risco
  let risco, confianca, corRisco, iconeRisco;

  if (oddTotal < 3) {
    risco = 'Baixo';
    confianca = Math.max(85 - (qtdJogos * 4), 55);
    corRisco = '#00ff88';
    iconeRisco = '🟢';
  } else if (oddTotal <= 8) {
    risco = 'Médio';
    confianca = Math.max(72 - (qtdJogos * 5), 35);
    corRisco = '#ffcc00';
    iconeRisco = '🟡';
  } else {
    risco = 'Alto';
    confianca = Math.max(45 - (qtdJogos * 5), 10);
    corRisco = '#ff4466';
    iconeRisco = '🔴';
  }

  // Penalidade por muitos jogos
  const penalidade = qtdJogos > 5 ? qtdJogos - 5 : 0;
  confianca = Math.max(confianca - (penalidade * 3), 8);

  // Retorno potencial
  const retornoPotencial = valorAposta > 0 ? (oddTotal * valorAposta) : 0;
  const lucroEstimado = retornoPotencial - valorAposta;

  // Recomendação
  let recomendacao, recomendacaoCor;
  if (confianca >= 70) {
    recomendacao = '✅ Aposta recomendada';
    recomendacaoCor = '#00ff88';
  } else if (confianca >= 45) {
    recomendacao = '⚠️ Aposta aceitável com cautela';
    recomendacaoCor = '#ffcc00';
  } else {
    recomendacao = '❌ Alto risco — considere reduzir o bilhete';
    recomendacaoCor = '#ff4466';
  }

  // Gerar dicas personalizadas
  const dicas = gerarDicas(oddTotal, qtdJogos, risco);

  return {
    risco, confianca, corRisco, iconeRisco,
    recomendacao, recomendacaoCor,
    retornoPotencial, lucroEstimado,
    dicas, oddTotal, qtdJogos
  };
}

// --- GERAR DICAS ---
function gerarDicas(oddTotal, qtdJogos, risco) {
  const dicas = [];

  if (qtdJogos > 6) {
    dicas.push({ icone: '⚠️', texto: 'Bilhete com muitos jogos (' + qtdJogos + '). Cada jogo adicional reduz significativamente a probabilidade de acerto.' });
  }
  if (oddTotal > 15) {
    dicas.push({ icone: '🎰', texto: 'Odd total muito alta (' + oddTotal.toFixed(2) + 'x). A probabilidade implícita de ganho é inferior a ' + (100/oddTotal).toFixed(1) + '%.' });
  }
  if (risco === 'Baixo') {
    dicas.push({ icone: '🛡️', texto: 'Perfil conservador: odds baixas indicam favoritos. Boa estratégia para preservação de banca.' });
  }
  if (risco === 'Médio') {
    dicas.push({ icone: '⚡', texto: 'Risco moderado. Considere apostar no máximo 3-5% da sua banca nesse bilhete.' });
  }
  if (risco === 'Alto') {
    dicas.push({ icone: '🔥', texto: 'Risco alto. Recomendamos apostar no máximo 1-2% da banca. Nunca arrisque valores que não pode perder.' });
  }
  if (qtdJogos >= 3 && qtdJogos <= 5 && oddTotal <= 8) {
    dicas.push({ icone: '💡', texto: 'Combinação equilibrada! 3 a 5 jogos com odds moderadas é o perfil ideal para múltiplas apostas.' });
  }
  if (qtdJogos === 1) {
    dicas.push({ icone: '🎯', texto: 'Aposta simples: maior controle sobre o risco. Ideal para iniciantes ou para recuperação de banca.' });
  }
  if (dicas.length === 0) {
    dicas.push({ icone: '📊', texto: 'Análise concluída. Sempre pesquise os jogos antes de apostar e gerencie sua banca com disciplina.' });
  }

  return dicas;
}

// --- GERAR HTML DA ANÁLISE ---
function gerarHTMLAnalise(r, apostas) {
  const barraLargura = Math.min(r.confianca, 100);
  const barCor = r.confianca >= 70 ? '#00ff88' : r.confianca >= 45 ? '#ffcc00' : '#ff4466';

  const listaApostas = apostas && apostas.length > 0
    ? apostas.map(a => `<div class="analise-item"><span class="analise-icone">⚽</span><span><strong>${a.jogo}</strong> — ${a.mercadoLabel} @ <strong style="color:#00d4ff">${parseFloat(a.odd).toFixed(2)}</strong></span></div>`).join('')
    : '';

  const dicasHTML = r.dicas.map(d =>
    `<div class="analise-item"><span class="analise-icone">${d.icone}</span><span>${d.texto}</span></div>`
  ).join('');

  return `
    <div class="analise-secao">
      <h4>📊 Resultado da Análise</h4>
      <div class="analise-item">
        <span class="analise-icone">${r.iconeRisco}</span>
        <div style="flex:1">
          <div><strong>Nível de Risco:</strong> <span style="color:${r.corRisco};font-weight:800">${r.risco}</span></div>
          <div style="margin-top:4px"><strong>Odd Total:</strong> ${parseFloat(r.oddTotal).toFixed(2)}x &nbsp;|&nbsp; <strong>Jogos:</strong> ${r.qtdJogos}</div>
        </div>
      </div>
      <div class="analise-item">
        <span class="analise-icone">🎯</span>
        <div style="flex:1">
          <div><strong>Índice de Confiança:</strong> <span style="color:${barCor};font-weight:800">${r.confianca}%</span></div>
          <div class="nivel-bar"><div class="nivel-fill" style="width:${barraLargura}%;background:${barCor}"></div></div>
        </div>
      </div>
      <div class="analise-item">
        <span class="analise-icone">💬</span>
        <div><strong>Recomendação:</strong> <span style="color:${r.recomendacaoCor}">${r.recomendacao}</span></div>
      </div>
      ${r.retornoPotencial > 0 ? `
      <div class="analise-item">
        <span class="analise-icone">💰</span>
        <div><strong>Retorno Potencial:</strong> <span style="color:#00d4ff;font-weight:800">R$ ${r.retornoPotencial.toFixed(2)}</span> (Lucro: R$ ${r.lucroEstimado.toFixed(2)})</div>
      </div>` : ''}
    </div>

    ${listaApostas ? `
    <div class="analise-secao">
      <h4>🎫 Seleções do Bilhete</h4>
      ${listaApostas}
    </div>` : ''}

    <div class="analise-secao">
      <h4>💡 Dicas do Coach</h4>
      ${dicasHTML}
    </div>
  `;
}

// --- OCR COM TESSERACT ---
async function processarOCR(event) {
  const file = event.target.files[0];
  if (!file) return;

  const preview = document.getElementById('ocr-preview');
  const img = document.getElementById('ocr-img');
  const status = document.getElementById('ocr-status');
  const textoDiv = document.getElementById('ocr-texto');
  const resultado = document.getElementById('resultado-analise-ocr');

  // Mostrar preview da imagem
  const url = URL.createObjectURL(file);
  img.src = url;
  preview.style.display = 'block';
  status.textContent = '🔍 Processando OCR... aguarde';
  textoDiv.style.display = 'none';
  resultado.classList.remove('show');

  try {
    const { data: { text } } = await Tesseract.recognize(file, 'por+eng', {
      logger: m => {
        if (m.status === 'recognizing text') {
          status.textContent = '🔍 Reconhecendo texto: ' + Math.round(m.progress * 100) + '%';
        }
      }
    });

    status.textContent = '✅ OCR concluído!';
    textoDiv.style.display = 'block';
    textoDiv.textContent = text.trim() || 'Nenhum texto detectado na imagem.';

    // Analisar automaticamente o texto extraído
    if (text.trim().length > 10) {
      analisarTextoExtraido(text);
    }
  } catch (err) {
    status.textContent = '❌ Erro ao processar imagem. Tente outra.';
    console.error(err);
  }
}

// --- ANALISAR TEXTO MANUAL ---
function analisarTexto() {
  const texto = document.getElementById('textoAnalise').value.trim();
  if (!texto) {
    alert('Digite ou cole o texto do bilhete para analisar!');
    return;
  }
  analisarTextoExtraido(texto);
}

// --- ANÁLISE DO TEXTO (OCR ou manual) ---
function analisarTextoExtraido(texto) {
  const resultado = document.getElementById('resultado-analise-ocr');

  // Extrair odds do texto com regex
  const oddsEncontradas = [];
  const regexOdd = /[@\s](\d+[.,]\d{2})/g;
  let match;
  while ((match = regexOdd.exec(texto)) !== null) {
    const val = parseFloat(match[1].replace(',', '.'));
    if (val >= 1.01 && val <= 50) oddsEncontradas.push(val);
  }

  // Detectar número de jogos por palavras-chave
  const linhas = texto.split('\n').filter(l => l.trim().length > 3);
  const qtdEstimada = oddsEncontradas.length > 0 ? oddsEncontradas.length : Math.max(1, Math.min(linhas.length, 10));
  const oddTotal = oddsEncontradas.length > 0
    ? oddsEncontradas.reduce((a, b) => a * b, 1)
    : estimarOddPorTexto(texto);

  // Detectar valor apostado
  const regexValor = /r\$\s*(\d+[.,]?\d*)/i;
  const matchValor = texto.match(regexValor);
  const valorAposta = matchValor ? parseFloat(matchValor[1].replace(',', '.')) : 0;

  // Rodar motor
  const analise = motorDeAnalise(oddTotal, qtdEstimada, valorAposta);

  // Gerar HTML com apostas do texto
  const apostasTexto = oddsEncontradas.map((o, i) => ({
    jogo: 'Jogo ' + (i + 1) + ' (detectado via texto)',
    mercadoLabel: 'Seleção ' + (i + 1),
    odd: o
  }));

  resultado.innerHTML = `
    <div style="margin-bottom:12px;padding:10px;background:#131929;border-radius:10px;border:1px solid #1e2d4a">
      <div style="font-size:.75rem;color:#8899aa;margin-bottom:6px">📝 Texto analisado</div>
      <div style="font-size:.75rem;color:#7b2ff7">
        ${oddsEncontradas.length > 0
          ? `✅ Detectadas <strong>${oddsEncontradas.length}</strong> odds: <strong style="color:#00d4ff">${oddsEncontradas.map(o => o.toFixed(2)).join(' × ')}</strong>`
          : '⚠️ Odds não detectadas automaticamente. Análise baseada no conteúdo geral.'}
      </div>
    </div>
    ${gerarHTMLAnalise(analise, apostasTexto)}
  `;
  resultado.classList.add('show');
}

function estimarOddPorTexto(texto) {
  // Estimativa heurística baseada em palavras-chave
  const t = texto.toLowerCase();
  let odd = 2.0;
  if (t.includes('favorito') || t.includes('1x2') || t.includes('dupla')) odd = 1.7;
  if (t.includes('over') || t.includes('ambas') || t.includes('gol')) odd *= 1.5;
  if (t.includes('acumulada') || t.includes('multipla') || t.includes('combo')) odd *= 2.0;
  if (t.includes('super') || t.includes('jackpot') || t.includes('15+')) odd *= 5.0;
  return Math.min(odd, 50);
}
