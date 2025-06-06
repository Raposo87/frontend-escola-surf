// Variáveis globais para guardar os dados da reserva
let precoSelecionado = 0;
let descricaoSelecionada = '';

// Função para abrir o modal de agendamento com os dados da aula
function abrirModalAgendamento(descricao, preco) {
  document.getElementById('reserva-titulo').textContent = descricao;
  document.getElementById('reserva-preco').textContent = `Preço: €${preco}`;
  precoSelecionado = preco;
  descricaoSelecionada = descricao;
  document.getElementById('modal-agendamento').style.display = 'flex';
}

// Função para fechar o modal de agendamento
function fecharModalAgendamento() {
  document.getElementById('modal-agendamento').style.display = 'none';
  document.getElementById('mensagem-agendamento').style.display = 'none';
  document.getElementById('form-agendamento').reset();
}

// Função para mostrar mensagem no modal
function mostrarMensagem(texto, tipo = 'info') {
  const mensagem = document.getElementById('mensagem-agendamento');
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
  // Adiciona evento aos botões de reservar
  const reservarBtns = document.querySelectorAll('.reservar-btn');
  reservarBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          const descricao = this.dataset.descricao;
          const preco = Number(this.dataset.preco);
          abrirModalAgendamento(descricao, preco);
      });
  });

  // Event listeners para fechar modal
  document.getElementById('fechar-modal').onclick = fecharModalAgendamento;

  window.onclick = function(event) {
      const modal = document.getElementById('modal-agendamento');
      if (event.target === modal) {
          fecharModalAgendamento();
      }
  };

  // Configurar data mínima para hoje
  const hoje = new Date();
  const dd = String(hoje.getDate()).padStart(2, '0');
  const mm = String(hoje.getMonth() + 1).padStart(2, '0');
  const yyyy = hoje.getFullYear();
  const dataMinima = yyyy + '-' + mm + '-' + dd;
  document.getElementById('data').min = dataMinima;

  // FORMULÁRIO DE AGENDAMENTO CORRIGIDO
document.getElementById('form-agendamento').addEventListener('submit', function(e) {
    e.preventDefault();
  
    // Validar campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const data_agendamento = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;
  
    // Validação melhorada
    if (!nome || nome.length < 3) {
      mostrarMensagem('Nome deve ter pelo menos 3 caracteres', 'error');
      return;
    }
  
    if (!email) {
      mostrarMensagem('Por favor, insira um email válido', 'error');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarMensagem('Por favor, insira um email válido', 'error');
      return;
    }
  
    if (!data_agendamento || !horario) {
      mostrarMensagem('Por favor, selecione data e horário', 'error');
      return;
    }

    // Desabilitar botão durante o processamento
    const submitBtn = this.querySelector('button[type="submit"]');
    const textoOriginal = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processando...';

    // Dados para enviar
    const dadosAgendamento = {
      nome,
      email,
      data_agendamento,
      horario,
      preco: precoSelecionado,
      descricao: descricaoSelecionada
    };

    console.log('Enviando dados:', dadosAgendamento);

    // Fazer requisição para o backend
    fetch('https://site-escola-surf-production.up.railway.app/criar-sessao-pagamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAgendamento)
    })
    .then(response => {
      console.log('Status da resposta:', response.status);
      return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        
        if (data.url) {
            // Salvar dados localmente para debug
            sessionStorage.setItem('ultimaReserva', JSON.stringify(dadosAgendamento));
            
            // Redirecionar para checkout
            window.location.href = data.url;
        } else {
            mostrarMensagem('Erro ao iniciar pagamento. Tente novamente.', 'error');
            console.error('Resposta sem URL:', data);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        mostrarMensagem('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
    })
    .finally(() => {
        // Reabilitar botão
        submitBtn.disabled = false;
        submitBtn.textContent = textoOriginal;
    });
  });

  // Verificar se voltou de um pagamento (para debug)
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  
  if (sessionId) {
    console.log('Session ID detectado:', sessionId);
    // Opcional: verificar status do pagamento
    verificarStatusPagamento(sessionId);
  }
});

// Função para verificar status do pagamento (opcional para debug)
function verificarStatusPagamento(sessionId) {
  fetch(`https://site-escola-surf-production.up.railway.app/verificar-pagamento/${sessionId}`)
    .then(response => response.json())
    .then(data => {
      console.log('Status do pagamento:', data);
    })
    .catch(error => {
      console.error('Erro ao verificar pagamento:', error);
    });
}