const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbw_5omhosoGUAa5cVDkkb-4j57og4ARO43SQ5UI_V_uEuYFHOR6auT_5vsunlENB7As/exec';
// https://script.google.com/macros/s/AKfycbw4o4TO0vUcv-T7t3RmirpvAjJrBT-2A8v_NF7V_0cqaJ2w_L_PIM_ov6LOnLwHleu9/exec
// Elementos principais
const form = document.getElementById('clienteForm');
const successMessage = document.getElementById('successMessage');
const newVendaBtn = document.getElementById('newVendaBtn');

// Elementos do supervisor
const supervisorSelect = document.getElementById('supervisor');
const outroSupervisorInput = document.getElementById('outroSupervisor');
const supervisorError = document.getElementById('supervisor-error');

const ramoSelect = document.getElementById('ramo');
const outroRamoInput = document.getElementById('outroRamo');
const ramoError = document.getElementById('ramo-error');

// Switch de indicação MELI
// const indicacaoSwitch = document.getElementById('indicacaoSwitch');
// const indicacaoTextoHidden = document.getElementById('indicacaoTexto');
// const indicacaoTextoLabel = document.getElementById('indicacaoTextoLabel');

// Campos obrigatórios
const requiredFields = [
    { id: 'supervisor', errorId: 'supervisor-error' },
    { id: 'consultor', errorId: 'consultor-error' },
    { id: 'cliente', errorId: 'cliente-error' },
    { id: 'estabelecimento', errorId: 'estabelecimento-error' },
    { id: 'custId', errorId: 'custId-error' },
    { id: 'telefone', errorId: 'telefone-error' },
    { id: 'cnpjCpf', errorId: 'cnpjCpf-error' },
    // { id: 'cnpjCpfIndicacao', errorId: 'cnpjCpfIndicacao-error' },
    { id: 'email', errorId: 'email-error' },
    { id: 'dataVenda', errorId: 'dataVenda-error' },
    { id: 'serial', errorId: 'serial-error' },
    { id: 'concorrencia', errorId: 'concorrencia-error' },
    // { id: 'indicacaoTexto', errorId: 'indicacaoTexto-error' },
    { id: 'faturamentoPrometido', errorId: 'faturamentoPrometido-error' }
];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setupTelefoneMask();
    setupSupervisorSelect();
    setupRamoSelect();
    setupFormValidation();
    setupDateField();
    setupNewVendaButton();
    setupTabs();
    setupClienteSearch();
    setupPosVendaForm();
    setupNewAtendimentoButton();
    setupIndicacaoTab(); 
    // setupIndicacaoSwitch();
    
    document.getElementById('dataAtendimento').value = new Date().toISOString().split('T')[0];
});

// Configuração do switch de indicação MELI
// function setupIndicacaoSwitch() {
//     indicacaoSwitch.addEventListener('change', () => {
//         if (indicacaoSwitch.checked) {
//             indicacaoSwitch.value = 'Sim';
//             indicacaoTextoHidden.value = 'Sim';
//             indicacaoTextoLabel.textContent = 'Sim';
//         } else {
//             indicacaoSwitch.value = 'Nao';
//             indicacaoTextoHidden.value = 'Nao';
//             indicacaoTextoLabel.textContent = 'Não';
//         }
//     });
// }

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

