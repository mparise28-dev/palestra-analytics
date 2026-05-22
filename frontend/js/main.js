// ============================================
// API CONFIGURAÇÃO
// ============================================
const API_URL = "http://localhost:3000/api";

// ============================================
// FUNÇÕES PARA BUSCAR DADOS DA API
// ============================================

async function carregarJogos() {
  const container = document.getElementById("jogos-container");
  if (!container) return;

  container.innerHTML =
    '<div class="loading">🐷 Buscando jogos do Verdão...</div>';

  try {
    const response = await fetch(`${API_URL}/matches`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      mostrarJogos(result.data);
    } else {
      container.innerHTML = '<div class="loading">Nenhum jogo encontrado</div>';
    }
  } catch (error) {
    console.error("Erro ao carregar jogos:", error);
    container.innerHTML =
      '<div class="loading">❌ Erro ao carregar jogos</div>';
  }
}

function mostrarJogos(jogos) {
  const container = document.getElementById("jogos-container");
  if (!container) return;

  container.innerHTML = jogos
    .map((jogo) => {
      const isPalmeirasHome = jogo.home_team === "Palmeiras";
      const palmeirasGols = isPalmeirasHome ? jogo.home_score : jogo.away_score;
      const adversario = isPalmeirasHome ? jogo.away_team : jogo.home_team;
      const adversarioGols = isPalmeirasHome
        ? jogo.away_score
        : jogo.home_score;

      let resultadoIcon = "";
      if (palmeirasGols > adversarioGols) {
        resultadoIcon = "✅ VITÓRIA";
      } else if (palmeirasGols === adversarioGols) {
        resultadoIcon = "⚖️ EMPATE";
      } else {
        resultadoIcon = "❌ DERROTA";
      }

      const data = new Date(jogo.match_date).toLocaleDateString("pt-BR");

      return `
        <div class="jogo-item">
          <div class="jogo-header">
            <span class="data">📅 ${data}</span>
          </div>
          <div class="jogo-placar">
            <strong>🐷 Palmeiras ${palmeirasGols} x ${adversarioGols} ${adversario}</strong>
          </div>
          <div class="jogo-resultado">${resultadoIcon}</div>
        </div>
      `;
    })
    .join("");
}

// Estatísticas (mockadas por enquanto - depois vem da API)
const estatisticasPalmeiras2026 = {
  posicao: 1,
  pontos: 34,
  jogos: 15,
  vitorias: 10,
  empates: 4,
  derrotas: 1,
  gols_pro: 31,
  gols_contra: 13,
  saldo_gols: 18,
  aproveitamento: "73.3%",
  artilheiro: { nome: "Estêvão", gols: 8 },
  assistente: { nome: "Veiga", assistencias: 5 },
};

function mostrarEstatisticas(stats) {
  const container = document.getElementById("stats-container");
  if (!container) return;

  container.innerHTML = `
    <div class="stat-item">
      <strong>🏆 Posição:</strong> 
      <span>${stats.posicao}° lugar</span>
    </div>
    <div class="stat-item">
      <strong>📊 Pontos:</strong> 
      <span>${stats.pontos} pontos</span>
    </div>
    <div class="stat-item">
      <strong>⚽ Jogos:</strong> 
      <span>${stats.jogos} (${stats.vitorias}V, ${stats.empates}E, ${stats.derrotas}D)</span>
    </div>
    <div class="stat-item">
      <strong>🥅 Gols:</strong> 
      <span>${stats.gols_pro} marcados / ${stats.gols_contra} sofridos</span>
    </div>
    <div class="stat-item">
      <strong>📈 Saldo:</strong> 
      <span>+${stats.saldo_gols}</span>
    </div>
    <div class="stat-item">
      <strong>💯 Aproveitamento:</strong> 
      <span>${stats.aproveitamento}</span>
    </div>
    <div class="stat-item">
      <strong>👑 Artilheiro:</strong> 
      <span>${stats.artilheiro.nome} - ${stats.artilheiro.gols} gols</span>
    </div>
    <div class="stat-item">
      <strong>🎯 Assistente:</strong> 
      <span>${stats.assistente.nome} - ${stats.assistente.assistencias} assistências</span>
    </div>
  `;
}

// Próximos jogos (mockados por enquanto)
const proximosJogos2026 = [
  {
    data: "01/06/2026",
    horario: "16:00",
    adversario: "Santos",
    competicao: "Brasileirão",
    local: "Allianz Parque",
  },
  {
    data: "05/06/2026",
    horario: "21:30",
    adversario: "Atlético-MG",
    competicao: "Brasileirão",
    local: "Arena MRV",
  },
  {
    data: "11/06/2026",
    horario: "19:00",
    adversario: "Cruzeiro",
    competicao: "Brasileirão",
    local: "Allianz Parque",
  },
];

function mostrarProximosJogos() {
  const container = document.getElementById("proximos-container");
  if (!container) return;

  container.innerHTML = proximosJogos2026
    .map(
      (jogo) => `
      <div class="jogo-item proximo">
        <div class="jogo-header">
          <span class="competicao">🏆 ${jogo.competicao}</span>
          <span class="data">📅 ${jogo.data} - ${jogo.horario}</span>
        </div>
        <div class="jogo-placar">
          <strong>🐷 Palmeiras vs ${jogo.adversario}</strong>
          <span class="resultado">⏳ AGENDA</span>
        </div>
        <div class="jogo-local">📍 ${jogo.local}</div>
      </div>
    `,
    )
    .join("");
}

// Navegação
document.getElementById("loginBtn")?.addEventListener("click", () => {
  alert("🐷 Área do torcedor - Em desenvolvimento!");
});

// ============================================
// INICIALIZAR TUDO QUANDO A PÁGINA CARREGAR
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  carregarJogos(); // Agora vem da API!
  mostrarEstatisticas(estatisticasPalmeiras2026);
  mostrarProximosJogos();

  console.log("🐷 Palestra Analytics - Conectado à API!");
});
