const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxNGgUrjWwmT2YAO57GWtAHjjzYZKJaZgbCfF42cwxrWCb3zyQVDORrDuBSWk3r7UNa/exec';

// Elementos principais
const form = document.getElementById('clienteForm');
const successMessage = document.getElementById('successMessage');
const newVendaBtn = document.getElementById('newVendaBtn');



// Elementos do supervisor
const supervisorSelect = document.getElementById('supervisor');
const outroSupervisorInput = document.getElementById('outroSupervisor');
const supervisorError = document.getElementById('supervisor-error');

// Campos obrigatórios
const requiredFields = [
    { id: 'supervisor', errorId: 'supervisor-error' },
    { id: 'consultor', errorId: 'consultor-error' },
    { id: 'cliente', errorId: 'cliente-error' },
    { id: 'estabelecimento', errorId: 'estabelecimento-error' },
    { id: 'custId', errorId: 'custId-error' },
    { id: 'telefone', errorId: 'telefone-error' },
    { id: 'email', errorId: 'email-error' },
    { id: 'dataVenda', errorId: 'dataVenda-error' },
    { id: 'serial', errorId: 'serial-error' },
    { id: 'concorrencia', errorId: 'concorrencia-error' },
    { id: 'indicacaoTexto', errorId: 'indicacaoTexto-error' }
];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setupTelefoneMask();
    setupSupervisorSelect();
    setupFormValidation();
    setupDateField();
    setupNewVendaButton();
    setupTabs();
    setupClienteSearch();
    setupPosVendaForm();
    setupNewAtendimentoButton();
    
    document.getElementById('dataAtendimento').value = new Date().toISOString().split('T')[0];
});

// const indicacaoSwitch = document.getElementById('indicacaoSwitch');
// const indicacaoTexto  = document.getElementById('indicacaoTexto');

// indicacaoSwitch.addEventListener('change', () => {
//   if (indicacaoSwitch.checked) {
//     indicacaoSwitch.value = 'Sim';
//     indicacaoTexto.textContent = 'Sim';
//   } else {
//     indicacaoSwitch.value = 'Nao';
//     indicacaoTexto.textContent = 'Não';
//   }
// });

const indicacaoSwitch = document.getElementById('indicacaoSwitch');
const indicacaoTextoHidden = document.getElementById('indicacaoTexto');
const indicacaoTextoLabel = document.getElementById('indicacaoTextoLabel');

indicacaoSwitch.addEventListener('change', () => {
  if (indicacaoSwitch.checked) {
    indicacaoSwitch.value = 'Sim';
    indicacaoTextoHidden.value = 'Sim';
    indicacaoTextoLabel.textContent = 'Sim';
  } else {
    indicacaoSwitch.value = 'Nao';
    indicacaoTextoHidden.value = 'Nao';
    indicacaoTextoLabel.textContent = 'Não';
  }
});


// Configura máscara de telefone
function setupTelefoneMask() {
    const telefoneInput = document.getElementById('telefone');
    const telefoneError = document.getElementById('telefone-error');

    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        }
        
        e.target.value = value;
        
        // Validação
        if (value.length < 14) { 
            telefoneInput.style.borderColor = 'var(--error)';
            telefoneError.textContent = 'Telefone incompleto';
            telefoneError.style.display = 'block';
        } else {
            telefoneInput.style.borderColor = 'var(--border)';
            telefoneError.style.display = 'none';
        }
    });
}

// Configura o select de supervisor
function setupSupervisorSelect() {
    supervisorSelect.addEventListener('change', function() {
        if (this.value === 'Outro') {
            // Mostra o campo e faz ele ser obrigatório
            outroSupervisorInput.classList.remove('hidden');
            outroSupervisorInput.required = true;
            
            // Foca automaticamente no campo
            setTimeout(() => {
                outroSupervisorInput.focus();
            }, 100);
            
            // Limpa qualquer erro anterior
            supervisorError.textContent = '';
            supervisorError.style.display = 'none';
        } else {
            // Esconde o campo e remove a obrigatoriedade
            outroSupervisorInput.classList.add('hidden');
            outroSupervisorInput.required = false;
            outroSupervisorInput.value = '';
            
            // Garante que o erro some quando seleciona outra opção
            supervisorSelect.style.borderColor = 'var(--border)';
            supervisorError.style.display = 'none';
        }
    });

    // Validação em tempo real do campo "Outro"
    outroSupervisorInput.addEventListener('input', function() {
        if (supervisorSelect.value === 'Outro') {
            if (!this.value.trim()) {
                this.style.borderColor = 'var(--error)';
                supervisorError.textContent = 'Por favor, digite o nome do supervisor';
                supervisorError.style.display = 'block';
            } else {
                this.style.borderColor = 'var(--border)';
                supervisorError.style.display = 'none';
            }
        }
    });
}