function setupSupervisorSelect() {
    supervisorSelect.addEventListener('change', function() {
        if (this.value === 'Outro') {
            outroSupervisorInput.classList.remove('hidden');
            outroSupervisorInput.required = true;
            
            setTimeout(() => {
                outroSupervisorInput.focus();
            }, 100);
            
            supervisorError.textContent = '';
            supervisorError.style.display = 'none';
        } else {
            outroSupervisorInput.classList.add('hidden');
            outroSupervisorInput.required = false;
            outroSupervisorInput.value = '';
            
            supervisorSelect.style.borderColor = 'var(--border)';
            supervisorError.style.display = 'none';
        }
    });

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

function formatarCNPJCPF(cnpjCpf) {
    // Remove tudo que não for número
    const numeros = cnpjCpf.replace(/\D/g, '');
    
    // Formata como CPF se tiver 11 dígitos
    if (numeros.length === 11) {
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    // Formata como CNPJ se tiver 14 dígitos
    if (numeros.length === 14) {
        return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    // Retorna os números sem formatação se não for 11 ou 14 dígitos
    return numeros;
}

document.addEventListener('DOMContentLoaded', function() {
    const cnpjCpfInput = document.getElementById('cnpjCpf');
    
    if (cnpjCpfInput) {
        cnpjCpfInput.addEventListener('input', function(e) {
            // Obtém o valor atual e aplica a formatação
            const valorFormatado = formatarCNPJCPF(e.target.value);
            
            // Atualiza o valor do campo mantendo a posição do cursor
            const cursorPos = e.target.selectionStart;
            e.target.value = valorFormatado;
            
            // Ajusta a posição do cursor para após os caracteres adicionados
            const newCursorPos = cursorPos + (valorFormatado.length - e.target.value.length);
            e.target.setSelectionRange(newCursorPos, newCursorPos);
        });
        
        // Validação do CNPJ/CPF
        cnpjCpfInput.addEventListener('blur', function() {
            const valor = this.value.replace(/\D/g, '');
            const errorElement = document.getElementById('cnpjCpf-error');
            
            if (valor.length === 11 || valor.length === 14) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            } else {
                errorElement.textContent = 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido';
                errorElement.classList.add('show');
            }
        });
    }
});

function formatarCNPJCPFIndicacao(cnpjCpf) {
    // Remove tudo que não for número
    const numeros = cnpjCpf.replace(/\D/g, '');
    
    // Formata como CPF se tiver 11 dígitos
    if (numeros.length === 11) {
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    // Formata como CNPJ se tiver 14 dígitos
    if (numeros.length === 14) {
        return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    // Retorna os números sem formatação se não for 11 ou 14 dígitos
    return numeros;
}


// Adicione este evento listener para o campo CNPJ/CPF
document.addEventListener('DOMContentLoaded', function() {
    const cnpjCpfIndicacaoInput = document.getElementById('cnpjCpfIndicacao');
    
    if (cnpjCpfIndicacaoInput) {
        cnpjCpfIndicacaoInput.addEventListener('input', function(e) {
            // Obtém o valor atual e aplica a formatação
            const valorFormatado = formatarcnpjCpfIndicacao(e.target.value);
            
            // Atualiza o valor do campo mantendo a posição do cursor
            const cursorPos = e.target.selectionStart;
            e.target.value = valorFormatado;
            
            // Ajusta a posição do cursor para após os caracteres adicionados
            const newCursorPos = cursorPos + (valorFormatado.length - e.target.value.length);
            e.target.setSelectionRange(newCursorPos, newCursorPos);
        });
        
        // Validação do CNPJ/CPF
        cnpjCpfIndicacaoInput.addEventListener('blur', function() {
            const valor = this.value.replace(/\D/g, '');
            const errorElement = document.getElementById('cnpjCpfIndicacao-error');
            
            if (valor.length === 11 || valor.length === 14) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            } else {
                errorElement.textContent = 'Digite um CPF (11 dígitos) ou CNPJ (14 dígitos) válido';
                errorElement.classList.add('show');
            }
        });
    }
});

function setupRamoSelect() {
    ramoSelect.addEventListener('change', function() {
        if (this.value === 'Outro') {
            outroRamoInput.classList.remove('hidden');
            outroRamoInput.required = true;
            
            setTimeout(() => {
                outroRamoInput.focus();
            }, 100);
            
            ramoError.textContent = '';
            ramoError.style.display = 'none';
        } else {
            outroRamoInput.classList.add('hidden');
            outroRamoInput.required = false;
            outroRamoInput.value = '';
            
            ramoSelect.style.borderColor = 'var(--border)';
            ramoError.style.display = 'none';
        }
    });

    outroRamoInput.addEventListener('input', function() {
        if (ramoSelect.value === 'Outro') {
            if (!this.value.trim()) {
                this.style.borderColor = 'var(--error)';
                ramoError.textContent = 'Por favor, digite o nome do ramo';
                ramoError.style.display = 'block';
            } else {
                this.style.borderColor = 'var(--border)';
                ramoError.style.display = 'none';
            }
        }
    });
}

function setupFormValidation() {
    requiredFields.forEach(field => {
        if (field.id === 'supervisor' || field.id === 'ramo') return;
        
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        input.addEventListener('input', function() {
            validateField(input, errorElement);
        });
    });

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    
    emailInput.addEventListener('input', function() {
        validateEmailField(emailInput, emailError);
    });
}

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

function setupDateField() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dataVenda').value = today;
}

function setupNewVendaButton() {
    newVendaBtn.addEventListener('click', function() {
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
    });
}

function setupNewAtendimentoButton() {
    document.getElementById('newAtendimentoBtn').addEventListener('click', function() {
        document.getElementById('successPosVenda').classList.add('hidden');
        document.getElementById('posVendaForm').classList.add('hidden');
        document.getElementById('clienteSearch').value = '';
        document.getElementById('resultadosBusca').style.display = 'none';
    });
}

function validateForm() {
    let isValid = true;
    
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
    };

    if (ramoSelect.value === 'Outro' && !outroRamoInput.value.trim()) {
        outroRamoInput.style.borderColor = 'var(--error)';
        ramoError.textContent = 'Por favor, digite o nome do ramo';
        ramoError.style.display = 'block';
        isValid = false;
    } else if (!ramoSelect.value) {
        ramoSelect.style.borderColor = 'var(--error)';
        ramoError.textContent = 'Por favor, selecione um ramo';
        ramoError.style.display = 'block';
        isValid = false;
    } else {
        ramoSelect.style.borderColor = 'var(--border)';
        outroRamoInput.style.borderColor = 'var(--border)';
        ramoError.style.display = 'none';
    }
    
    requiredFields.forEach(field => {
        if (field.id === 'supervisor' || field.id === 'ramo') return;

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

function resetForm() {
    form.reset();
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        input.style.borderColor = 'var(--border)';
        errorElement.style.display = 'none';
    });
    
    supervisorSelect.selectedIndex = 0;
    outroSupervisorInput.classList.add('hidden');
    outroSupervisorInput.value = '';
    outroSupervisorInput.required = false;

    ramoSelect.selectedIndex = 0;
    outroRamoInput.classList.add('hidden');
    outroRamoInput.value = '';
    outroRamoInput.required = false;
    
    setupDateField();
}

async function submitForm(data, tipo = 'venda') {
    try {
        data.tipo = tipo;
        
        if (data.supervisor === 'Outro') {
            data.supervisor = outroSupervisorInput.value.trim();
        }

        if (data.ramo === 'Outro') {
            data.ramo = outroRamoInput.value.trim();
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
        cnpjCpf: document.getElementById('cnpjCpf').value.trim(),
        email: document.getElementById('email').value.trim(),
        dataVenda: document.getElementById('dataVenda').value,
        serial: document.getElementById('serial').value.trim(),
        observacoes: document.getElementById('observacoes').value.trim(),
        concorrencia: document.getElementById('concorrencia').value.trim(),
        // indicacaoTexto: indicacaoSwitch.checked ? 'Sim' : 'Nao',
        faturamentoPrometido: document.getElementById('faturamentoPrometido').value.trim(),
        ramo: ramoSelect.value
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        await submitForm(formData, 'venda');
        
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
    document.getElementById('clienteSelecionadoNome').querySelector('span').textContent = 
        `${cliente.cliente} - ${cliente.estabelecimento}`;
    
    document.getElementById('posVendaForm').dataset.clienteId = cliente.id;
    document.getElementById('posVendaForm').dataset.clienteNome = cliente.cliente;
    document.getElementById('posVendaForm').dataset.estabelecimento = cliente.estabelecimento;
    
    document.getElementById('resultadosBusca').style.display = 'none';
    document.getElementById('posVendaForm').classList.remove('hidden');
    
    document.getElementById('dataAtendimento').value = new Date().toISOString().split('T')[0];
}

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
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            await submitForm(formData, 'posvenda');
            
            document.getElementById('success-pos-details').textContent = 
                `Atendimento registrado para ${formData.cliente} - ${formData.estabelecimento}`;
            
            form.classList.add('hidden');
            document.getElementById('successPosVenda').classList.remove('hidden');
            
            form.reset();
        } catch (error) {
            alert('Erro ao registrar atendimento: ' + error.message);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// NOVA FEAT: INDICAÇÃO MELI

function setupIndicacaoTab() {
    setupIndicacaoFormValidation();
    setupIndicacaoTelefoneMask();
    setupIndicacaoCurrencyMask();
    setupMarketplaceCheckboxes();
    setupNewIndicacaoButton();
    
    // Configurar evento de submit do formulário de indicação
    document.getElementById('indicacaoForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateIndicacaoForm()) {
            return;
        }
        
        const formData = {
            supervisorIndicacao: document.getElementById('supervisorIndicacao').value.trim(),
            consultorIndicacao: document.getElementById('consultorIndicacao').value.trim(),
            nomeFantasia: document.getElementById('nomeFantasia').value.trim(),
            faturamentoIndicacao: document.getElementById('faturamentoIndicacao').value.trim(),
            nomeDecisor: document.getElementById('nomeDecisor').value.trim(),
            telefoneIndicacao: document.getElementById('telefoneIndicacao').value.trim(),
            cnpjCpfIndicacao: document.getElementById('cnpjCpfIndicacao').value.trim(),
            emailIndicacao: document.getElementById('emailIndicacao').value.trim(),
            segmentoIndicacao: document.getElementById('segmentoIndicacao').value,
            enderecoIndicacao: document.getElementById('enderecoIndicacao').value.trim(),
            cidadeIndicacao: document.getElementById('cidadeIndicacao').value.trim(),
            observacoesIndicacao: document.getElementById('observacoesIndicacao').value.trim(),
            resumoIndicacao: document.getElementById('resumoIndicacao').value.trim(),
            mercadoLivre: document.querySelector('input[name="mercadoLivre"]:checked').value,
            mercadoPago: document.querySelector('input[name="mercadoPago"]:checked').value,
            interesseCliente: document.querySelector('input[name="interesseCliente"]:checked').value,
            nivelExperiencia: document.getElementById('nivelExperiencia').value,
            capacidadeProducao: document.getElementById('capacidadeProducao').value,
            capacidadeEstoque: document.querySelector('input[name="capacidadeEstoque"]:checked')?.value || '',
            tipo: 'indicacao' // Adicionar tipo para o backend
        };
        
        // Processar checkboxes de marketplace
        const marketplaceCheckboxes = document.querySelectorAll('input[name="marketplaceOutros"]:checked');
        const marketplaces = Array.from(marketplaceCheckboxes).map(cb => cb.value);
        
        if (marketplaces.includes('Outro')) {
            const outroValor = document.getElementById('outroMarketplace').value.trim();
            if (outroValor) {
                const index = marketplaces.indexOf('Outro');
                marketplaces[index] = `Outro: ${outroValor}`;
            }
        }
        
        formData.marketplaceOutros = marketplaces.join(', ');
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            await submitIndicacao(formData);
            
            document.getElementById('success-indicacao-details').innerHTML = `
                <strong>Indicação registrada para:</strong><br>
                <strong>Nome Fantasia:</strong> ${formData.nomeFantasia}<br>
                <strong>Decisor:</strong> ${formData.nomeDecisor}<br>
                <strong>Segmento:</strong> ${formData.segmentoIndicacao}<br>
                <strong>Faturamento:</strong> R$ ${formData.faturamentoIndicacao}<br>
                <strong>Local:</strong> ${formData.cidadeIndicacao}<br>
                <strong>Interesse:</strong> Nível ${formData.interesseCliente}
            `;
            
            document.getElementById('indicacaoForm').classList.add('hidden');
            document.getElementById('successIndicacao').classList.remove('hidden');
            
            resetIndicacaoForm();
        } catch (error) {
            alert('Erro ao registrar indicação: ' + error.message);
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

async function submitIndicacao(data) {
    try {
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

function setupIndicacaoTelefoneMask() {
    const telefoneInput = document.getElementById('telefoneIndicacao');
    
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
    });
}

function setupIndicacaoCurrencyMask() {
    const faturamentoInput = document.getElementById('faturamentoIndicacao');
    
    faturamentoInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (value / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        e.target.value = value === '0,00' ? '' : value;
    });
}

function setupMarketplaceCheckboxes() {
    const marketplaceCheckboxes = document.querySelectorAll('input[name="marketplaceOutros"]');
    const outroMarketplaceGroup = document.getElementById('outroMarketplaceGroup');
    const marketplaceNao = document.getElementById('marketplaceNao');
    
    marketplaceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'Não' && this.checked) {
                marketplaceCheckboxes.forEach(cb => {
                    if (cb.value !== 'Não') {
                        cb.checked = false;
                    }
                });
                outroMarketplaceGroup.classList.add('hidden');
            } else if (this.value === 'Não') {
                return;
            } else if (this.checked) {
                marketplaceNao.checked = false;
            }
            
            const outroChecked = document.getElementById('marketplaceOutro').checked;
            outroMarketplaceGroup.classList.toggle('hidden', !outroChecked);
        });
    });
}

