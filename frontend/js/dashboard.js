// ============================================
// CONFIGURAÇÕES
// ============================================
const API_URL = "http://localhost:3000/api";

// ============================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// ============================================

function checkAuth() {
  const token = localStorage.getItem("palestra_token");
  if (!token) {
    window.location.href = "/pages/login.html";
    return false;
  }
  return token;
}

function getUserData() {
  const userStr = localStorage.getItem("palestra_user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

function updateUserUI() {
  const user = getUserData();
  const userNameSpan = document.getElementById("userName");
  const welcomeSpan = document.getElementById("welcomeName");

  if (user && userNameSpan) {
    userNameSpan.textContent =
      user.name || user.email?.split("@")[0] || "Torcedor";
  }

  if (user && welcomeSpan) {
    welcomeSpan.textContent =
      user.name || user.email?.split("@")[0] || "Torcedor";
  }
}

// ============================================
// LOGOUT
// ============================================

function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("palestra_token");
      localStorage.removeItem("palestra_user");
      window.location.href = "/pages/login.html";
    });
  }
}

// ============================================
// FUNÇÕES DA API (COM TOKEN)
// ============================================

async function fetchWithAuth(endpoint) {
  const token = checkAuth();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    return null;
  }
}

async function carregarEstatisticasTime() {
  const data = await fetchWithAuth("/statistics/team/summary");
  if (data) {
    const totalMatches = parseInt(data.total_matches) || 1;
    const wins = parseInt(data.total_wins) || 0;
    const aproveitamento = ((wins / totalMatches) * 100).toFixed(1);

    const statAproveitamento = document.getElementById("statAproveitamento");
    const statGols = document.getElementById("statGols");
    const statAssists = document.getElementById("statAssists");

    if (statAproveitamento)
      statAproveitamento.textContent = `${aproveitamento}%`;
    if (statGols) statGols.textContent = data.total_goals || 0;
    if (statAssists) statAssists.textContent = data.total_assists || 0;
  }
}

async function carregarRanking() {
  const container = document.getElementById("ranking-container");
  if (!container) return;

  const data = await fetchWithAuth("/statistics/ranking/goals?limit=5");

  if (data && data.length > 0) {
    // Atualizar card do artilheiro
    const artilheiroSpan = document.getElementById("statArtilheiro");
    if (artilheiroSpan && data[0]) {
      artilheiroSpan.textContent = data[0].name.split(" ")[0];
    }

    container.innerHTML = `
      <div class="ranking-list">
        ${data
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
      '<div class="loading">Nenhum jogador com gols registrados</div>';
  }
}

async function carregarUltimosJogos() {
  const container = document.getElementById("jogos-container");
  if (!container) return;

  const data = await fetchWithAuth("/matches");

  if (data && data.length > 0) {
    const ultimosJogos = data.slice(-5).reverse();

    container.innerHTML = `
      <div class="jogos-grid">
        ${ultimosJogos
          .map((jogo) => {
            const isPalmeirasHome = jogo.home_team === "Palmeiras";
            const palmeirasGols = isPalmeirasHome
              ? jogo.home_score
              : jogo.away_score;
            const adversario = isPalmeirasHome
              ? jogo.away_team
              : jogo.home_team;
            const adversarioGols = isPalmeirasHome
              ? jogo.away_score
              : jogo.home_score;

            let resultadoIcon = "";
            if (palmeirasGols > adversarioGols) resultadoIcon = "🏆";
            else if (palmeirasGols === adversarioGols) resultadoIcon = "🤝";
            else resultadoIcon = "💔";

            const data = new Date(jogo.match_date).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            });

            return `
            <div class="jogo-card">
              <div class="jogo-data">${data}</div>
              <div class="jogo-placar">
                <span class="time time-palmeiras">PAL</span>
                <span class="gols">${palmeirasGols}</span>
                <span class="vs">x</span>
                <span class="gols">${adversarioGols}</span>
                <span class="time time-adversario">${adversario.slice(0, 3).toUpperCase()}</span>
              </div>
              <div class="jogo-resultado">${resultadoIcon}</div>
            </div>
          `;
          })
          .join("")}
      </div>
    `;
  } else {
    container.innerHTML = '<div class="loading">Nenhum jogo encontrado</div>';
  }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

async function init() {
  if (!checkAuth()) return;

  updateUserUI();
  setupLogout();

  await carregarEstatisticasTime();
  await carregarRanking();
  await carregarUltimosJogos();
}

document.addEventListener("DOMContentLoaded", init);