// Configura validação do formulário
function setupFormValidation() {
    requiredFields.forEach(field => {
        if (field.id === 'supervisor') return;
        
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        input.addEventListener('input', function() {
            validateField(input, errorElement);
        });
    });

    // Validação especial para e-mail
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    
    emailInput.addEventListener('input', function() {
        validateEmailField(emailInput, emailError);
    });
}

// Valida um campo genérico
function validateField(input, errorElement) {
    if (!input.value.trim()) {
        input.style.borderColor = 'var(--error)';
        errorElement.textContent = 'Este campo é obrigatório';
        errorElement.style.display = 'block';
    } else {
        input.style.borderColor = 'var(--border)';
        errorElement.style.display = 'none';
    }
}

// Validação específica para e-mail
function validateEmailField(input, errorElement) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!input.value.trim()) {
        input.style.borderColor = 'var(--error)';
        errorElement.textContent = 'Este campo é obrigatório';
        errorElement.style.display = 'block';
    } else if (!emailRegex.test(input.value)) {
        input.style.borderColor = 'var(--error)';
        errorElement.textContent = 'Por favor, insira um e-mail válido';
        errorElement.style.display = 'block';
    } else {
        input.style.borderColor = 'var(--border)';
        errorElement.style.display = 'none';
    }
}

// Configura campo de data
function setupDateField() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataVenda').value = today;
}

// Configura botão de nova venda
function setupNewVendaButton() {
    newVendaBtn.addEventListener('click', function() {
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
    });
}

// Configura botão de novo atendimento
function setupNewAtendimentoButton() {
    document.getElementById('newAtendimentoBtn').addEventListener('click', function() {
        document.getElementById('successPosVenda').classList.add('hidden');
        document.getElementById('posVendaForm').classList.add('hidden');
        document.getElementById('clienteSearch').value = '';
        document.getElementById('resultadosBusca').style.display = 'none';
    });
}

// Validação completa do formulário
function validateForm() {
    let isValid = true;
    
    // Validação do supervisor
    if (supervisorSelect.value === 'Outro' && !outroSupervisorInput.value.trim()) {
        outroSupervisorInput.style.borderColor = 'var(--error)';
        supervisorError.textContent = 'Por favor, digite o nome do supervisor';
        supervisorError.style.display = 'block';
        isValid = false;
    } else if (!supervisorSelect.value) {
        supervisorSelect.style.borderColor = 'var(--error)';
        supervisorError.textContent = 'Por favor, selecione um supervisor';
        supervisorError.style.display = 'block';
        isValid = false;
    } else {
        supervisorSelect.style.borderColor = 'var(--border)';
        outroSupervisorInput.style.borderColor = 'var(--border)';
        supervisorError.style.display = 'none';
    }
    
    // Validação dos demais campos
    requiredFields.forEach(field => {
        if (field.id === 'supervisor') return;
        
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--error)';
            errorElement.textContent = 'Este campo é obrigatório';
            errorElement.style.display = 'block';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border)';
            errorElement.style.display = 'none';
        }
    });
    
    // Validação adicional para e-mail
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailInput.value.trim() && !emailRegex.test(emailInput.value)) {
        emailInput.style.borderColor = 'var(--error)';
        emailError.textContent = 'Por favor, insira um e-mail válido';
        emailError.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// Reseta o formulário
function resetForm() {
    form.reset();
    
    // Reset dos estilos de erro
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        input.style.borderColor = 'var(--border)';
        errorElement.style.display = 'none';
    });
    
    // Reset especial para supervisor
    supervisorSelect.selectedIndex = 0;
    outroSupervisorInput.classList.add('hidden');
    outroSupervisorInput.value = '';
    outroSupervisorInput.required = false;
    
    // Define a data atual
    setupDateField();
}

