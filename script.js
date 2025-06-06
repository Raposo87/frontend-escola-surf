 // Variável global para guardar o preço selecionado
let precoSelecionado = 0;

// Função para abrir o modal de agendamento com os dados da aula
function abrirModalAgendamento(descricao, preco) {
  document.getElementById('reserva-titulo').textContent = descricao;
  document.getElementById('reserva-preco').textContent = `Preço: €${preco}`;
  precoSelecionado = preco; // Salva o preço selecionado
  document.getElementById('modal-agendamento').style.display = 'flex';
}

// Função para fechar o modal de agendamento
function fecharModalAgendamento() {
  document.getElementById('modal-agendamento').style.display = 'none';
  document.getElementById('mensagem-agendamento').style.display = 'none';
  document.getElementById('form-agendamento').reset();
}

document.addEventListener('DOMContentLoaded', function() {
  // Adiciona evento aos botões de reservar
  const reservarBtns = document.querySelectorAll('.reservar-btn');
  reservarBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          const descricao = this.dataset.descricao;
          const preco = Number(this.dataset.preco); // Certifique-se que é número
          abrirModalAgendamento(descricao, preco);
      });
  });

  document.getElementById('fechar-modal').onclick = fecharModalAgendamento;

  window.onclick = function(event) {
      const modal = document.getElementById('modal-agendamento');
      if (event.target === modal) {
          fecharModalAgendamento();
      }
  };

  // Lógica do formulário de agendamento com Stripe
  document.getElementById('form-agendamento').onsubmit = function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    // Pegue o preço selecionado
    const preco = precoSelecionado;

    fetch('https://site-escola-surf-production.up.railway.app/criar-sessao-pagamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            email,
            preco
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.url) {
            window.location.href = data.url; // Redireciona para o checkout da Stripe
        } else {
            document.getElementById('mensagem-agendamento').innerText = 'Erro ao iniciar pagamento.';
            document.getElementById('mensagem-agendamento').style.display = 'block';
        }
    })
    .catch(error => {
        document.getElementById('mensagem-agendamento').innerText = 'Erro ao iniciar pagamento. Tente novamente.';
        document.getElementById('mensagem-agendamento').style.display = 'block';
        console.error(error);
    });
  };

  // Configurar data mínima para hoje
  const hoje = new Date();
  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const yyyy = hoje.getFullYear();
  const dataMinima = yyyy + '-' + mm + '-' + dd;
  document.getElementById('data').min = dataMinima;
});