 // Função para abrir o modal de agendamento com os dados da aula
 function abrirModalAgendamento(descricao, preco) {
  // Atualizar informações da aula no modal
  document.getElementById('reserva-titulo').textContent = descricao;
  document.getElementById('reserva-preco').textContent = `Preço: €${preco}`;
  
  // Exibir o modal
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
          // Obter dados da aula
          const descricao = this.dataset.descricao;
          const preco = this.dataset.preco;
          
          // Abrir modal com os dados
          abrirModalAgendamento(descricao, preco);
      });
  });

  // Fecha o modal ao clicar no X
  document.getElementById('fechar-modal').onclick = fecharModalAgendamento;

  // Fecha o modal ao clicar fora do conteúdo
  window.onclick = function(event) {
      const modal = document.getElementById('modal-agendamento');
      if (event.target === modal) {
          fecharModalAgendamento();
      }
  };

  // Lógica do formulário de agendamento
  document.getElementById('form-agendamento').onsubmit = function(e) {
    e.preventDefault();

    // Pegue os valores do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const data_agendamento = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;

    // Envie para o backend no Railway
    fetch('https://site-escola-surf-production.up.railway.app/agendamentos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome,
            email,
            data_agendamento,
            horario
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Erro ao agendar');
        return response.json();
    })
    .then(data => {
        document.getElementById('mensagem-agendamento').innerText = 'Agendamento realizado com sucesso!';
        document.getElementById('mensagem-agendamento').style.display = 'block';

        setTimeout(function() {
            fecharModalAgendamento();
            setTimeout(function() {
                document.getElementById('mensagem-agendamento').style.display = 'none';
            }, 1000);
        }, 3000);
    })
    .catch(error => {
        document.getElementById('mensagem-agendamento').innerText = 'Erro ao agendar. Tente novamente.';
        document.getElementById('mensagem-agendamento').style.display = 'block';
        console.error(error);
    });
};
  
  // Configurar data mínima para hoje
  const hoje = new Date();
  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
  const yyyy = hoje.getFullYear();
  
  const dataMinima = yyyy + '-' + mm + '-' + dd;
  document.getElementById('data').min = dataMinima;
});