// Envia os dados para o Google Sheets
async function submitForm(data, tipo = 'venda') {
    try {
        // Adiciona o tipo aos dados
        data.tipo = tipo;
        
        if (data.supervisor === 'Outro') {
            data.supervisor = outroSupervisorInput.value.trim();
        }
        
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        
        return { status: "success" };
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        supervisor: supervisorSelect.value,
        consultor: document.getElementById('consultor').value.trim(),
        cliente: document.getElementById('cliente').value.trim(),
        estabelecimento: document.getElementById('estabelecimento').value.trim(),
        custId: document.getElementById('custId').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        email: document.getElementById('email').value.trim(),
        dataVenda: document.getElementById('dataVenda').value,
        serial: document.getElementById('serial').value.trim(),
        observacoes: document.getElementById('observacoes').value.trim(),
        concorrencia: document.getElementById('concorrencia').value.trim(),
        indicacaoTexto: indicacaoSwitch.checked ? 'Sim' : 'Nao'
    };
    
    // Carregando do botão de submit
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        await submitForm(formData, 'venda');
        
        // Mostrar os resultados do envio
        document.getElementById('success-details').innerHTML = `
            <strong>Venda registrada para:</strong><br>
            <strong>Cliente:</strong> ${formData.cliente}<br>
            <strong>Estabelecimento:</strong> ${formData.estabelecimento}<br>
            <strong>Concorrência:</strong> ${formData.concorrencia}<br>
            <strong>Cust ID:</strong> ${formData.custId}<br>
            <strong>Consultor:</strong> ${formData.consultor}<br>
            <strong>Supervisor:</strong> ${formData.supervisor}<br>
            <strong>Serial:</strong> ${formData.serial}<br>
            <strong>Data:</strong> ${new Date(formData.dataVenda).toLocaleDateString('pt-BR')}
        `;
        
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        resetForm();
    } catch (error) {
        alert('Erro ao registrar venda: ' + error.message);
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            if (tabId === 'clientes') {
                carregarListaClientes();
            }
        });
    });
}

// Busca de clientes para pós-venda
function setupClienteSearch() {
    const searchInput = document.getElementById('clienteSearch');
    const resultadosBusca = document.getElementById('resultadosBusca');
    
    searchInput.addEventListener('input', async function() {
        const termo = this.value.trim();
        
        if (termo.length < 3) {
            resultadosBusca.style.display = 'none';
            resultadosBusca.innerHTML = '';
            return;
        }
        
        try {
            console.log('Buscando cliente com termo:', termo);
            const response = await buscarClientes(termo);
            
            if (response.status === "success") {
                exibirResultadosBusca(response.data);
            } else {
                resultadosBusca.innerHTML = '<div class="search-result-item">Erro na busca: ' + response.message + '</div>';
                resultadosBusca.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            resultadosBusca.innerHTML = '<div class="search-result-item">Erro ao buscar clientes</div>';
            resultadosBusca.style.display = 'block';
        }
    });
    
    // Fechar resultados ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultadosBusca.contains(e.target)) {
            resultadosBusca.style.display = 'none';
        }
    });
}

async function buscarClientes(termo) {
    try {
        console.log('Fazendo requisição para:', `${WEB_APP_URL}?termo=${encodeURIComponent(termo)}`);
        
        const response = await fetch(`${WEB_APP_URL}?termo=${encodeURIComponent(termo)}`);
        
        if (!response.ok) {
            throw new Error('Erro na resposta: ' + response.status);
        }
        
        const data = await response.json();
        console.log('Resposta da busca:', data);
        return data;
        
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return {
            status: "error",
            message: error.toString()
        };
    }
}

