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
      container.innerHTML = '<div class="empty">Nenhum jogo encontrado</div>';
    }
  } catch (error) {
    console.error("Erro ao carregar jogos:", error);
    container.innerHTML = '<div class="error">❌ Erro ao carregar jogos</div>';
  }
}

function mostrarJogos(jogos) {
  const container = document.getElementById("jogos-container");
  if (!container) return;

  // Pegar últimos 5 jogos
  const ultimosJogos = jogos.slice(-5).reverse();

  container.innerHTML = ultimosJogos
    .map((jogo) => {
      const isPalmeirasHome = jogo.home_team === "Palmeiras";
      const palmeirasGols = isPalmeirasHome ? jogo.home_score : jogo.away_score;
      const adversario = isPalmeirasHome ? jogo.away_team : jogo.home_team;
      const adversarioGols = isPalmeirasHome
        ? jogo.away_score
        : jogo.home_score;

      let resultadoClass = "";
      let resultadoIcon = "";
      if (palmeirasGols > adversarioGols) {
        resultadoClass = "vitoria";
        resultadoIcon = "🏆";
      } else if (palmeirasGols === adversarioGols) {
        resultadoClass = "empate";
        resultadoIcon = "🤝";
      } else {
        resultadoClass = "derrota";
        resultadoIcon = "💔";
      }

      const data = new Date(jogo.match_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      });

      return `
        <div class="jogo-card ${resultadoClass}">
          <div class="jogo-data">${data}</div>
          <div class="jogo-placar">
            <span class="time time-palmeiras">PAL</span>
            <span class="gols">${palmeirasGols}</span>
            <span class="vs">x</span>
            <span class="gols">${adversarioGols}</span>
            <span class="time time-adversario">${adversario.slice(0, 3).toUpperCase()}</span>
          </div>
          <div class="jogo-resultado ${resultadoClass}">${resultadoIcon}</div>
        </div>
      `;
    })
    .join("");
}

// ============================================
// ESTATÍSTICAS REAIS DA API
// ============================================

async function carregarEstatisticasTime() {
  const container = document.getElementById("stats-container");
  if (!container) return;

  container.innerHTML =
    '<div class="loading">📊 Carregando estatísticas...</div>';

  try {
    // Buscar estatísticas do time
    const response = await fetch(`${API_URL}/statistics/team/summary`);
    const result = await response.json();

    if (result.success) {
      const stats = result.data;

      // Buscar artilheiro
      const rankingResponse = await fetch(
        `${API_URL}/statistics/ranking/goals?limit=1`,
      );
      const rankingResult = await rankingResponse.json();
      const artilheiro =
        rankingResult.success && rankingResult.data[0]
          ? rankingResult.data[0]
          : { name: "N/A", total_goals: 0 };

      // Calcular aproveitamento
      const totalMatches = parseInt(stats.total_matches) || 1;
      const wins = parseInt(stats.total_wins) || 0;
      const aproveitamento = ((wins / totalMatches) * 100).toFixed(1);

      mostrarEstatisticas({
        ...stats,
        aproveitamento,
        artilheiro_nome: artilheiro.name,
        artilheiro_gols: artilheiro.total_goals,
      });
    } else {
      container.innerHTML =
        '<div class="empty">Estatísticas não disponíveis</div>';
    }
  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    container.innerHTML =
      '<div class="error">❌ Erro ao carregar estatísticas</div>';
  }
}

function mostrarEstatisticas(stats) {
  const container = document.getElementById("stats-container");
  if (!container) return;

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-icon">🏆</span>
        <span class="stat-value">${stats.aproveitamento}%</span>
        <span class="stat-label">Aproveitamento</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">⚽</span>
        <span class="stat-value">${stats.total_goals || 0}</span>
        <span class="stat-label">Gols Marcados</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">🎯</span>
        <span class="stat-value">${stats.total_assists || 0}</span>
        <span class="stat-label">Assistências</span>
      </div>
      <div class="stat-card">
        <span class="stat-icon">👑</span>
        <span class="stat-value">${stats.artilheiro_nome?.split(" ")[0] || "N/A"}</span>
        <span class="stat-label">Artilheiro (${stats.artilheiro_gols || 0})</span>
      </div>
    </div>
  `;
}

// ============================================
// RANKING DE ARTILHEIROS
// ============================================

async function carregarRanking() {
  const container = document.getElementById("ranking-container");
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/statistics/ranking/goals?limit=5`);
    const result = await response.json();

    if (result.success && result.data.length > 0) {
      container.innerHTML = `
        <div class="ranking-list">
          ${result.data
            .map(
              (jogador, index) => `
            <div class="ranking-item">
              <div class="ranking-posicao ${index === 0 ? "primeiro" : ""}">${index + 1}</div>
              <div class="ranking-nome">${jogador.name}</div>
              <div class="ranking-gols">${jogador.total_goals} gols</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
    } else {
      container.innerHTML =
        '<div class="empty">Nenhum jogador com gols registrados</div>';
    }
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    container.innerHTML =
      '<div class="error">❌ Erro ao carregar ranking</div>';
  }
}

// ============================================
// PRÓXIMOS JOGOS (MOCK - VEM DA API DEPOIS)
// ============================================

function mostrarProximosJogos() {
  const container = document.getElementById("proximos-container");
  if (!container) return;

  const proximos = [
    {
      data: "01/06",
      adversario: "Santos",
      local: "Allianz Parque",
      horario: "16:00",
    },
    {
      data: "05/06",
      adversario: "Atlético-MG",
      local: "Arena MRV",
      horario: "21:30",
    },
    {
      data: "11/06",
      adversario: "Cruzeiro",
      local: "Allianz Parque",
      horario: "19:00",
    },
  ];

  container.innerHTML = proximos
    .map(
      (jogo) => `
      <div class="proximo-card">
        <div class="proximo-data">📅 ${jogo.data}</div>
        <div class="proximo-adversario">vs ${jogo.adversario}</div>
        <div class="proximo-local">📍 ${jogo.local} • ${jogo.horario}</div>
      </div>
    `,
    )
    .join("");
}

// ============================================
// EXPOR FUNÇÕES PARA O MODAL DE LOGIN
// ============================================

// Exportar funções para que o modal-login.js possa recarregar os dados
window.carregarEstatisticasTime = carregarEstatisticasTime;
window.carregarRanking = carregarRanking;
window.carregarJogos = carregarJogos;

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  await carregarJogos();
  await carregarEstatisticasTime();
  await carregarRanking();
  mostrarProximosJogos();

  console.log("🐷 Palestra Analytics - Dados 100% da API!");
});
