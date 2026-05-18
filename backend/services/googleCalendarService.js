if (process.env.GOOGLE_CALENDAR_ENABLED === "true") {
  try {
    const eventoGoogle = await googleCalendarService.criarEventoGoogleAgenda({
      cliente_nome: dados.cliente_nome,
      cliente_email: dados.cliente_email,
      cliente_telefone: dados.cliente_telefone,
      espaco_nome: espacoEncontrado ? espacoEncontrado.nome : "",
      data_agendamento: dados.data_agendamento,
      hora_inicio: dados.hora_inicio,
      hora_fim: dados.hora_fim,
      observacao: dados.observacao
    });

    await agendamentoModel.atualizarEventoGoogle(
      agendamento.id,
      eventoGoogle.id,
      eventoGoogle.htmlLink
    );

    agendamento.google_event_id = eventoGoogle.id;
    agendamento.google_event_link = eventoGoogle.htmlLink;
  } catch (erroGoogle) {
    console.log("Erro ao criar evento no Google Agenda:", erroGoogle.message);

    agendamento.aviso_google =
      "Agendamento salvo no sistema, mas não foi enviado ao Google Agenda.";
  }
}