function exibirResultadosBusca(clientes) {
    const resultadosBusca = document.getElementById('resultadosBusca');
    
    if (clientes.length === 0) {
        resultadosBusca.innerHTML = '<div class="search-result-item">Nenhum cliente encontrado</div>';
        resultadosBusca.style.display = 'block';
        return;
    }
    
    resultadosBusca.innerHTML = '';
    clientes.forEach(cliente => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.innerHTML = `
            <strong>${cliente.cliente}</strong> - ${cliente.estabelecimento}<br>
            <small>ID: ${cliente.custId} | Tel: ${cliente.telefone}</small>
        `;
        item.addEventListener('click', () => selecionarCliente(cliente));
        resultadosBusca.appendChild(item);
    });
    
    resultadosBusca.style.display = 'block';
}


function selecionarCliente(cliente) {
    // Preencher informações do cliente no formulário de pós-venda
    document.getElementById('clienteSelecionadoNome').querySelector('span').textContent = 
        `${cliente.cliente} - ${cliente.estabelecimento}`;
    
    // Armazenar ID do cliente para registro no histórico
    document.getElementById('posVendaForm').dataset.clienteId = cliente.id;
    document.getElementById('posVendaForm').dataset.clienteNome = cliente.cliente;
    document.getElementById('posVendaForm').dataset.estabelecimento = cliente.estabelecimento;
    
    // Esconder resultados de busca e mostrar formulário
    document.getElementById('resultadosBusca').style.display = 'none';
    document.getElementById('posVendaForm').classList.remove('hidden');
    
    // Configurar data atual para o atendimento
    document.getElementById('dataAtendimento').value = new Date().toISOString().split('T')[0];
}

// Formulário de pós-venda
function setupPosVendaForm() {
    const form = document.getElementById('posVendaForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            clienteId: form.dataset.clienteId,
            cliente: form.dataset.clienteNome,
            estabelecimento: form.dataset.estabelecimento,
            tipoAtendimento: document.getElementById('tipoAtendimento').value,
            dataAtendimento: document.getElementById('dataAtendimento').value,
            responsavelAtendimento: document.getElementById('responsavelAtendimento').value,
            descricaoAtendimento: document.getElementById('descricaoAtendimento').value,
            statusAtendimento: document.getElementById('statusAtendimento').value,
            proximoAtendimento: document.getElementById('proximoAtendimento').value || ''
        };
        
        // Carregando do botão de submit
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            await submitForm(formData, 'posvenda');
            
            // Mostrar mensagem de sucesso
            document.getElementById('success-pos-details').textContent = 
                `Atendimento registrado para ${formData.cliente} - ${formData.estabelecimento}`;
            
            form.classList.add('hidden');
            document.getElementById('successPosVenda').classList.remove('hidden');
            
            // Limpar formulário
            form.reset();
        } catch (error) {
            alert('Erro ao registrar atendimento: ' + error.message);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Carregar lista de clientes
async function carregarListaClientes() {
    try {
        // Buscar todos os clientes
        const clientes = await buscarClientes('');
        exibirListaClientes(clientes);
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        document.getElementById('listaClientes').innerHTML = '<div class="error">Erro ao carregar clientes</div>';
    }
}

function exibirListaClientes(clientes) {
    const listaClientes = document.getElementById('listaClientes');
    listaClientes.innerHTML = '';
    
    if (clientes.length === 0) {
        listaClientes.innerHTML = '<div class="no-data">Nenhum cliente cadastrado</div>';
        return;
    }
    
    clientes.forEach(cliente => {
        const card = document.createElement('div');
        card.className = 'cliente-card';
        card.innerHTML = `
            <div class="cliente-header">
                <div class="cliente-nome">${cliente.cliente}</div>
                <div class="cliente-data">Venda: ${new Date(cliente.dataVenda).toLocaleDateString('pt-BR')}</div>
            </div>
            <div class="cliente-info"><strong>Estabelecimento:</strong> ${cliente.estabelecimento}</div>
            <div class="cliente-info"><strong>Contato:</strong> ${cliente.telefone} | ${cliente.email}</div>
            <div class="cliente-info"><strong>Consultor:</strong> ${cliente.consultor} | <strong>Supervisor:</strong> ${cliente.supervisor}</div>
            <div class="cliente-info"><strong>Máquina:</strong> S/N ${cliente.serial}</div>
            <div class="cliente-info"><strong>Cust ID:</strong> ${cliente.custId}</div>
        `;
        
        listaClientes.appendChild(card);
    });
}

// Função auxiliar para converter data local
function parseLocalDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dateString);
}



