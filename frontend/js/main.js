// ============================================
// DADOS DO PALMEIRAS - TEMPORADA 2026
// ============================================

// Últimos jogos do Palmeiras em 2026
const jogosPalmeiras2026 = [
  {
    id: 1,
    data: "28/05/2026",
    horario: "21:30",
    adversario: "Junior Barranquilla",
    placar: "2x1",
    competicao: "Libertadores",
    local: "Allianz Parque",
    resultado: "V",
  },
  {
    id: 2,
    data: "24/05/2026",
    horario: "16:00",
    adversario: "São Paulo",
    placar: "1x0",
    competicao: "Brasileirão",
    local: "Morumbis",
    resultado: "V",
  },
  {
    id: 3,
    data: "20/05/2026",
    horario: "20:00",
    adversario: "Corinthians",
    placar: "3x0",
    competicao: "Brasileirão",
    local: "Allianz Parque",
    resultado: "V",
  },
  {
    id: 4,
    data: "16/05/2026",
    horario: "18:30",
    adversario: "Botafogo",
    placar: "2x2",
    competicao: "Brasileirão",
    local: "Nilton Santos",
    resultado: "E",
  },
  {
    id: 5,
    data: "12/05/2026",
    horario: "21:00",
    adversario: "Cerro Porteño",
    placar: "0x1",
    competicao: "Libertadores",
    local: "La Olla",
    resultado: "D",
  },
  {
    id: 6,
    data: "08/05/2026",
    horario: "16:00",
    adversario: "Flamengo",
    placar: "2x1",
    competicao: "Brasileirão",
    local: "Allianz Parque",
    resultado: "V",
  },
];

// Estatísticas do Palmeiras 2026
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

// Próximos jogos
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

// ============================================
// FUNÇÕES PARA MOSTRAR OS DADOS NA TELA
// ============================================

function mostrarJogos(jogos) {
  const container = document.getElementById("jogos-container");
  if (!container) return;

  container.innerHTML = jogos
    .map((jogo) => {
      let resultadoIcon = "";
      let resultadoClass = "";

      if (jogo.resultado === "V") {
        resultadoIcon = "✅ VITÓRIA";
        resultadoClass = "vitoria";
      } else if (jogo.resultado === "E") {
        resultadoIcon = "⚖️ EMPATE";
        resultadoClass = "empate";
      } else {
        resultadoIcon = "❌ DERROTA";
        resultadoClass = "derrota";
      }

      return `
            <div class="jogo-item ${resultadoClass}">
                <div class="jogo-header">
                    <span class="competicao">🏆 ${jogo.competicao}</span>
                    <span class="data">📅 ${jogo.data} - ${jogo.horario}</span>
                </div>
                <div class="jogo-placar">
                    <strong>🐷 Palmeiras ${jogo.placar} ${jogo.adversario}</strong>
                    <span class="resultado">${resultadoIcon}</span>
                </div>
                <div class="jogo-local">📍 ${jogo.local}</div>
            </div>
        `;
    })
    .join("");
}

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
  mostrarJogos(jogosPalmeiras2026);
  mostrarEstatisticas(estatisticasPalmeiras2026);
  mostrarProximosJogos();

  console.log("🐷 Palestra Analytics - Dados do Palmeiras 2026 carregados!");
});