function setupIndicacaoFormValidation() {
    const requiredFieldsIndicacao = [
        { id: 'supervisorIndicacao', errorId: 'supervisorIndicacao-error' },
        { id: 'consultorIndicacao', errorId: 'consultorIndicacao-error' },
        { id: 'nomeFantasia', errorId: 'nomeFantasia-error' },
        { id: 'faturamentoIndicacao', errorId: 'faturamentoIndicacao-error' },
        { id: 'nomeDecisor', errorId: 'nomeDecisor-error' },
        { id: 'telefoneIndicacao', errorId: 'telefoneIndicacao-error' },
        { id: 'cnpjCpfIndicacao', errorId: 'cnpjCpfIndicacao-error' },
        { id: 'emailIndicacao', errorId: 'emailIndicacao-error' },
        { id: 'segmentoIndicacao', errorId: 'segmentoIndicacao-error' },
        { id: 'enderecoIndicacao', errorId: 'enderecoIndicacao-error' },
        { id: 'cidadeIndicacao', errorId: 'cidadeIndicacao-error' },
        { id: 'resumoIndicacao', errorId: 'resumoIndicacao-error' },
    ];
    
    requiredFieldsIndicacao.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        if (input && errorElement) {
            input.addEventListener('input', function() {
                validateField(input, errorElement);
            });
        }
    });
    
    const emailInput = document.getElementById('emailIndicacao');
    const emailError = document.getElementById('emailIndicacao-error');
    
    emailInput.addEventListener('input', function() {
        validateEmailField(emailInput, emailError);
    });
    
    const mercadoLivreRadios = document.querySelectorAll('input[name="mercadoLivre"]');
    const mercadoLivreError = document.getElementById('mercadoLivre-error');
    
    mercadoLivreRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            mercadoLivreError.style.display = 'none';
        });
    });

    const mercadoPagoRadios = document.querySelectorAll('input[name="mercadoPago"]');
    const mercadoPagoError = document.getElementById('mercadoPago-error');
    
    mercadoPagoRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            mercadoPagoError.style.display = 'none';
        });
    });

    
    
    const interesseRadios = document.querySelectorAll('input[name="interesseCliente"]');
    const interesseError = document.getElementById('interesseCliente-error');
    
    interesseRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            interesseError.style.display = 'none';
        });
    });
}

