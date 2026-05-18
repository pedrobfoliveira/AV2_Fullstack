function criarCardAgendamento(agendamento) {
  const nomeExibido =
    agendamento.status === "bloqueado"
      ? "Horário bloqueado"
      : agendamento.cliente_nome;

  return `
    <article class="agendamento status-borda-${agendamento.status}">
      <h3>${nomeExibido}</h3>

      <p><strong>Espaço:</strong> ${agendamento.espaco_nome}</p>
      <p><strong>Data:</strong> ${formatarData(agendamento.data_agendamento)}</p>
      <p><strong>Horário:</strong> ${agendamento.hora_inicio} até ${agendamento.hora_fim}</p>
      <p><strong>Observação:</strong> ${agendamento.observacao || "Sem observação"}</p>

      <span class="status status-${agendamento.status}">
        ${agendamento.status}
      </span>

      ${
        agendamento.status !== "bloqueado"
          ? `
            <div class="acoes">
              <button onclick="alterarStatus(${agendamento.id}, 'confirmado')">
                Confirmar
              </button>

              <button onclick="alterarStatus(${agendamento.id}, 'cancelado')">
                Cancelar
              </button>

              <button onclick="alterarStatus(${agendamento.id}, 'concluido')">
                Concluir
              </button>

              <button class="botao-excluir" onclick="removerAgendamento(${agendamento.id})">
                Excluir
              </button>
            </div>
          `
          : `
            <div class="acoes">
              <button class="botao-excluir" onclick="removerAgendamento(${agendamento.id})">
                Remover bloqueio
              </button>
            </div>
          `
      }
    </article>
  `;
}

function formatarData(data) {
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString("pt-BR");
}

function formatarData(data) {
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString("pt-BR");
}