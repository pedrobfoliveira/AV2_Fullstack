const formLogin = document.getElementById("form-login");
const mensagemLogin = document.getElementById("mensagem-login");

const tokenExistente = localStorage.getItem("tokenAgendaFlow");

if (tokenExistente) {
  window.location.href = "/frontend/pages/index.html";
}

formLogin.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("login_email").value;
  const senha = document.getElementById("login_senha").value;

  const resposta = await fazerLogin(email, senha);

  if (resposta.erro) {
    mensagemLogin.textContent = resposta.erro;
    mensagemLogin.classList.add("erro-login");
    return;
  }

  localStorage.setItem("tokenAgendaFlow", resposta.token);

  window.location.href = "/frontend/pages/index.html";
});