function validateIndicacaoForm() {
    let isValid = true;
    
    const requiredFieldsIndicacao = [
        { id: 'supervisorIndicacao', errorId: 'supervisorIndicacao-error' },
        { id: 'consultorIndicacao', errorId: 'consultorIndicacao-error' },
        { id: 'nomeFantasia', errorId: 'nomeFantasia-error' },
        { id: 'faturamentoIndicacao', errorId: 'faturamentoIndicacao-error' },
        { id: 'nomeDecisor', errorId: 'nomeDecisor-error' },
        { id: 'telefoneIndicacao', errorId: 'telefoneIndicacao-error' },
        { id: 'cnpjCpfIndicacao', errorId: 'cnpjCpfIndicacao-error' },
        { id: 'emailIndicacao', errorId: 'emailIndicacao-error' },
        { id: 'segmentoIndicacao', errorId: 'segmentoIndicacao-error' },
        { id: 'enderecoIndicacao', errorId: 'enderecoIndicacao-error' },
        { id: 'cidadeIndicacao', errorId: 'cidadeIndicacao-error' },
        { id: 'resumoIndicacao', errorId: 'resumoIndicacao-error' },
    ];
    
    requiredFieldsIndicacao.forEach(field => {
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
    
    const emailInput = document.getElementById('emailIndicacao');
    const emailError = document.getElementById('emailIndicacao-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailInput.value.trim() && !emailRegex.test(emailInput.value)) {
        emailInput.style.borderColor = 'var(--error)';
        emailError.textContent = 'Por favor, insira um e-mail válido';
        emailError.style.display = 'block';
        isValid = false;
    }
    
    const mercadoLivreSelected = document.querySelector('input[name="mercadoLivre"]:checked');
    const mercadoLivreError = document.getElementById('mercadoLivre-error');
    
    if (!mercadoLivreSelected) {
        mercadoLivreError.textContent = 'Por favor, selecione uma opção';
        mercadoLivreError.style.display = 'block';
        isValid = false;
    } else {
        mercadoLivreError.style.display = 'none';
    }
    
    const mercadoPagoSelected = document.querySelector('input[name="mercadoPago"]:checked');
    const mercadoPagoError = document.getElementById('mercadoPago-error');
    
    if (!mercadoPagoSelected) {
        mercadoPagoError.textContent = 'Por favor, selecione uma opção';
        mercadoPagoError.style.display = 'block';
        isValid = false;
    } else {
        mercadoPagoError.style.display = 'none';
    }
    
    const interesseSelected = document.querySelector('input[name="interesseCliente"]:checked');
    const interesseError = document.getElementById('interesseCliente-error');
    
    if (!interesseSelected) {
        interesseError.textContent = 'Por favor, selecione o nível de interesse';
        interesseError.style.display = 'block';
        isValid = false;
    } else {
        interesseError.style.display = 'none';
    }
    
    const telefoneInput = document.getElementById('telefoneIndicacao');
    const telefoneError = document.getElementById('telefoneIndicacao-error');
    
    if (telefoneInput.value.replace(/\D/g, '').length < 10) {
        telefoneInput.style.borderColor = 'var(--error)';
        telefoneError.textContent = 'Telefone incompleto';
        telefoneError.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

function setupNewIndicacaoButton() {
    document.getElementById('newIndicacaoBtn').addEventListener('click', function() {
        document.getElementById('successIndicacao').classList.add('hidden');
        document.getElementById('indicacaoForm').classList.remove('hidden');
    });
}

function resetIndicacaoForm() {
    const form = document.getElementById('indicacaoForm');
    form.reset();
    
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.style.display = 'none';
    });
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = 'var(--border)';
    });
    
    document.getElementById('outroMarketplaceGroup').classList.add('hidden');
}

// Funções auxiliares (mantidas do código original)
function carregarListaClientes() {
    try {
        // Implementação existente
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        document.getElementById('listaClientes').innerHTML = '<div class="error">Erro ao carregar clientes</div>';
    }
}

function exibirListaClientes(clientes) {
    // Implementação existente
}

function parseLocalDate(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dateString);
}