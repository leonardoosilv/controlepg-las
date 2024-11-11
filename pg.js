import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm'

// URL e chave pública do Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdGx5ZW54bGtlZ2J3b2FsaWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMDg2MzUsImV4cCI6MjA0Njc4NDYzNX0.kku-h687kIvvfAWycDE1OxT6TValyBSJbxxGpeXk4l4'; 
const supabaseUrl = 'https://iltlyenxlkegbwoalihn.supabase.co'
// Criação correta do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey)

console.log(supabase); // Verifica se o cliente foi criado corretamente

// Função para carregar os dias de jogo do Supabase
async function carregarDiasDeJogo() {
    // Consultar todos os dias de jogo da tabela 'game_days'
    const { data, error } = await supabase
        .from('game_days')  // Nome da tabela no Supabase
        .select('*');  // Selecionar todos os campos

    if (error) {
        console.error('Erro ao carregar os dias de jogo:', error);
        return;
    }

    // Verificar a estrutura dos dados retornados
    console.log('Estrutura completa dos dados retornados do Supabase:', data);
    
    // Preencher o select de "Dia de Jogo" e a lista de dias de jogo
    const gameDayListSelect = document.getElementById('game-day-list');
    const gameDaysList = document.getElementById('game-days-list');
    const gameDaySelect = document.getElementById('game-day');

    // Limpar as opções antes de adicionar as novas
    gameDayListSelect.innerHTML = '';
    gameDaysList.innerHTML = '';
    gameDaySelect.innerHTML = '';

    // Adicionar a opção padrão novamente antes de adicionar as novas opções
    const defaultOptionGameDayList = document.createElement('option');
    defaultOptionGameDayList.value = '';
    defaultOptionGameDayList.textContent = 'Jogo do dia';
    gameDayListSelect.appendChild(defaultOptionGameDayList);

    const defaultOptionGameDay = document.createElement('option');
    defaultOptionGameDay.value = '';
    defaultOptionGameDay.textContent = 'Selecione o Dia do Jogo';
    gameDaySelect.appendChild(defaultOptionGameDay);

    // Adicionar as opções para cada dia de jogo retornado do Supabase
    data.forEach(gameDay => {
        // Verifique o que está sendo retornado
        console.log(`Dia de Jogo: ${gameDay.name}, Data: ${gameDay.date}`);
        const dayName = gameDay.day_name || 'Nome não disponível';  // Agora usando 'day_name'
        const formattedDate = formatDate(gameDay.date); // Formatar a data no formato DD-MM-YYYY

        // Criar uma nova opção para o dia de jogo no select
        const newOptionGameDay = document.createElement('option');
        newOptionGameDay.value = gameDay.date;  // Usar a data como valor
        newOptionGameDay.textContent = `${dayName} - ${formattedDate}`;
        gameDayListSelect.appendChild(newOptionGameDay);

        // Criar um novo item de lista para o dia de jogo
        const newDayItem = document.createElement('li');
        newDayItem.textContent = `${dayName} - ${formattedDate}`;
        newDayItem.setAttribute('data-date', gameDay.date);  // Atribuir a data ao item
        gameDaysList.appendChild(newDayItem);

        // Criar uma nova opção para o select de dias de jogo
        const newOption = document.createElement('option');
        newOption.value = gameDay.date;
        newOption.textContent = `${dayName} - ${formattedDate}`;
        gameDaySelect.appendChild(newOption);

        // Criar a tabela dinâmica para o novo dia de jogo
        const dynamicTables = document.getElementById('dynamic-tables');
        const newTable = document.createElement('div');
        newTable.innerHTML = `
            <h2 id="title-${gameDay.date}">${dayName} - ${formattedDate}</h2>
            <table id="table-${gameDay.date}">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div id="total-${gameDay.date}" class="total">Total Pago: R$ 0,00</div>
        `;
        dynamicTables.appendChild(newTable);
    });

    // Se você deseja aplicar filtros ou outras ações após carregar os dados, pode chamá-las aqui
    filtrarJogos(); // Aplica qualquer filtro existente
}

// Chamar a função para carregar os dias de jogo ao carregar a página
window.onload = carregarDiasDeJogo;  // Ou use document.addEventListener('DOMContentLoaded', carregarDiasDeJogo);

async function loadGameDaysAndGuests() {
    // Buscar os dias de jogo
    const { data: gameDays, error: gameDaysError } = await supabase
        .from('game_days')  // Nome da tabela no Supabase
        .select('*');

    if (gameDaysError) {
        console.error('Erro ao carregar dias de jogo:', gameDaysError);
        return;
    }

    // Preencher o select de dias de jogo
    const gameDaySelect = document.getElementById('game-day-list');
    gameDays.forEach(game => {
        const option = document.createElement('option');
        option.value = game.id;  // Supondo que 'id' seja o identificador único
        option.textContent = `${game.day_name} - ${game.date}`;
        gameDaySelect.appendChild(option);
    });

    // Buscar os convidados
    const { data: guests, error: guestsError } = await supabase
        .from('guests')  // Nome da tabela de convidados no Supabase
        .select('*');

    if (guestsError) {
        console.error('Erro ao carregar convidados:', guestsError);
        return;
    }

    // Preencher as tabelas de pagamento
    guests.forEach(guest => {
        const tableBody = document.querySelector(`#table-${guest.game_day_id} tbody`);
        if (tableBody) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${guest.name}</td>
                <td>R$ ${guest.amount_paid.toFixed(2).replace('.', ',')}</td>
                <td>${guest.status}</td>
                <td>
                    <button onclick="editarStatus('${guest.id}', '${guest.status}')">Editar Status</button>
                    <button onclick="excluirConvidado(${guest.id})">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </td>
            `;
            tableBody.appendChild(newRow);
        }
    });
}

// Evento para adicionar um novo convidado
document.getElementById('add-guest-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Evitar o comportamento padrão do formulário

    const guestName = document.getElementById('guest-name').value.trim(); // Nome do convidado
    const amountPaid = document.getElementById('amount-paid').value.trim(); // Valor pago
    const status = document.getElementById('status-select').value; // Status de pagamento
    const gameDay = document.getElementById('game-day').value; // Dia do jogo selecionado

    // Verificar se todos os campos estão preenchidos corretamente
    if (!guestName || !amountPaid || !status || !gameDay) {
        showFeedback('Por favor, preencha todos os campos.', 'error');
        return;
    }

    // Verificar se o nome do convidado já existe para o dia de jogo
    if (nomeConvidadoExiste(guestName, gameDay)) {
        showFeedback('Já existe um convidado com esse nome para o dia do jogo selecionado.', 'error');
        return;
    }

    // Verificar se o valor pago é um número válido e maior que zero
    const amountPaidNumber = parseFloat(amountPaid.replace(',', '.')); // Convertendo vírgula para ponto
    if (isNaN(amountPaidNumber) || amountPaidNumber <= 0) {
        showFeedback('Por favor, insira um valor válido para o pagamento (maior que zero).', 'error');
        return;
    }

    // Buscar o game_day_id com base no nome ou valor de gameDay
    const { data: gameDayData, error: gameDayError } = await supabase
        .from('game_days')
        .select('id')
        .eq('name', gameDay) // Supondo que você tenha um campo 'name' em 'game_days'
        .single(); // Pega um único resultado

    if (gameDayError) {
        showFeedback('Erro ao buscar o dia de jogo no banco de dados.', 'error');
        console.error(gameDayError);
        return;
    }

    // Se o dia do jogo não for encontrado
    if (!gameDayData) {
        showFeedback('Dia de jogo não encontrado.', 'error');
        return;
    }

    const gameDayId = gameDayData.id; // ID do dia de jogo

    // Inserir os dados do convidado no Supabase
    const { data, error } = await supabase
        .from('guests')  // Tabela 'guests'
        .insert([
            {
                name: guestName,
                amount_paid: amountPaidNumber,
                status: status,
                game_day_id: gameDayId  // Associando o convidado ao dia de jogo via game_day_id
            }
        ]);

    if (error) {
        showFeedback('Erro ao adicionar convidado ao banco de dados.', 'error');
        console.error(error);
    } else {
        // Se a inserção for bem-sucedida, atualize a tabela no HTML
        const tableBody = document.querySelector(`#table-${gameDayId} tbody`);
        if (!tableBody) return;

        // Criar uma nova linha na tabela com os dados do convidado
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${guestName}</td>
            <td>R$ ${amountPaidNumber.toFixed(2).replace('.', ',')}</td>
            <td id="status-${guestName}-${gameDayId}">${status}</td>
            <td>
                <button onclick="editarStatus('${guestName}-${gameDayId}', '${status}', '${gameDayId}')">Editar Status</button>
                <button onclick="excluirConvidado('${guestName}', '${gameDayId}')">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </td>
        `;
        tableBody.appendChild(newRow);

        // Atualizar o total de valores pagos
        atualizarTotal(gameDayId);

        // Exibir mensagem de sucesso e limpar o formulário
        showFeedback('Convidado adicionado com sucesso!', 'success');
        document.getElementById('add-guest-form').reset(); // Resetar o formulário

        // Atualizar a tabela considerando o filtro de status ativo
        filtrarPagamentosPorStatus();
    }
});

async function excluirConvidado(guestId, gameDayId) {
    // Confirmar exclusão
    const { error } = await supabase
        .from('guests')
        .delete()
        .match({ id: guestId });

    if (error) {
        console.error('Erro ao excluir convidado:', error);
        return;
    }

    // Atualizar a UI
    const tableBody = document.querySelector(`#table-${gameDayId} tbody`);
    const rowToRemove = document.querySelector(`#table-${gameDayId} tbody tr[data-id="${guestId}"]`);
    if (rowToRemove) {
        rowToRemove.remove();
    }

    // Atualizar o total de valores pagos
    atualizarTotal(gameDayId);

    showFeedback('Convidado excluído com sucesso!', 'success');
}

   let gameDays = {};// Objeto para armazenar os dias de jogo

    // Função para formatar a data no formato DD-MM-YYYY
    function formatDate(date) {
        const [year, month, day] = date.split('-'); // Extrai os componentes da data no formato YYYY-MM-DD
        return `${day}-${month}-${year}`; // Retorna no formato DD-MM-YYYY
    }

    // Função para filtrar os dias de jogos com base no mês e ano e dia selecionado
    function filtrarJogos() {
        const month = document.getElementById('filter-month').value;
        const year = document.getElementById('filter-year').value;
        const gameDaysList = document.querySelectorAll('#game-days-list li');// Lista de dias de jogos
        const gameDaySelect = document.getElementById('game-day-list');    // Seletor de Dia de Jogo
        const selectedGameDay = gameDaySelect.value; // Dia de jogo selecionado

        gameDaysList.forEach(gameDay => {
            const gameDate = new Date(gameDay.getAttribute('data-date'));// Data armazenada no atributo 'data-date'

            // Formatando a data selecionada e comparando
            const formattedSelectedGameDay = selectedGameDay ? new Date(selectedGameDay) : null;

            // Verificação de mês e ano
            const matchMonth = month ? gameDate.getMonth() + 1 === parseInt(month) : true;
            const matchYear = year ? gameDate.getFullYear() === parseInt(year) : true;

            // Verificar se o dia selecionado corresponde ao dia do jogo
            const matchDay = selectedGameDay ? gameDate.toISOString().split('T')[0] === formattedSelectedGameDay.toISOString().split('T')[0] : true;

            const titleId = `title-${gameDay.getAttribute('data-date')}`;  // Id do título correspondente a esse dia
            const tableId = `table-${gameDay.getAttribute('data-date')}`;  // Id da tabela correspondente a esse dia
            const totalId = `total-${gameDay.getAttribute('data-date')}`;  // Id do valor total correspondente a esse dia

            // Exibe ou oculta o dia de jogo conforme o filtro
            if (matchMonth && matchYear && matchDay) {
                gameDay.style.display = '';
                document.getElementById(titleId).style.display = '';
                document.getElementById(tableId).style.display = '';
                document.getElementById(totalId).style.display = '';
            } else {
                gameDay.style.display = 'none';
                document.getElementById(titleId).style.display = 'none';
                document.getElementById(tableId).style.display = 'none';
                document.getElementById(totalId).style.display = 'none';
            }
        });
    }

    // Chamada da função para aplicar o filtro quando o mês, ano ou dia de jogo for alterado
    document.getElementById('filter-month').addEventListener('change', filtrarJogos);
    document.getElementById('filter-year').addEventListener('change', filtrarJogos);
    document.getElementById('game-day-list').addEventListener('change', filtrarJogos);

    // Evento que adiciona um novo dia de jogo
    document.getElementById('add-game-day-form').addEventListener('submit', async function(e) {
        e.preventDefault();// Evitar o comportamento padrão do formulário

        const dayName = document.getElementById('game-day-name').value;// Nome do dia da semana
        const dayDate = document.getElementById('game-day-date').value;// Data do dia do jogo
        const dayId = dayDate; // Usando a data como ID
        const formattedDate = formatDate(dayDate);// Formatação da data  

        // Criar uma nova opção para o dia de jogo no select
        const gameDayListSelect = document.getElementById('game-day-list'); // Lista de Dia de Jogo
        const newOptionGameDay = document.createElement('option');
        newOptionGameDay.value = dayDate;
        newOptionGameDay.textContent = `${dayName} - ${formattedDate}`;
        gameDayListSelect.appendChild(newOptionGameDay);

        // Criar um novo item de lista para o dia de jogo
        const gameDaysList = document.getElementById('game-days-list');
        const newDayItem = document.createElement('li');
        newDayItem.textContent = `${dayName} - ${formattedDate}`;
        newDayItem.setAttribute('data-date', dayDate);// Atribuindo a data ao item
        gameDaysList.appendChild(newDayItem);

        // Adicionando a nova data ao select de dias de jogo
        const gameDaySelect = document.getElementById('game-day');
        const newOption = document.createElement('option');
        newOption.value = dayDate;
        newOption.textContent = newDayItem.textContent;
        gameDaySelect.appendChild(newOption);

        // Criar a tabela dinâmica para o novo dia de jogo
        const dynamicTables = document.getElementById('dynamic-tables');
        const newTable = document.createElement('div');
        newTable.innerHTML = `
            <h2 id="title-${dayDate}">${dayName} - ${formattedDate}</h2>
            <table id="table-${dayDate}">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div id="total-${dayDate}" class="total">Total Pago: R$ 0,00</div>
        `;
        dynamicTables.appendChild(newTable);

        // Enviar dados para o banco de dados no Supabase
    const { data, error } = await supabase
        .from('game_days')  // Nome da tabela no Supabase
        .insert([
            { 
                day_name: dayName,  // Nome do dia de jogo
                date: dayDate,  // Data do dia de jogo
            }
        ]);

    // Verificar se houve algum erro ao inserir no banco de dados
    if (error) {
        console.error('Erro ao adicionar dia de jogo no Supabase:', error);
        showFeedback('Erro ao adicionar dia de jogo!', 'error');
    } else {
        // Mostrar mensagem de sucesso
        showFeedback('Dia de jogo adicionado com sucesso!', 'success');
    }
        
        // Filtrar jogos novamente após adicionar um novo
        filtrarJogos();
        document.getElementById('add-game-day-form').reset();// Resetar o formulário de adicionar dia
        
        // Limpar o formulário
        clearForm('add-game-day-form');
    });

    // Função para filtrar os pagamentos por status em todas as tabelas visíveis
    function filtrarPagamentosPorStatus() {
        const selectedStatus = document.getElementById('filter-status').value; // Status selecionado
        const allGameDays = document.querySelectorAll('#game-days-list li'); // Lista de todos os dias de jogo visíveis

        // Iterar sobre todos os dias de jogo visíveis
        allGameDays.forEach(gameDay => {
            const gameDate = gameDay.getAttribute('data-date'); // Data associada ao dia de jogo
            const tableBody = document.querySelector(`#table-${gameDate} tbody`); // Corpo da tabela para o dia de jogo específico
            const rows = Array.from(tableBody.rows); // Todas as linhas da tabela

            let totalPago = 0;

            // Iterar sobre as linhas da tabela e filtrar com base no status
            rows.forEach(row => {
                const statusCell = row.cells[2].textContent; // Status da célula da linha

                if (selectedStatus === 'todos' || statusCell === selectedStatus) {
                    row.style.display = ''; // Mostrar a linha
                    if (statusCell === 'Pago') {
                        totalPago += parseFloat(row.cells[1].textContent.replace('R$ ', '').replace(',', '.')); // Somar o valor pago
                    }
                } else {
                    row.style.display = 'none'; // Ocultar a linha
                }
            });

            // Atualizar o total pago para o dia de jogo
            const totalElement = document.getElementById(`total-${gameDate}`);
            totalElement.textContent = `Total Pago: R$ ${totalPago.toFixed(2).replace('.', ',')}`;
        });
    }
/*
    // Evento para adicionar um novo convidado
    document.getElementById('add-guest-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Evitar o comportamento padrão do formulário

        const guestName = document.getElementById('guest-name').value.trim(); // Nome do convidado
        const amountPaid = document.getElementById('amount-paid').value.trim(); // Valor pago
        const status = document.getElementById('status-select').value; // Status de pagamento
        const gameDay = document.getElementById('game-day').value; // Dia do jogo selecionado

        // Verificar se todos os campos estão preenchidos corretamente
        if (!guestName || !amountPaid || !status || !gameDay) {
            showFeedback('Por favor, preencha todos os campos.', 'error');
            return;
        }

        // Verificar se o nome do convidado já existe para o dia de jogo
        if (nomeConvidadoExiste(guestName, gameDay)) {
            showFeedback('Já existe um convidado com esse nome para o dia do jogo selecionado.', 'error');
            return;
        }

        // Verificar se o valor pago é um número válido e maior que zero
        const amountPaidNumber = parseFloat(amountPaid.replace(',', '.')); // Convertendo vírgula para ponto
        if (isNaN(amountPaidNumber) || amountPaidNumber <= 0) {
            showFeedback('Por favor, insira um valor válido para o pagamento (maior que zero).', 'error');
            return;
        }

        // Se todas as validações passarem, adicionar o convidado à tabela
        const tableBody = document.querySelector(`#table-${gameDay} tbody`);
        if (!tableBody) return;

        // Criar uma nova linha na tabela com os dados do convidado
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${guestName}</td>
            <td>R$ ${amountPaidNumber.toFixed(2).replace('.', ',')}</td>
            <td id="status-${guestName}-${gameDay}">${status}</td>
            <td>
                <button onclick="editarStatus('${guestName}-${gameDay}', '${status}', '${gameDay}')">Editar Status</button>
                <button onclick="excluirConvidado('${guestName}', '${gameDay}')">
                    <i class="fas fa-trash-alt"></i> Excluir
                </button>
            </td>
        `;
        tableBody.appendChild(newRow);

        // Atualizar o total de valores pagos
        atualizarTotal(gameDay);

        // Exibir mensagem de sucesso e limpar o formulário
        showFeedback('Convidado adicionado com sucesso!', 'success');
        document.getElementById('add-guest-form').reset(); // Resetar o formulário

        // Atualizar a tabela considerando o filtro de status ativo
        filtrarPagamentosPorStatus();
    });
*/
    // Função para verificar se o nome do convidado já existe para o dia do jogo
    function nomeConvidadoExiste(guestName, gameDay) {
        const tableBody = document.querySelector(`#table-${gameDay} tbody`);
        if (!tableBody) return false;

        // Verificar se o nome do convidado já está presente na tabela para o dia de jogo
        const rows = tableBody.rows;
        for (let i = 0; i < rows.length; i++) {
            const rowName = rows[i].cells[0].textContent.trim();
            if (rowName === guestName) {
                return true; // Nome já existe na lista
            }
        }
        return false; // Nome não encontrado
    }

    // Função para exibir o feedback
    function showFeedback(message, type) {
        const feedbackMessage = document.getElementById('feedback-message');
        feedbackMessage.textContent = message;
        feedbackMessage.classList.remove('feedback-success', 'feedback-error');
        feedbackMessage.classList.add(type === 'success' ? 'feedback-success' : 'feedback-error');
        feedbackMessage.style.display = 'block';

        setTimeout(function() {
            feedbackMessage.style.display = 'none';
        }, 3000);  // Feedback desaparece após 3 segundos
    }

    // Função para limpar os formulários
    function clearForm(formId) {
        const form = document.getElementById(formId);
        form.reset();
    }

    // Função para editar o status do convidado
    function editarStatus(guestId, previousStatus, gameDay) {
        const statusCell = document.getElementById(`status-${guestId}`);
        const selectStatus = document.createElement('select');
        selectStatus.innerHTML = `
            <option value="Pago" ${previousStatus === 'Pago' ? 'selected' : ''}>Pago</option>
            <option value="Não Pago" ${previousStatus === 'Não Pago' ? 'selected' : ''}>Não Pago</option>
        `;

        // Criar o botão de confirmação para alterar o status
        const confirmButton = document.createElement('button');
        confirmButton.innerText = 'Confirmar';
        confirmButton.onclick = () => {
            const newStatus = selectStatus.value;
            statusCell.innerText = newStatus;
            atualizarTotal(gameDay);// Atualiza o total após a alteração de status
        };

        statusCell.innerHTML = '';
        statusCell.appendChild(selectStatus);
        statusCell.appendChild(confirmButton);
    }

    // Função para filtrar os pagamentos por status
    function filtrarPorStatus(dayDate) {
        const selectedStatus = document.getElementById(`filter-status-${dayDate}`).value; // Status selecionado
        const tableBody = document.querySelector(`#table-${dayDate} tbody`);
        const rows = Array.from(tableBody.rows); // Todas as linhas da tabela

        let totalPago = 0;

        // Filtrar as linhas com base no status
        rows.forEach(row => {
            const status = row.cells[2].textContent; // Status de pagamento na linha

            if (selectedStatus === 'todos' || status === selectedStatus) {
                row.style.display = ''; // Mostrar a linha
                if (status === 'Pago') {
                    totalPago += parseFloat(row.cells[1].textContent.replace('R$ ', '').replace(',', '.')); // Soma total pago
                }
            } else {
                row.style.display = 'none'; // Ocultar a linha
            }
        });

        // Atualizar o total de pagamentos
        const totalElement = document.getElementById(`total-${dayDate}`);
        totalElement.textContent = `Total Pago: R$ ${totalPago.toFixed(2).replace('.', ',')}`;
    }

    // Função para atualizar o total pago para um dia de jogo
    function atualizarTotal(gameDay) {
        const tableBody = document.querySelector(`#table-${gameDay} tbody`);
        let totalPago = 0;

        // Iterar sobre as linhas da tabela e somar os valores pagos
        Array.from(tableBody.rows).forEach(row => {
            const amountPaid = parseFloat(row.cells[1].textContent.replace('R$ ', '').replace(',', '.'));
            const statusCell = row.cells[2].textContent;

            if (statusCell === "Pago") {
                totalPago += amountPaid;
            }
        });

        // Atualizar o total exibido na tela
        const totalElement = document.getElementById(`total-${gameDay}`);
        totalElement.textContent = `Total Pago: R$ ${totalPago.toFixed(2).replace('.', ',')}`;
    }
    
    let deleteGuestName, deleteGameDay; // Variáveis para armazenar nome e dia do jogo do convidado que será excluído
/*
    // Função para excluir o convidado
    function excluirConvidado(guestName, gameDay) {
        // Armazenar as informações para usar após a confirmação
        deleteGuestName = guestName;
        deleteGameDay = gameDay;

        // Exibir o modal de confirmação
        const modal = document.getElementById('confirmation-modal');
        modal.style.display = 'flex';  // Exibir o modal
    }

    // Evento para confirmar a exclusão
    document.getElementById('confirm-delete').addEventListener('click', function() {
        if (deleteGuestName && deleteGameDay) {
            // Encontrar a linha (tr) mais próxima do botão de exclusão
            const tableBody = document.querySelector(`#table-${deleteGameDay} tbody`);
            const rows = Array.from(tableBody.rows);  // Convertendo as linhas da tabela em um array

            // Iterar pelas linhas para encontrar o convidado que será excluído
            for (let row of rows) {
                const guestCell = row.cells[0];  // Primeira célula (nome do convidado)
                if (guestCell.textContent.trim() === deleteGuestName) {
                    row.remove();  // Remover a linha correspondente ao convidado
                    break;
                }
            }

            // Atualizar o total de valores pagos após a remoção da linha
            atualizarTotal(deleteGameDay);

            // Exibir feedback positivo
            showFeedback('Convidado excluído com sucesso!', 'success');
        }

        // Fechar o modal após a confirmação
        document.getElementById('confirmation-modal').style.display = 'none';
    });

    // Evento para cancelar a exclusão
    document.getElementById('cancel-delete').addEventListener('click', function() {
        // Fechar o modal sem excluir nada
        document.getElementById('confirmation-modal').style.display = 'none';
    });
*/
