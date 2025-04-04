/**
 * VINTRA - Análise Dimensional Clínica
 * Script principal completo
 */

// Estado global da aplicação
const state = {
    currentView: 'dashboard', // A view inicial será definida após o login
    currentPatientId: null,
    currentDocumentId: null, // ID do documento selecionado na biblioteca
    currentDocumentType: null, // Tipo do documento sendo editado/processado
    activePatientTab: 'summary-panel',
    activeDimensionalView: 'radar',
    activeNewDocumentTab: 'record', // Aba ativa na view 'Novo Documento'
    activeResultsTab: 'transcription-panel', // Aba ativa na view 'Resultados'
    isProcessing: false, // Flag para indicar se alguma operação demorada está em andamento
    isRecording: false,
    recordingStartTime: null,
    recordingInterval: null,
    audioContext: null, // Para visualizador de áudio
    analyser: null,
    visualizerSource: null,
    visualizerRafId: null,
    uploadedFile: null, // Guarda o arquivo selecionado para upload
    // Dados dimensionais de exemplo
    dimensionalData: {
        emocional: { valencia: -2.5, excitacao: 7.0, dominancia: 3.0, intensidade: 8.0 },
        cognitiva: { complexidade: 6.0, coerencia: 5.0, flexibilidade: 4.0, dissonancia: 7.0 },
        autonomia: { perspectivaTemporal: { passado: 7.0, presente: 3.0, futuro: 2.0, media: 4.0 }, autocontrole: 4.0 }
    },
    // Documentos de exemplo
    documents: [],
    // Conteúdo de texto dos documentos (para edição e visualização)
    transcriptionText: "",
    vintraText: "",
    soapText: "",
    ipissimaText: "",
    narrativeText: "",
    orientacoesText: "",
    // Pacientes de exemplo (usado para popular o painel do paciente)
    recentPatients: []
};

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', function() {
    // Iniciar animação do logo de splash
    setTimeout(() => {
        animateLogo();
    }, 500); // Pequeno delay para garantir que o SVG esteja pronto

    // Carregar dados de exemplo
    loadDemoData();

    // Configurar eventos do sistema
    setupLogin();
    setupNavigation();
    setupSidebar();
    setupMobileMenu();
    setupPatientTabs(); // Para o painel do paciente
    setupDimensionalVisualizations(); // Para o modal dimensional
    setupDocumentEditing(); // Para o modal de edição
    setupNewDocumentTabs(); // Abas Record/Upload/Transcribe
    setupRecorder();
    setupUpload();
    setupTranscriptionInput();
    setupProcessing();
    setupResultsView();
    setupDocumentLibrary(); // Adiciona listeners aos itens da biblioteca
    setupFocusMode(); // Botão de modo foco
    initCharts(); // Inicializa gráficos (se visíveis)
    initFluidAnimations(); // Adiciona efeitos como ripple

    // Estado inicial: Mostrar Splash, depois Login
    // A transição para #appContainer ocorrerá no login bem-sucedido
});

// --- Carregamento de Dados e Renderização Inicial ---

/**
 * Carrega dados de exemplo para demonstração
 */
function loadDemoData() {
    // Pacientes recentes (usado para popular o painel do paciente)
    state.recentPatients = [
        { id: 'patient-1', name: 'Maria Silva', age: 38, gender: 'Feminino', lastVisit: '28/03/2025', status: 'Em tratamento' },
        { id: 'patient-2', name: 'João Santos', age: 42, gender: 'Masculino', lastVisit: '25/03/2025', status: 'Primeira consulta' },
        { id: 'patient-3', name: 'Ana Oliveira', age: 29, gender: 'Feminino', lastVisit: '20/03/2025', status: 'Em tratamento' },
        { id: 'patient-4', name: 'Carlos Pereira', age: 55, gender: 'Masculino', lastVisit: '15/03/2025', status: 'Retorno' }
    ];

    // Exemplo de documentos para biblioteca e repositório
    state.documents = [
        { id: 'doc1', patientId: 'patient-1', title: 'Entrevista_Maria.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: '#8B5CF6', size: '15.3 MB', duration: '28:45' },
        { id: 'doc2', patientId: 'patient-1', title: 'Transcrição_Maria.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: '#6366F1', size: '5 KB' },
        { id: 'doc3', patientId: 'patient-1', title: 'VINTRA_Maria.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', color: '#0EA5E9', size: '8 KB' },
        { id: 'doc4', patientId: 'patient-1', title: 'SOAP_Maria.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', color: '#10B981', size: '3 KB' },
        { id: 'doc5', patientId: 'patient-2', title: 'Consulta_Joao.wav', type: 'audio', date: '25/03/2025', time: '11:00', icon: 'fas fa-microphone', color: '#8B5CF6', size: '22.1 MB', duration: '35:10' },
        { id: 'doc6', patientId: 'patient-2', title: 'Transcricao_Joao.txt', type: 'transcription', date: '25/03/2025', time: '11:05', icon: 'fas fa-file-alt', color: '#6366F1', size: '7 KB' },
    ];

    // Exemplo de conteúdo de texto para documentos
    state.transcriptionText = `Entrevista Clínica - 25 de Março de 2025

Médico: Bom dia, Maria. Como você está se sentindo hoje?

Paciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar. (Suspira) É difícil manter a esperança.

Médico: Entendo que seja difícil, Maria. Vamos conversar sobre isso. Além da dor física, como está o seu ânimo?

Paciente: Péssimo. Me sinto desanimada, sem vontade de fazer nada. Até as coisas que eu gostava perderam a graça. Parece que estou carregando um peso enorme.`;

    state.vintraText = `# Análise VINTRA - Maria Silva (25/03/2025)

## Dimensões Emocionais
- Valência (v₁): -2.5 (Negativa)
- Excitação (v₂): 7.0 (Alta)
- Dominância (v₃): 3.0 (Baixa)
- Intensidade (v₄): 8.0 (Alta)

## Dimensões Cognitivas
- Complexidade (v₅): 6.0 (Moderada)
- Coerência (v₆): 5.0 (Moderada)
- Flexibilidade (v₇): 4.0 (Baixa)
- Dissonância (v₈): 7.0 (Alta)

## Dimensões de Autonomia
- Perspectiva Temporal (v₉): Média 4.0 (Foco no Passado/Presente)
- Autocontrole (v₁₀): 4.0 (Baixo)

## Observações
Paciente demonstra humor deprimido, anedonia e baixa percepção de controle sobre a situação. Alta intensidade emocional e excitação, possivelmente ligadas à ansiedade e frustração. Dificuldade em vislumbrar futuro positivo.`;

    state.soapText = `# Nota SOAP - Maria Silva (25/03/2025)

## S (Subjetivo)
Paciente relata persistência da dor ("não adianta muito"), sono de má qualidade ("durmo mal, acordo cansada"), desânimo ("péssimo", "sem vontade de fazer nada"), anedonia ("coisas que eu gostava perderam a graça") e desesperança ("acho que nunca vou melhorar"). Refere sentir como se estivesse "carregando um peso enorme".

## O (Objetivo)
Apresenta-se com fácies de tristeza, discurso lentificado por vezes, suspiros frequentes. Afeto predominantemente disfórico. Nega ideação suicida ativa no momento, mas expressa desesperança.

## A (Avaliação)
Quadro compatível com Transtorno Depressivo Maior, possivelmente comórbido com quadro álgico crônico. Sintomas de humor deprimido, anedonia, alterações de sono, fadiga, sentimentos de desesperança e baixa percepção de autoeficácia são evidentes. A dor crônica parece exacerbar os sintomas depressivos e vice-versa. Risco de cronificação do quadro depressivo.

## P (Plano)
- Manter/ajustar medicação antidepressiva (a ser avaliado).
- Encaminhar para psicoterapia com foco em TCC para depressão e manejo da dor crônica.
- Avaliar introdução de psicoeducação sobre a relação dor-humor.
- Monitorar ideação suicida e desesperança em próximas consultas.
- Considerar avaliação complementar para o quadro álgico, se ainda não realizada.
- Agendar retorno em 2 semanas.`;

    // Renderizar documentos recentes no dashboard
    renderRecentDocuments(); // Adaptado para renderizar documentos

    // Renderizar documentos na biblioteca (será chamado ao mudar para a view)
    // renderDocumentLibrary();
}

/**
 * Renderiza os documentos recentes no dashboard (#recentDocuments)
 */
function renderRecentDocuments() {
    const container = document.getElementById('recentDocuments');
    if (!container) return;

    container.innerHTML = ''; // Limpa o container

    // Pega os 4 documentos mais recentes como exemplo
    const recentDocs = state.documents.slice(-4).reverse();

    if (recentDocs.length === 0) {
        container.innerHTML = '<p>Nenhum documento recente encontrado.</p>';
        return;
    }

    recentDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'recent-item'; // Usa a classe .recent-item
        item.dataset.id = doc.id; // Armazena o ID do documento

        item.innerHTML = `
            <div class="recent-item-icon" style="color: ${doc.color || '#6B7280'}">
                <i class="${doc.icon || 'fas fa-file'}"></i>
            </div>
            <div class="recent-item-info">
                <div class="recent-item-title">${doc.title}</div>
                <div class="recent-item-meta">
                    <span>${doc.type}</span>
                    <span class="recent-item-meta-divider"></span>
                    <span>${doc.date}</span>
                    ${doc.size ? `<span class="recent-item-meta-divider"></span><span>${doc.size}</span>` : ''}
                </div>
            </div>
        `;

        // Adiciona listener para abrir o documento na biblioteca/visualizador
        item.addEventListener('click', () => {
            // Poderia abrir diretamente na view de resultados ou na biblioteca
            // Por simplicidade, vamos para a biblioteca e destacamos o item (se implementado)
            switchView('library');
            // Opcional: destacar o item clicado na biblioteca
            // highlightDocumentInLibrary(doc.id);
            viewDocumentInWorkspace(doc.id); // Tenta visualizar no painel direito
        });

        container.appendChild(item);
    });
}


/**
 * Renderiza documentos na Biblioteca (#documentList)
 */
function renderDocumentLibrary(filter = 'all') {
    const container = document.getElementById('documentList');
    if (!container) return;

    container.innerHTML = ''; // Limpa a lista

    const filteredDocs = state.documents.filter(doc =>
        filter === 'all' || doc.type === filter
    );

    if (filteredDocs.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--text-tertiary);">Nenhum documento encontrado para este filtro.</p>';
        return;
    }

    filteredDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'document-item';
        item.classList.add(`document-${doc.type}`); // Adiciona classe específica do tipo
        item.dataset.id = doc.id;
        item.dataset.type = doc.type;

        item.innerHTML = `
            <div class="document-icon">
                <i class="${doc.icon || 'fas fa-file'}"></i>
            </div>
            <div class="document-info">
                <div class="document-title">${doc.title}</div>
                <div class="document-meta">${doc.date}</div>
            </div>
            <div class="document-actions">
                 <button class="document-action-btn process-doc" title="Processar">
                     <i class="fas fa-cogs"></i>
                 </button>
                 <button class="document-action-btn download-doc" title="Download">
                     <i class="fas fa-download"></i>
                 </button>
            </div>
        `;

        // Listener para selecionar e visualizar o documento
        item.addEventListener('click', () => {
            setActiveDocumentItem(doc.id);
            viewDocumentInWorkspace(doc.id);
        });

        // Listener para botão de processar
        item.querySelector('.process-doc').addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique no botão selecione o item
            startProcessingDocument(doc.id);
        });

        // Listener para botão de download
        item.querySelector('.download-doc').addEventListener('click', (e) => {
            e.stopPropagation();
            downloadDocument(doc.id);
        });


        container.appendChild(item);
    });
}

/**
 * Define o item ativo na lista da biblioteca
 */
function setActiveDocumentItem(docId) {
    document.querySelectorAll('#documentList .document-item').forEach(item => {
        item.classList.toggle('active', item.dataset.id === docId);
    });
    state.currentDocumentId = docId;
}

/**
 * Visualiza o conteúdo de um documento no painel direito da biblioteca
 */
function viewDocumentInWorkspace(docId) {
    const doc = state.documents.find(d => d.id === docId);
    const viewContainer = document.getElementById('documentView');
    if (!doc || !viewContainer) {
        showEmptyDocumentView();
        return;
    }

    const content = getDocumentContent(doc.type); // Pega o conteúdo (pode ser simulado)

    // Atualiza o cabeçalho e conteúdo do painel
    viewContainer.innerHTML = `
        <div class="document-toolbar">
            <div class="document-info-header">
                <div class="document-info-icon document-${doc.type}">
                    <i class="${doc.icon || 'fas fa-file'}"></i>
                </div>
                <div class="document-info-details">
                    <h2>${doc.title}</h2>
                    <div class="document-info-meta">
                        <span>${doc.type}</span>
                        <span class="document-info-meta-divider"></span>
                        <span>${doc.date} ${doc.time || ''}</span>
                        ${doc.size ? `<span class="document-info-meta-divider"></span><span>${doc.size}</span>` : ''}
                        ${doc.duration ? `<span class="document-info-meta-divider"></span><span>${doc.duration}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="document-toolbar-actions">
                <button class="toolbar-btn edit-doc-view" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="toolbar-btn process-doc-view" title="Processar">
                    <i class="fas fa-cogs"></i> Processar
                </button>
                 <button class="toolbar-btn download-doc-view" title="Download">
                     <i class="fas fa-download"></i> Download
                 </button>
            </div>
        </div>
        <div class="document-content">
            <div class="document-container">
                <div class="document-view">
                    <pre>${content}</pre> </div>
            </div>
        </div>
    `;

    // Adiciona listeners aos botões da toolbar do visualizador
    viewContainer.querySelector('.edit-doc-view')?.addEventListener('click', () => editDocument(docId));
    viewContainer.querySelector('.process-doc-view')?.addEventListener('click', () => startProcessingDocument(docId));
    viewContainer.querySelector('.download-doc-view')?.addEventListener('click', () => downloadDocument(docId));

}

/**
 * Mostra o estado vazio no painel de visualização de documentos
 */
function showEmptyDocumentView() {
    const viewContainer = document.getElementById('documentView');
    if (!viewContainer) return;
    viewContainer.innerHTML = `
        <div class="document-empty">
            <div class="document-empty-icon">
                <i class="fas fa-file-alt"></i>
            </div>
            <h2 class="document-empty-title">Nenhum documento selecionado</h2>
            <p class="document-empty-text">Selecione um documento da biblioteca para visualizá-lo ou crie um novo.</p>
            <button class="btn btn-primary" onclick="switchView('new')">
                <i class="fas fa-plus btn-icon"></i>
                Novo Documento
            </button>
        </div>
    `;
}


/**
 * Renderiza documentos no repositório do paciente (dentro do #patient-view)
 */
function renderPatientDocuments() {
    const documentsList = document.getElementById('patientDocuments');
    if (!documentsList || !state.currentPatientId) return; // Precisa de um paciente selecionado

    documentsList.innerHTML = '';

    // Filtra documentos para o paciente atual
    const patientDocs = state.documents.filter(doc => doc.patientId === state.currentPatientId);

    if (patientDocs.length === 0) {
        documentsList.innerHTML = '<p style="text-align: center; color: var(--text-tertiary);">Nenhum documento encontrado para este paciente.</p>';
        return;
    }

    patientDocs.forEach(doc => {
        const docItem = document.createElement('div');
        docItem.className = 'document-item'; // Reutiliza a classe da biblioteca
        docItem.dataset.id = doc.id;
        docItem.dataset.type = doc.type;

        docItem.innerHTML = `
            <div class="document-icon" style="color: ${doc.color || '#6B7280'}">
                <i class="${doc.icon || 'fas fa-file'}"></i>
            </div>
            <div class="document-info">
                <div class="document-title">${doc.title}</div>
                <div class="document-meta">${doc.date} • ${doc.time || ''}</div>
            </div>
            <div class="document-actions">
                <button class="document-action-btn view-doc" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="document-action-btn edit-doc" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="document-action-btn download-doc" title="Download">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;

        // Adicionar event listeners para ações
        docItem.querySelector('.view-doc').addEventListener('click', (e) => {
            e.stopPropagation();
            viewDocument(doc.id); // Implementar visualização (talvez em modal ou painel)
             showToast('info', 'Visualizar', `Visualizando ${doc.title}`);
        });

        docItem.querySelector('.edit-doc').addEventListener('click', (e) => {
            e.stopPropagation();
            editDocument(doc.id); // Abre o modal de edição
        });

        docItem.querySelector('.download-doc').addEventListener('click', (e) => {
            e.stopPropagation();
            downloadDocument(doc.id);
        });

        documentsList.appendChild(docItem);
    });
}

// --- Animações ---

/**
 * Anima o logo na splash screen usando GSAP
 */
function animateLogo() {
    const logoPaths = document.querySelectorAll('#vintra-logo path');
    const splashScreen = document.getElementById('splashScreen');
    const loginScreen = document.getElementById('loginScreen');
    const logoContainer = document.getElementById('logo-container');
    const backgroundGlow = document.querySelector('.background-glow');

    if (!logoPaths.length || !splashScreen || !loginScreen || !gsap) {
        console.warn("GSAP ou elementos do logo não encontrados para animação.");
        // Fallback: Apenas esconde splash e mostra login
        if (splashScreen) splashScreen.classList.add('hidden');
        if (loginScreen) loginScreen.classList.add('visible');
        return;
    }

    // Resetar estilos iniciais
    gsap.set(logoPaths, { strokeDasharray: "1000", strokeDashoffset: "1000", opacity: 0 });
    gsap.set(backgroundGlow, { opacity: 0, scale: 0.8 });
    gsap.set(logoContainer, { scale: 0.9 });

    // Timeline da animação
    const tl = gsap.timeline({
        onComplete: () => {
            // Após a animação do logo, fazer fade out do splash e fade in do login
            gsap.to(splashScreen, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    splashScreen.classList.add('hidden'); // Oculta completamente
                    loginScreen.classList.add('visible'); // Mostra a tela de login
                    gsap.fromTo(loginScreen, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
                }
            });
        }
    });

    // Animação de desenho dos paths
    tl.to(logoPaths, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.5, // Duração do desenho
        stagger: 0.1, // Pequeno atraso entre cada path
        ease: "power2.inOut"
    })
    // Animação de preenchimento (simulada com stroke mais grosso e depois fino)
    .to(logoPaths, {
        strokeWidth: 8, // Engrossa o traço
        duration: 0.4,
        ease: "power1.inOut",
        stagger: 0.05
    }, "-=0.8") // Começa um pouco antes do fim do desenho
    .to(logoPaths, {
        strokeWidth: 4, // Volta ao normal
        duration: 0.5,
        ease: "power1.out"
    })
    // Animação de brilho e escala
    .to(backgroundGlow, {
        opacity: 0.5,
        scale: 1,
        duration: 1,
        ease: "power3.out"
    }, "-=1.2") // Começa durante a animação dos paths
    .to(logoContainer, {
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.7)"
    }, "-=1.2")
    // Manter visível por um momento antes de desaparecer
    .to({}, { duration: 0.5 }); // Pausa
}

/**
 * Inicializa animações fluidas (ex: ripple em botões)
 */
function initFluidAnimations() {
    document.querySelectorAll('.btn, .toolbar-btn, .library-btn, .recording-btn, .patient-tab, .document-format-option, .dimensional-tab, .date-nav-btn, .appointment-action, .mobile-menu-item, .sidebar-link').forEach(button => {
        button.addEventListener('click', function(e) {
            // Cria o elemento ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            // Calcula a posição do clique relativa ao botão
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Define estilo e posição
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Adiciona ao botão e inicia a animação
            this.appendChild(ripple);
            ripple.classList.add('ripple-animation');

            // Remove o ripple após a animação
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}


// --- Autenticação ---

/**
 * Configura o formulário de login
 */
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');

    if (!loginForm || !passwordInput || !passwordError || !loginScreen || !appContainer) {
        console.error("Elementos de login não encontrados.");
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio real do formulário
        const password = passwordInput.value;
        const correctPassword = "123"; // Senha de demonstração

        if (password === correctPassword) {
            // Login bem-sucedido
            passwordError.style.display = 'none'; // Esconde mensagem de erro
            showToast('success', 'Login bem-sucedido', 'Bem-vindo ao VINTRA!');

            // Animação de saída da tela de login e entrada da aplicação
            gsap.to(loginScreen, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    loginScreen.style.display = 'none'; // Oculta completamente
                    appContainer.style.display = 'flex'; // Mostra o container principal
                    state.currentView = 'dashboard'; // Define a view inicial
                    updateNavigation(state.currentView); // Atualiza a navegação
                    // Anima a entrada do app
                    gsap.fromTo(appContainer,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
                    );
                     // Renderiza conteúdo inicial da view (se necessário)
                     if(state.currentView === 'dashboard') renderRecentDocuments();
                     if(state.currentView === 'library') renderDocumentLibrary();
                }
            });

        } else {
            // Senha incorreta
            passwordError.style.display = 'block'; // Mostra mensagem de erro
            // Adiciona uma pequena animação de "shake"
            gsap.fromTo(loginForm, { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, ease: "power1.inOut", clearProps: "x" });
            passwordInput.focus();
        }
    });
}

/**
 * Simula o logout do usuário
 */
function logout() {
    const loginScreen = document.getElementById('loginScreen');
    const appContainer = document.getElementById('appContainer');
    const passwordInput = document.getElementById('password');

    if (!loginScreen || !appContainer || !passwordInput) return;

    showToast('info', 'Logout', 'Você saiu da sua conta.');

    // Anima a saída do app e entrada do login
    gsap.to(appContainer, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
            appContainer.style.display = 'none';
            loginScreen.style.display = 'flex';
            loginScreen.classList.add('visible'); // Garante que está visível para animação
            passwordInput.value = ''; // Limpa o campo de senha
            gsap.fromTo(loginScreen, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" });
            state.currentView = null; // Reseta a view atual
        }
    });
}


// --- Navegação Principal e Sidebar ---

/**
 * Configura os links de navegação principal e sidebar
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetViewId = link.dataset.target;
            // Ignora links que não são para views (perfil, sair, etc.)
            if (targetViewId && !['perfil', 'preferencias', 'sair'].includes(targetViewId)) {
                e.preventDefault();
                switchView(targetViewId);
            }
        });
    });

    // Configurar dropdown do usuário
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.querySelector('.user-dropdown');
    if (userMenu && userDropdown) {
        // A lógica de hover é feita via CSS, mas podemos adicionar clique se necessário
        // userMenu.addEventListener('click', () => userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block');
        // Adicionar listener para fechar se clicar fora (opcional)
    }

    // Configurar botões de logout
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logout);
}

/**
 * Atualiza o estado ativo dos links de navegação
 */
function updateNavigation(activeViewId) {
    const allLinks = document.querySelectorAll('.nav-item[data-target], .sidebar-link[data-target], .mobile-menu-item[data-target]');
    allLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.target === activeViewId);
    });

    // Fecha o menu mobile ao selecionar uma view
    closeMobileMenu();
}

/**
 * Configura o toggle da sidebar
 */
function setupSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.app-sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }
}

/**
 * Configura o menu mobile
 */
function setupMobileMenu() {
    const openBtn = document.getElementById('mobileMenuBtn');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    const menu = document.getElementById('mobileMenu');

    if (!openBtn || !closeBtn || !backdrop || !menu) return;

    openBtn.addEventListener('click', openMobileMenu);
    closeBtn.addEventListener('click', closeMobileMenu);
    backdrop.addEventListener('click', closeMobileMenu);
}

function openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop) {
        menu.classList.add('open');
        backdrop.classList.add('open');
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('mobileMenuBackdrop');
    if (menu && backdrop) {
        menu.classList.remove('open');
        backdrop.classList.remove('open');
    }
}

// --- Troca de Views ---

/**
 * Alterna entre as views principais da aplicação com animação GSAP
 */
window.switchView = function(viewId) {
    if (state.currentView === viewId && document.getElementById(`${viewId}-view`)?.style.display !== 'none') {
        console.log(`View ${viewId} já está ativa.`);
        return; // Não faz nada se a view já estiver ativa
    }

    // Verificar se está em processamento
    if (state.isProcessing) {
        showToast('warning', 'Processo em andamento', 'Por favor, aguarde a conclusão do processo atual.');
        return;
    }

    const currentViewElem = document.getElementById(`${state.currentView}-view`);
    const newViewElem = document.getElementById(`${viewId}-view`);

    if (!newViewElem) {
        console.error(`Elemento de view não encontrado: ${viewId}-view`);
        return;
    }

    const displayStyle = (viewId === 'library' || viewId === 'patient') ? 'flex' : 'block'; // Ajusta display para views flex

    // Função para mostrar a nova view e animar
    const showNewView = () => {
        newViewElem.style.display = displayStyle;
        gsap.fromTo(newViewElem,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
              onComplete: () => {
                  // Lógica pós-animação, se necessário
                  if (viewId === 'patient') {
                      updateDimensionalChart(); // Garante que o gráfico renderize
                  }
                  if (viewId === 'library') {
                      renderDocumentLibrary(); // Renderiza a lista ao entrar na biblioteca
                      // Se nenhum documento estiver selecionado, mostra o estado vazio
                      if (!state.currentDocumentId) {
                          showEmptyDocumentView();
                      } else {
                          // Se houver um documento selecionado, tenta visualizá-lo
                          viewDocumentInWorkspace(state.currentDocumentId);
                      }
                  }
                  if (viewId === 'dashboard') {
                      renderRecentDocuments(); // Renderiza documentos recentes ao voltar pro dashboard
                  }
              }
            }
        );
        state.currentView = viewId;
        updateNavigation(viewId);
    };

    // Esconde a view atual antes de mostrar a nova
    if (currentViewElem && currentViewElem !== newViewElem) {
        gsap.to(currentViewElem, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
                currentViewElem.style.display = 'none';
                currentViewElem.style.transform = ''; // Reset transform
                showNewView();
            }
        });
    } else {
        // Se não houver view atual (primeira carga) ou for a mesma view (recarregar?)
        showNewView();
    }
};


// --- Painel do Paciente (#patient-view) ---

/**
 * Abre o painel de um paciente específico
 */
function openPatientPanel(patientId) {
    const patient = state.recentPatients.find(p => p.id === patientId);
    if (!patient) {
        showToast('error', 'Erro', 'Paciente não encontrado.');
        return;
    }
    state.currentPatientId = patientId;

    // Atualizar cabeçalho do paciente
    const nameElem = document.querySelector('#patient-view .patient-name');
    const detailsElem = document.querySelector('#patient-view .patient-details');
    if (nameElem) nameElem.textContent = patient.name;
    if (detailsElem) detailsElem.textContent =
        `${patient.age} anos • ${patient.gender} • Prontuário #${patientId.replace('patient-', '')}`;

    // Mudar para a view do paciente
    switchView('patient'); // switchView agora lida com a animação e exibição

    // Ativar a primeira aba (Resumo) e renderizar conteúdo inicial
    activatePatientTab('summary-panel'); // Isso também chamará updateDimensionalChart
    renderPatientDocuments(); // Renderiza documentos na aba repositório
}

/**
 * Configura as abas do painel de paciente
 */
function setupPatientTabs() {
    const tabsContainer = document.querySelector('#patient-view .patient-tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', function(e) {
        const tab = e.target.closest('.patient-tab');
        if (tab && tab.dataset.panel) {
            activatePatientTab(tab.dataset.panel);
        }
    });
}

/**
 * Ativa uma aba específica no painel do paciente
 */
function activatePatientTab(panelId) {
    if (state.activePatientTab === panelId) return; // Já está ativa

    state.activePatientTab = panelId;

    // Atualizar classes ativas nas abas
    document.querySelectorAll('#patient-view .patient-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
    });

    // Animar transição dos painéis
    const panelsContainer = document.querySelector('#patient-view .patient-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector('.patient-tab-panel.active');

    if (!activePanel) return;

    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, {
            opacity: 0, duration: 0.2, ease: "power1.in", onComplete: () => {
                currentActivePanel.classList.remove('active');
                activePanel.classList.add('active');
                gsap.fromTo(activePanel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });

                // Lógica específica após ativar a aba
                if (panelId === 'summary-panel') {
                    updateDimensionalChart(); // Renderiza gráfico ao ativar aba
                } else if (panelId === 'repository-panel') {
                    renderPatientDocuments(); // Renderiza documentos ao ativar aba
                }
            }
        });
    } else if (!currentActivePanel) { // Caso inicial
        activePanel.classList.add('active');
        gsap.fromTo(activePanel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
        if (panelId === 'summary-panel') updateDimensionalChart();
        if (panelId === 'repository-panel') renderPatientDocuments();
    }
}


// --- Gráficos e Visualizações ---

/**
 * Inicializa gráficos (chamado no DOMContentLoaded)
 */
function initCharts() {
    // Não renderiza nada inicialmente, apenas prepara
    // Gráficos serão renderizados quando as views/modais forem ativados
}

/**
 * Atualiza o gráfico radar dimensional no painel do paciente
 */
function updateDimensionalChart() {
    const chartContainer = document.getElementById('dimensionalRadarChart');
    if (!chartContainer || !Chart) return; // Verifica se Chart.js está carregado

    // Destruir gráfico existente se houver
    if (window.dimensionalChart instanceof Chart) {
        window.dimensionalChart.destroy();
    }

    // Preparar dados (igual ao código anterior)
    const data = { /* ... dados do gráfico ... */
        labels: ['Valência (v₁)', 'Excitação (v₂)', 'Dominância (v₃)', 'Intensidade (v₄)', 'Complexidade (v₅)', 'Coerência (v₆)', 'Flexibilidade (v₇)', 'Dissonância (v₈)', 'Persp. Temporal (v₉)', 'Autocontrole (v₁₀)'],
        datasets: [{
            label: 'Perfil Dimensional',
            data: [state.dimensionalData.emocional.valencia + 5, state.dimensionalData.emocional.excitacao, state.dimensionalData.emocional.dominancia, state.dimensionalData.emocional.intensidade, state.dimensionalData.cognitiva.complexidade, state.dimensionalData.cognitiva.coerencia, state.dimensionalData.cognitiva.flexibilidade, state.dimensionalData.cognitiva.dissonancia, state.dimensionalData.autonomia.perspectivaTemporal.media, state.dimensionalData.autonomia.autocontrole],
            backgroundColor: 'rgba(58, 130, 246, 0.2)',
            borderColor: 'rgba(58, 130, 246, 0.7)',
            borderWidth: 2,
            pointBackgroundColor: ['rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(126, 29, 95, 0.8)', 'rgba(126, 29, 95, 0.8)']
        }]
    };
    const options = { /* ... opções do gráfico ... */
        responsive: true, maintainAspectRatio: false,
        scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2, display: false } } },
        plugins: { tooltip: { callbacks: { label: function(c){ let v=c.raw; if(c.dataIndex===0) v-=5; return`Valor: ${v.toFixed(1)}`; } } } }
    };

    // Criar novo gráfico
    window.dimensionalChart = new Chart(chartContainer, { type: 'radar', data: data, options: options });
}

/**
 * Configura a visualização dimensional modal
 */
function setupDimensionalVisualizations() {
    const openModalBtn = document.querySelector('.dimensional-summary .btn'); // Botão no painel do paciente
    const modalOverlay = document.getElementById('dimensionalModal');
    const closeBtn = document.getElementById('dimensionalModalClose');
    const tabsContainer = modalOverlay?.querySelector('.dimensional-tabs');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', showDimensionalModal);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', hideDimensionalModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideDimensionalModal(); });
    }
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.dimensional-tab');
            if (tab && tab.dataset.view) {
                activateDimensionalView(tab.dataset.view);
            }
        });
    }
}

/**
 * Mostra o modal de visualização dimensional
 */
function showDimensionalModal() {
    const modal = document.getElementById('dimensionalModal');
    if (modal) {
        modal.style.display = 'flex'; // Usa flex para centralizar
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(modal.querySelector('.modal-container'), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
        // Ativa a view padrão (radar) e renderiza o gráfico
        activateDimensionalView('radar');
    }
}

/**
 * Esconde o modal de visualização dimensional
 */
function hideDimensionalModal() {
    const modal = document.getElementById('dimensionalModal');
    if (modal) {
        gsap.to(modal.querySelector('.modal-container'), { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(modal, {
            opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.1, onComplete: () => {
                modal.style.display = 'none';
            }
        });
    }
}

/**
 * Ativa uma visualização dimensional específica dentro do modal
 */
function activateDimensionalView(viewType) {
    if (!document.getElementById('dimensionalModal')?.style.display || document.getElementById('dimensionalModal').style.display === 'none') {
        return; // Não faz nada se o modal não estiver visível
    }
    state.activeDimensionalView = viewType;

    // Atualizar classes ativas nas abas
    document.querySelectorAll('#dimensionalModal .dimensional-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === viewType);
    });

    // Animar transição dos painéis de visualização
    const viewsContainer = document.querySelector('#dimensionalModal .dimensional-views');
    const activeView = document.getElementById(`${viewType}-view`);
    const currentActiveView = viewsContainer?.querySelector('.dimensional-view.active');

     if (!activeView) return;

    if (currentActiveView && currentActiveView !== activeView) {
        gsap.to(currentActiveView, { opacity: 0, duration: 0.2, ease: "power1.in", onComplete: () => {
            currentActiveView.classList.remove('active');
            activeView.classList.add('active');
            gsap.fromTo(activeView, {opacity: 0}, {opacity: 1, duration: 0.3, ease: "power1.out"});
             // Renderizar gráfico se for a view de radar
             if (viewType === 'radar') {
                 updateModalDimensionalChart();
             }
        }});
    } else if (!currentActiveView) {
        activeView.classList.add('active');
        gsap.fromTo(activeView, {opacity: 0}, {opacity: 1, duration: 0.3, ease: "power1.out"});
        if (viewType === 'radar') {
            updateModalDimensionalChart();
        }
    }
}

/**
 * Atualiza o gráfico radar no modal dimensional
 */
function updateModalDimensionalChart() {
    const chartContainer = document.getElementById('modalRadarChart');
    if (!chartContainer || !Chart) return;

    // Destruir gráfico existente
    if (window.modalChart instanceof Chart) {
        window.modalChart.destroy();
    }

    // Preparar dados (igual ao updateDimensionalChart)
    const data = { /* ... dados ... */
        labels: ['Valência (v₁)', 'Excitação (v₂)', 'Dominância (v₃)', 'Intensidade (v₄)', 'Complexidade (v₅)', 'Coerência (v₆)', 'Flexibilidade (v₇)', 'Dissonância (v₈)', 'Persp. Temporal (v₉)', 'Autocontrole (v₁₀)'],
        datasets: [{
            label: 'Perfil Dimensional',
            data: [state.dimensionalData.emocional.valencia + 5, state.dimensionalData.emocional.excitacao, state.dimensionalData.emocional.dominancia, state.dimensionalData.emocional.intensidade, state.dimensionalData.cognitiva.complexidade, state.dimensionalData.cognitiva.coerencia, state.dimensionalData.cognitiva.flexibilidade, state.dimensionalData.cognitiva.dissonancia, state.dimensionalData.autonomia.perspectivaTemporal.media, state.dimensionalData.autonomia.autocontrole],
            backgroundColor: 'rgba(58, 130, 246, 0.2)',
            borderColor: 'rgba(58, 130, 246, 0.7)',
            borderWidth: 2,
            pointBackgroundColor: ['rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 'rgba(30, 58, 138, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(6, 95, 70, 0.8)', 'rgba(126, 29, 95, 0.8)', 'rgba(126, 29, 95, 0.8)']
        }]
     };
    const options = { /* ... opções ... */
        responsive: true, maintainAspectRatio: false,
        scales: { r: { beginAtZero: true, max: 10, ticks: { stepSize: 2, display: true, backdropColor: 'rgba(255,255,255,0.5)' } } }, // Mostra ticks no modal
        plugins: { tooltip: { callbacks: { label: function(c){ let v=c.raw; if(c.dataIndex===0) v-=5; return`Valor: ${v.toFixed(1)}`; } } } }
     };

    // Criar novo gráfico
    window.modalChart = new Chart(chartContainer, { type: 'radar', data: data, options: options });
}


// --- Edição de Documentos ---

/**
 * Configura o sistema de edição de documentos (Modal)
 */
function setupDocumentEditing() {
    // Botão de edição na aba de transcrição do painel do paciente
    const editTranscriptionBtn = document.getElementById('editTranscriptionBtn');
    if (editTranscriptionBtn) {
        editTranscriptionBtn.addEventListener('click', () => {
            editDocument('doc2'); // Edita o documento de transcrição de exemplo
        });
    }

    // Botões do modal de edição
    const modalOverlay = document.getElementById('editDocumentModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editModalClose = document.getElementById('editModalClose');

    if (cancelEditBtn) cancelEditBtn.addEventListener('click', closeDocumentEditor);
    if (saveEditBtn) saveEditBtn.addEventListener('click', saveDocumentEdit);
    if (editModalClose) editModalClose.addEventListener('click', closeDocumentEditor);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeDocumentEditor(); });
    }
}

/**
 * Abre o editor de documentos (Modal)
 */
function openDocumentEditor(docType, title, content) {
    // Guarda o tipo do documento que está sendo editado
    state.currentDocumentType = docType;

    const modal = document.getElementById('editDocumentModal');
    const modalTitle = document.getElementById('editModalTitle');
    const editor = document.getElementById('documentEditor');

    if (modal && modalTitle && editor) {
        modalTitle.textContent = title;
        editor.value = content; // Preenche o editor

        modal.style.display = 'flex'; // Mostra o overlay
        gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
        gsap.fromTo(modal.querySelector('.modal-container'), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });

        setTimeout(() => editor.focus(), 300); // Foca no editor após animação
    }
}

/**
 * Fecha o editor de documentos (Modal)
 */
function closeDocumentEditor() {
    const modal = document.getElementById('editDocumentModal');
    if (modal) {
        gsap.to(modal.querySelector('.modal-container'), { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" });
        gsap.to(modal, {
            opacity: 0, duration: 0.3, ease: "power2.in", delay: 0.1, onComplete: () => {
                modal.style.display = 'none';
                state.currentDocumentType = null; // Limpa o tipo de documento
            }
        });
    }
}

/**
 * Salva as edições feitas no documento (Modal)
 */
function saveDocumentEdit() {
    const editor = document.getElementById('documentEditor');
    if (!editor || !state.currentDocumentType) return;

    const content = editor.value;

    // Salva o conteúdo no estado global (simulação)
    const docKey = `${state.currentDocumentType}Text`;
    if (state.hasOwnProperty(docKey)) {
        state[docKey] = content;
        console.log(`Conteúdo para ${state.currentDocumentType} salvo:`, content);

        // Atualiza a visualização na UI, se aplicável
        // Ex: Atualizar a <pre> na view de resultados ou no painel da biblioteca
        const viewElement = document.querySelector(`#${state.currentDocumentType}ResultContent pre, #documentView pre`); // Tenta encontrar onde atualizar
        if (viewElement) {
            viewElement.textContent = content;
        }
        // Se estava editando a transcrição no painel do paciente
        if (state.currentDocumentType === 'transcription') {
             const transcriptionPanelContent = document.querySelector('#consultation-panel #transcriptionContent');
             if (transcriptionPanelContent) transcriptionPanelContent.textContent = content;
        }

        showToast('success', 'Alterações salvas', 'O documento foi atualizado.');
    } else {
        console.error("Tipo de documento inválido para salvar:", state.currentDocumentType);
        showToast('error', 'Erro ao salvar', 'Tipo de documento desconhecido.');
    }

    closeDocumentEditor(); // Fecha o modal
}


// --- Ações de Documento (Visualizar, Editar, Download) ---

/**
 * Visualiza um documento (implementação de exemplo)
 * Poderia abrir um modal dedicado ou usar o painel da biblioteca.
 * Atualmente, a visualização principal é feita em viewDocumentInWorkspace.
 */
function viewDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) return;
    console.log("Visualizando documento:", docId, doc.title);
    // Exemplo: Mostrar em um modal genérico (se existir) ou logar
    // showGenericModal(`Visualizar: ${doc.title}`, `<pre>${getDocumentContent(doc.type)}</pre>`);
    showToast('info', 'Visualizar', `Abrindo ${doc.title} para visualização.`);
    // A visualização real acontece em viewDocumentInWorkspace quando clicado na biblioteca
}

/**
 * Abre um documento para edição (chamando o modal)
 */
function editDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado para edição.');
        return;
    }
    console.log("Editando documento:", docId, doc.title, doc.type);

    // Verifica se o tipo de documento é editável (ex: não editar áudio diretamente)
    if (['transcription', 'vintra', 'soap', 'ipissima', 'narrative', 'orientacoes'].includes(doc.type)) {
        const content = getDocumentContent(doc.type);
        openDocumentEditor(doc.type, `Editar ${doc.title}`, content);
    } else {
        showToast('warning', 'Não editável', `Arquivos do tipo "${doc.type}" não podem ser editados diretamente.`);
    }
}

/**
 * Realiza o download de um documento
 */
function downloadDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
         showToast('error', 'Erro', 'Documento não encontrado para download.');
         return;
    }

    // Simulação: Para áudios, faria download do arquivo original. Para textos, cria um blob.
    if (doc.type === 'audio') {
        showToast('info', 'Download', `Iniciando download de ${doc.title} (Simulação).`);
        // Em um app real: window.location.href = '/path/to/audio/' + doc.title;
        return;
    }

    const content = getDocumentContent(doc.type);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); // Especifica charset
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title.endsWith('.txt') ? doc.title : `${doc.title}.txt`; // Garante extensão .txt
    document.body.appendChild(a);
    a.click();

    // Limpar após download
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('success', 'Download Concluído', `${doc.title} foi baixado.`);
    }, 100);
}

/**
 * Obtém o conteúdo de um documento com base em seu tipo (usado para visualização/edição/download)
 */
function getDocumentContent(type) {
    const key = `${type}Text`;
    if (state.hasOwnProperty(key) && state[key]) {
        return state[key];
    }
    // Retorna conteúdo padrão se não houver nada salvo no estado
    switch(type) {
        case 'transcription': return "Transcrição de exemplo não carregada.";
        case 'vintra': return "# Análise VINTRA\n\n(Conteúdo padrão)";
        case 'soap': return "# Nota SOAP\n\n(Conteúdo padrão)";
        case 'ipissima': return "# Ipíssima Narrativa\n\n(Conteúdo padrão)";
        case 'narrative': return "# Análise Narrativa\n\n(Conteúdo padrão)";
        case 'orientacoes': return "# Orientações\n\n(Conteúdo padrão)";
        case 'audio': return "(Conteúdo de áudio não visualizável como texto)";
        default: return "(Conteúdo não disponível)";
    }
}

// --- View: Novo Documento (#new-view) ---

/**
 * Configura as abas da view "Novo Documento" (Gravar, Upload, Transcrição)
 */
function setupNewDocumentTabs() {
    const tabsContainer = document.querySelector('#new-view .library-filters'); // Reutiliza a classe
    const contentContainer = document.getElementById('newDocumentContent');

    if (!tabsContainer || !contentContainer) return;

    tabsContainer.addEventListener('click', (e) => {
        const tabButton = e.target.closest('.library-filter[data-new-tab]');
        if (!tabButton) return;

        const targetTabId = tabButton.dataset.newTab;
        state.activeNewDocumentTab = targetTabId;

        // Atualiza botão ativo
        tabsContainer.querySelectorAll('.library-filter').forEach(btn => {
            btn.classList.toggle('active', btn === tabButton);
        });

        // Mostra/esconde painéis de conteúdo
        contentContainer.querySelectorAll(':scope > div[id$="-tab"]').forEach(panel => {
            panel.style.display = panel.id === `${targetTabId}-tab` ? 'block' : 'none';
        });
    });

    // Garante que a aba inicial esteja visível
    contentContainer.querySelectorAll(':scope > div[id$="-tab"]').forEach(panel => {
        panel.style.display = panel.id === `${state.activeNewDocumentTab}-tab` ? 'block' : 'none';
    });
}


/**
 * Configura o módulo de gravação de áudio
 */
function setupRecorder() {
    // Elementos da UI
    const startBtn = document.getElementById('startRecordingBtn');
    const stopBtn = document.getElementById('stopRecordingBtn');
    const pauseBtn = document.getElementById('pauseRecordingBtn'); // Assumindo que existe
    const timerDisplay = document.getElementById('recordingTime');
    const statusDisplay = document.getElementById('recordingStatus');
    const visualizer = document.getElementById('visualizerBars');
    const progressContainer = document.getElementById('recordingProgress');
    const progressBar = document.getElementById('recordingProgressBar');
    const progressPercent = document.getElementById('recordingProgressPercentage');
    const progressStatus = document.getElementById('recordingProgressStatus');
    const previewContainer = document.getElementById('recordingPreview');
    const previewName = document.getElementById('recordingFileName');
    const previewMeta = document.getElementById('recordingFileMeta');
    const removePreviewBtn = document.getElementById('recordingRemoveBtn');
    const processBtn = document.getElementById('processRecordingBtn');
    const stepsContainer = document.getElementById('transcriptionSteps');
    const stepsProgress = document.getElementById('transcriptionStepsProgress');
    const completedPanel = document.getElementById('transcriptionCompletedPanel');
    const livePreview = document.getElementById('liveTranscriptionPreview'); // Live preview element

    if (!startBtn || !stopBtn || !timerDisplay || !statusDisplay || !visualizer) return;

    // --- Lógica de Gravação (Simulada) ---
    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    // pauseBtn?.addEventListener('click', pauseRecording); // Se houver botão de pausa

    removePreviewBtn?.addEventListener('click', () => {
        // Limpa a pré-visualização da gravação (se aplicável após parar)
        previewContainer.style.display = 'none';
        processBtn.style.display = 'none';
        // Poderia resetar o estado da gravação aqui
    });

    processBtn?.addEventListener('click', () => {
        // Inicia a simulação de processamento da gravação
        simulateProcessing('recording', stepsContainer, stepsProgress, progressContainer, progressBar, progressPercent, progressStatus, completedPanel);
    });

     // Configurar AudioContext para visualizador (apenas uma vez)
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioContext = new AudioContext();
    } catch (e) {
        console.warn('Web Audio API não suportada neste navegador.');
        visualizer.innerHTML = '<p style="text-align:center; padding: 1rem; color: var(--text-tertiary);">Visualizador não suportado.</p>';
    }
}

function startRecording() {
    if (state.isRecording || state.isProcessing) return;
    state.isRecording = true;

    console.log("Iniciando gravação (simulada)");
    showToast('info', 'Gravação Iniciada', 'A gravação de áudio começou.');

    // Atualiza UI
    document.getElementById('startRecordingBtn').classList.add('hidden');
    document.getElementById('stopRecordingBtn').classList.remove('hidden');
    // document.getElementById('pauseRecordingBtn')?.classList.remove('hidden');
    document.getElementById('recordingStatus').textContent = 'Gravando...';
    document.getElementById('recordingPreview').style.display = 'none'; // Esconde preview anterior
    document.getElementById('processRecordingBtn').style.display = 'none';
    document.getElementById('transcriptionSteps').style.display = 'none';
    document.getElementById('transcriptionCompletedPanel').style.display = 'none';
    document.getElementById('liveTranscriptionPreview').classList.remove('active'); // Esconde live preview

    // Inicia timer
    state.recordingStartTime = Date.now();
    updateTimer(); // Chama imediatamente
    state.recordingInterval = setInterval(updateTimer, 1000);

    // Inicia visualizador (se API suportada)
    startVisualizer();
}

function stopRecording() {
    if (!state.isRecording) return;
    state.isRecording = false;

    console.log("Parando gravação (simulada)");
    showToast('info', 'Gravação Parada', 'A gravação foi concluída.');

    // Para timer e visualizador
    clearInterval(state.recordingInterval);
    state.recordingInterval = null;
    stopVisualizer();

    // Atualiza UI
    document.getElementById('startRecordingBtn').classList.remove('hidden');
    document.getElementById('stopRecordingBtn').classList.add('hidden');
    // document.getElementById('pauseRecordingBtn')?.classList.add('hidden');
    document.getElementById('recordingStatus').textContent = 'Gravação finalizada';

    // Mostra preview e botão de processar (simulação)
    const duration = Math.floor((Date.now() - state.recordingStartTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const fileSize = (duration * 0.1).toFixed(1); // Tamanho simulado
    const fileName = `Gravacao_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '')}.mp3`;

    document.getElementById('recordingFileName').textContent = fileName;
    document.getElementById('recordingFileMeta').textContent = `${fileSize} MB • ${formattedDuration}`;
    document.getElementById('recordingPreview').style.display = 'flex';
    document.getElementById('processRecordingBtn').style.display = 'inline-flex';

    // Adiciona a gravação simulada à lista de documentos (opcional)
    /*
    state.documents.push({
        id: `doc${state.documents.length + 1}`,
        title: fileName, type: 'audio', date: new Date().toLocaleDateString('pt-BR'), time: new Date().toLocaleTimeString('pt-BR'),
        icon: 'fas fa-microphone', color: '#8B5CF6', size: `${fileSize} MB`, duration: formattedDuration
    });
    */
}

function updateTimer() {
    if (!state.recordingStartTime) return;
    const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;
    const timerDisplay = document.getElementById('recordingTime');
    if (timerDisplay) {
        timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function startVisualizer() {
    if (!state.audioContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("Visualizador não pode ser iniciado: API não suportada ou permissão negada.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
            state.analyser = state.audioContext.createAnalyser();
            state.visualizerSource = state.audioContext.createMediaStreamSource(stream);
            state.visualizerSource.connect(state.analyser);
            state.analyser.fftSize = 256; // Tamanho da análise

            const bufferLength = state.analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const visualizerBars = document.getElementById('visualizerBars');
            visualizerBars.innerHTML = ''; // Limpa barras antigas

            // Cria as barras
            for (let i = 0; i < bufferLength / 2; i++) { // Usa metade do buffer
                const bar = document.createElement('div');
                bar.className = 'visualizer-bar';
                bar.style.height = '0%';
                visualizerBars.appendChild(bar);
            }

            const draw = () => {
                if (!state.isRecording) return; // Para se a gravação parar

                state.visualizerRafId = requestAnimationFrame(draw);
                state.analyser.getByteFrequencyData(dataArray);

                const bars = visualizerBars.children;
                for (let i = 0; i < bars.length; i++) {
                    const barHeight = (dataArray[i] / 255) * 100; // Normaliza para %
                    bars[i].style.height = `${barHeight}%`;
                }
            };
            draw();
        })
        .catch(err => {
            console.error('Erro ao acessar microfone para visualizador:', err);
            showToast('error', 'Erro de Microfone', 'Não foi possível acessar o microfone para o visualizador.');
        });
}

function stopVisualizer() {
    if (state.visualizerRafId) {
        cancelAnimationFrame(state.visualizerRafId);
        state.visualizerRafId = null;
    }
    if (state.visualizerSource) {
        state.visualizerSource.disconnect();
        // Para as tracks da stream para liberar o microfone
        state.visualizerSource.mediaStream.getTracks().forEach(track => track.stop());
        state.visualizerSource = null;
    }
    // Reseta as barras do visualizador
    const visualizerBars = document.getElementById('visualizerBars');
    if (visualizerBars) {
        const bars = visualizerBars.children;
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.height = '0%';
        }
    }
}

/**
 * Configura o módulo de upload de arquivos
 */
function setupUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadInput = document.getElementById('uploadInput');
    const previewContainer = document.getElementById('uploadPreview');
    const previewIcon = previewContainer?.querySelector('.upload-preview-icon i');
    const previewName = document.getElementById('uploadFileName');
    const previewMeta = document.getElementById('uploadFileMeta');
    const removePreviewBtn = document.getElementById('uploadRemoveBtn');
    const processBtn = document.getElementById('processUploadBtn');
    const progressContainer = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('uploadProgressBar');
    const progressPercent = document.getElementById('uploadProgressPercentage');
    const progressStatus = document.getElementById('uploadProgressStatus');
    const stepsContainer = document.getElementById('uploadTranscriptionSteps');
    const stepsProgress = document.getElementById('uploadTranscriptionStepsProgress');
    const completedPanel = document.getElementById('uploadCompletedPanel');

    if (!uploadArea || !uploadInput || !previewContainer || !processBtn) return;

    // Evento de clique para abrir seleção de arquivo
    uploadArea.addEventListener('click', () => uploadInput.click());

    // Eventos de Drag & Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    // Evento de mudança no input de arquivo
    uploadInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    // Botão de remover preview
    removePreviewBtn?.addEventListener('click', () => {
        state.uploadedFile = null;
        uploadInput.value = ''; // Limpa o input
        previewContainer.style.display = 'none';
        processBtn.style.display = 'none';
        progressContainer.style.display = 'none'; // Esconde progresso se houver
        stepsContainer.style.display = 'none';
        completedPanel.style.display = 'none';
    });

    // Botão de processar upload
    processBtn.addEventListener('click', () => {
        if (!state.uploadedFile) return;
        simulateProcessing('upload', stepsContainer, stepsProgress, progressContainer, progressBar, progressPercent, progressStatus, completedPanel);
    });
}

/**
 * Lida com os arquivos selecionados para upload
 */
function handleFiles(files) {
    if (state.isProcessing) {
        showToast('warning', 'Aguarde', 'Outro processo já está em andamento.');
        return;
    }
    if (files.length === 0) return;

    const file = files[0];
    state.uploadedFile = file; // Armazena o arquivo

    // Elementos UI
    const previewContainer = document.getElementById('uploadPreview');
    const previewIcon = previewContainer?.querySelector('.upload-preview-icon i');
    const previewName = document.getElementById('uploadFileName');
    const previewMeta = document.getElementById('uploadFileMeta');
    const processBtn = document.getElementById('processUploadBtn');

    // Atualiza preview
    if (previewName) previewName.textContent = file.name;
    if (previewMeta) previewMeta.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`; // Tamanho em MB
    if (previewIcon) { // Muda ícone baseado no tipo (simplificado)
        if (file.type.startsWith('audio/')) {
            previewIcon.className = 'fas fa-file-audio';
        } else if (file.type === 'text/plain' || file.name.endsWith('.md')) {
            previewIcon.className = 'fas fa-file-alt';
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
             previewIcon.className = 'fas fa-file-word';
        } else {
            previewIcon.className = 'fas fa-file';
        }
    }

    // Mostra preview e botão de processar
    if (previewContainer) previewContainer.style.display = 'flex';
    if (processBtn) processBtn.style.display = 'inline-flex';

    // Esconde outros painéis
     document.getElementById('uploadProgress').style.display = 'none';
     document.getElementById('uploadTranscriptionSteps').style.display = 'none';
     document.getElementById('uploadCompletedPanel').style.display = 'none';
}

/**
 * Configura a aba de transcrição manual
 */
function setupTranscriptionInput() {
    const processBtn = document.querySelector('#transcribe-tab #processTranscriptionBtn'); // Botão específico desta aba
    const textArea = document.getElementById('transcriptionText');
    const stepsContainer = document.getElementById('manualTranscriptionSteps');
    const stepsProgress = document.getElementById('manualTranscriptionStepsProgress');
    const completedPanel = document.getElementById('manualTranscriptionCompletedPanel');

    if (!processBtn || !textArea) return;

    processBtn.addEventListener('click', () => {
        const text = textArea.value.trim();
        if (!text) {
            showToast('warning', 'Campo vazio', 'Por favor, insira o texto da transcrição.');
            return;
        }
        if (state.isProcessing) {
            showToast('warning', 'Aguarde', 'Outro processo já está em andamento.');
            return;
        }

        state.transcriptionText = text; // Salva no estado
        console.log("Transcrição manual salva:", text);

        // Simula processamento/análise
        simulateProcessing('manual', stepsContainer, stepsProgress, null, null, null, null, completedPanel);
    });
}


// --- Simulação de Processamento ---

/**
 * Define o estado de processamento e atualiza a UI (desabilita botões)
 */
function setProcessingState(isProcessing) {
    state.isProcessing = isProcessing;
    const buttonsToDisable = document.querySelectorAll(
        '#startRecordingBtn, #stopRecordingBtn, #processRecordingBtn, ' +
        '#uploadInput, #processUploadBtn, #uploadRemoveBtn, ' +
        '#transcribe-tab #processTranscriptionBtn, ' +
        '#startProcessingBtn, .document-format-option, ' +
        '.nav-item, .sidebar-link, .mobile-menu-item, .patient-tab, .dimensional-tab, ' +
        '.document-action-btn, .toolbar-btn' // Desabilita ações e navegação
    );
    buttonsToDisable.forEach(btn => btn.disabled = isProcessing);

     // Adiciona/remove uma classe no body para feedback visual global (opcional)
     document.body.classList.toggle('processing', isProcessing);
}

/**
 * Simula o processamento de gravação, upload ou transcrição manual
 */
function simulateProcessing(type, stepsContainer, stepsProgress, progressContainer, progressBar, progressPercent, progressStatus, completedPanel) {
    setProcessingState(true);

    // Esconde botões de iniciar e previews
    if (type === 'recording') {
        document.getElementById('processRecordingBtn').style.display = 'none';
        document.getElementById('recordingPreview').style.display = 'none';
        document.getElementById('liveTranscriptionPreview').classList.add('active'); // Mostra live preview
    } else if (type === 'upload') {
        document.getElementById('processUploadBtn').style.display = 'none';
        document.getElementById('uploadPreview').style.display = 'none';
    } else if (type === 'manual') {
        document.querySelector('#transcribe-tab #processTranscriptionBtn').style.display = 'none';
    }

    // Mostra steps e/ou progresso
    if (stepsContainer) stepsContainer.style.display = 'block';
    if (progressContainer) progressContainer.style.display = 'block';
    if (completedPanel) completedPanel.style.display = 'none'; // Garante que painel completo está escondido

    let currentStep = 1;
    const totalSteps = 4;
    let progress = 0;
    const durationPerStep = 1500; // ms

    // Função para atualizar UI de progresso
    const updateUI = (step, stepProgress, overallProgress, statusText) => {
        // Atualiza indicador de passos
        if (stepsContainer && stepsProgress) {
            updateStepProgress(stepsContainer.id, stepsProgress.id, step);
        }
        // Atualiza barra de progresso
        if (progressContainer && progressBar && progressPercent && progressStatus) {
            updateProgressBar(progressBar.id, progressPercent.id, progressStatus.id, overallProgress, statusText);
        }
         // Simula live transcription para gravação
         if (type === 'recording' && step === 2 && stepProgress > 0 && stepProgress < 100) {
             const livePreview = document.getElementById('liveTranscriptionPreview');
             if (livePreview && !livePreview.querySelector('.typing')) { // Adiciona cursor se não existir
                 livePreview.innerHTML += '<p><span class="typing"></span></p>';
             }
         }
    };

    // Inicia simulação
    updateUI(currentStep, 0, progress, `Iniciando ${type === 'manual' ? 'análise' : 'processamento'}...`);

    const stepInterval = setInterval(() => {
        progress += 100 / totalSteps / (durationPerStep / 100); // Incrementa progresso
        let stepProgress = (progress % (100 / totalSteps)) * (totalSteps); // Progresso dentro do passo atual (0-100)

        // Determina o texto do status baseado no passo atual
        let statusText = "";
        switch (currentStep) {
            case 1: statusText = type === 'upload' ? "Fazendo Upload..." : (type === 'manual' ? "Validando Texto..." : "Processando Áudio..."); break;
            case 2: statusText = type === 'manual' ? "Processando Estrutura..." : "Realizando Transcrição..."; break;
            case 3: statusText = type === 'manual' ? "Analisando Conteúdo..." : (type === 'recording' || type === 'upload' ? "Aplicando Diarização..." : "Finalizando..."); break;
            case 4: statusText = "Finalizando..."; break;
        }

        updateUI(currentStep, stepProgress, Math.min(progress, 100), statusText);

        // Avança para o próximo passo
        if (progress >= (currentStep * 100 / totalSteps)) {
            // Marca passo como completo visualmente
            const currentStepElem = stepsContainer?.querySelector(`.transcription-step[data-step="${currentStep}"]`);
            if (currentStepElem) currentStepElem.classList.add('completed');

            currentStep++;
            if (currentStep > totalSteps) {
                clearInterval(stepInterval);
                // Simulação concluída
                setTimeout(() => {
                     // Esconde live preview se estava ativo
                     const livePreview = document.getElementById('liveTranscriptionPreview');
                     if (livePreview) livePreview.classList.remove('active');

                    if (progressContainer) progressContainer.style.display = 'none'; // Esconde barra
                    if (completedPanel) completedPanel.style.display = 'flex'; // Mostra painel de concluído
                    setProcessingState(false);
                    showToast('success', 'Processo Concluído', `Seu ${type === 'manual' ? 'texto' : 'arquivo'} foi processado.`);
                    // Adiciona documento à lista (se não for manual)
                    if (type !== 'manual') {
                        // Adicionar lógica para criar e adicionar o documento .txt à state.documents
                        // Exemplo: addProcessedDocument(state.uploadedFile?.name || 'Gravacao.txt');
                    }
                }, 500); // Pequeno delay antes de mostrar concluído
            }
        }
    }, 100); // Intervalo de atualização da UI
}

/**
 * Atualiza a UI dos indicadores de passo
 */
function updateStepProgress(stepsContainerId, progressIndicatorId, currentStep) {
    const stepsContainer = document.getElementById(stepsContainerId);
    const progressIndicator = document.getElementById(progressIndicatorId);
    if (!stepsContainer || !progressIndicator) return;

    const steps = stepsContainer.querySelectorAll('.transcription-step');
    const totalSteps = steps.length;
    if (totalSteps === 0) return;

    // Calcula a porcentagem de progresso da linha
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressIndicator.style.width = `${Math.min(progressPercent, 100)}%`;

    // Atualiza classes dos círculos
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.toggle('active', stepNumber === currentStep);
        step.classList.toggle('completed', stepNumber < currentStep);
    });
}

/**
 * Atualiza a UI da barra de progresso
 */
function updateProgressBar(barId, percentageId, statusId, percentage, statusText) {
    const bar = document.getElementById(barId);
    const percentLabel = document.getElementById(percentageId);
    const statusLabel = document.getElementById(statusId);

    const clampedPercentage = Math.min(Math.max(percentage, 0), 100); // Garante 0-100

    if (bar) bar.style.width = `${clampedPercentage}%`;
    if (percentLabel) percentLabel.textContent = `${Math.round(clampedPercentage)}%`;
    if (statusLabel) statusLabel.textContent = statusText;
}


// --- View: Processamento (#processing-view) ---

/**
 * Configura a view de processamento de documentos
 */
function setupProcessing() {
    const formatOptionsContainer = document.querySelector('#processing-view .document-format-options');
    const startBtn = document.getElementById('startProcessingBtn');
    const progressContainer = document.getElementById('processingProgress');
    const completedPanel = document.getElementById('processingCompletedPanel');
    const viewResultsBtn = document.getElementById('viewResultsBtn');

    if (!formatOptionsContainer || !startBtn) return;

    // Seleção de formatos
    formatOptionsContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.document-format-option');
        if (option) {
            option.classList.toggle('active'); // Permite selecionar múltiplos
        }
    });

    // Iniciar processamento
    startBtn.addEventListener('click', () => {
        if (state.isProcessing) {
            showToast('warning', 'Aguarde', 'Outro processo já está em andamento.');
            return;
        }
        const selectedFormats = Array.from(formatOptionsContainer.querySelectorAll('.document-format-option.active'))
                                   .map(opt => opt.dataset.format);

        if (selectedFormats.length === 0) {
            showToast('warning', 'Nenhum formato', 'Selecione pelo menos um formato para gerar.');
            return;
        }

        console.log("Iniciando geração para formatos:", selectedFormats);
        simulateGeneration(selectedFormats, progressContainer, completedPanel);
    });

    // Botão para ver resultados
    viewResultsBtn?.addEventListener('click', () => {
        switchView('results');
        // Ativa a primeira aba de resultado gerado (ex: VINTRA se foi gerado)
        const firstGeneratedFormat = Array.from(formatOptionsContainer.querySelectorAll('.document-format-option.active'))
                                         .map(opt => opt.dataset.format)[0];
        if (firstGeneratedFormat) {
             activateResultsTab(`${firstGeneratedFormat}-panel`);
        } else {
             activateResultsTab('transcription-panel'); // Fallback para transcrição
        }
    });
}

/**
 * Simula a geração dos documentos selecionados
 */
function simulateGeneration(formats, progressContainer, completedPanel) {
    setProcessingState(true);
    document.getElementById('startProcessingBtn').style.display = 'none'; // Esconde botão
    progressContainer.style.display = 'block';
    completedPanel.style.display = 'none';

    let progress = 0;
    const totalDuration = 3000; // 3 segundos de simulação
    const updateInterval = 50; // ms

    updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', 0, 'Iniciando geração...');

    const intervalId = setInterval(() => {
        progress += (updateInterval / totalDuration) * 100;
        if (progress >= 100) {
            clearInterval(intervalId);
            progress = 100;
            updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', 100, 'Geração concluída!');
            setTimeout(() => {
                progressContainer.style.display = 'none';
                completedPanel.style.display = 'flex';
                setProcessingState(false);
                document.getElementById('startProcessingBtn').style.display = 'inline-flex'; // Mostra botão novamente
                showToast('success', 'Documentos Gerados', `Formatos ${formats.join(', ')} criados.`);
                // Atualiza o estado com conteúdo simulado (poderia vir de uma API)
                formats.forEach(format => {
                    const key = `${format}Text`;
                    if (state.hasOwnProperty(key)) {
                        state[key] = `# ${format.toUpperCase()} Gerado\n\nEste é o conteúdo simulado para o formato ${format.toUpperCase()} baseado na transcrição.\nData: ${new Date().toLocaleString('pt-BR')}`;
                    }
                });
            }, 500);
        } else {
            updateProgressBar('processingProgressBar', 'processingProgressPercentage', 'processingProgressStatus', progress, `Gerando formato ${formats[Math.floor(progress / (100 / formats.length))] || formats[formats.length - 1]}...`);
        }
    }, updateInterval);
}

/**
 * Inicia o fluxo de processamento a partir de um documento da biblioteca
 */
function startProcessingDocument(docId) {
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) {
        showToast('error', 'Erro', 'Documento não encontrado.');
        return;
    }

    // Só permite processar transcrições ou áudios (que seriam transcritos primeiro)
    if (doc.type !== 'transcription' && doc.type !== 'audio') {
        showToast('warning', 'Não aplicável', `Só é possível processar transcrições ou áudios.`);
        return;
    }

    state.currentDocumentId = docId; // Define o documento a ser processado
    // Assume que a transcrição existe ou será gerada a partir do áudio
    state.transcriptionText = getDocumentContent('transcription') || `(Transcrição simulada para ${doc.title})`;

    // Atualiza o título na view de processamento
    const processingTitle = document.getElementById('processingDocumentTitle');
    if (processingTitle) processingTitle.textContent = doc.title;

    // Muda para a view de processamento
    switchView('processing');
}


// --- View: Resultados (#results-view) ---

/**
 * Configura a view de resultados
 */
function setupResultsView() {
    const tabsContainer = document.querySelector('#results-view .document-tabs');
    const downloadBtn = document.getElementById('downloadResultsBtn'); // Botão de download geral

    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.document-tab');
            if (tab && tab.dataset.panel) {
                activateResultsTab(tab.dataset.panel);
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Lógica de download: baixa o conteúdo da aba ativa
            const activePanelId = state.activeResultsTab; // e.g., 'vintra-panel'
            const docType = activePanelId.replace('-panel', ''); // e.g., 'vintra'
            const docTitle = document.getElementById('resultsDocumentTitle')?.textContent || 'Resultados';
            const downloadTitle = `${docTitle.replace(/\.[^/.]+$/, "")}_${docType}.txt`; // Adiciona tipo ao nome

            const content = getDocumentContent(docType);
            if (!content || content.includes('não disponível') || content.includes('(Conteúdo padrão)')) {
                 showToast('warning', 'Conteúdo indisponível', `Não há conteúdo gerado para ${docType}.`);
                 return;
            }

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadTitle;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('success', 'Download Iniciado', `${downloadTitle} está sendo baixado.`);
            }, 100);
        });
    }
}

/**
 * Ativa uma aba específica na view de resultados
 */
function activateResultsTab(panelId) {
    if (state.activeResultsTab === panelId) return;
    state.activeResultsTab = panelId;

    // Atualiza botões ativos
    document.querySelectorAll('#results-view .document-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
    });

    // Anima painéis
    const panelsContainer = document.querySelector('#results-view .document-tab-panels');
    const activePanel = document.getElementById(panelId);
    const currentActivePanel = panelsContainer?.querySelector('.document-tab-panel.active');

    if (!activePanel) return;

    // Carrega o conteúdo no painel ativo
    const docType = panelId.replace('-panel', '');
    const content = getDocumentContent(docType);
    const viewElement = activePanel.querySelector('.document-view');
    if (viewElement) {
        viewElement.innerHTML = `<pre>${content}</pre>`; // Usa <pre>
    }

    // Animação de transição
    if (currentActivePanel && currentActivePanel !== activePanel) {
        gsap.to(currentActivePanel, {
            opacity: 0, duration: 0.2, ease: "power1.in", onComplete: () => {
                currentActivePanel.classList.remove('active');
                activePanel.classList.add('active');
                gsap.fromTo(activePanel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
            }
        });
    } else if (!currentActivePanel) {
        activePanel.classList.add('active');
        gsap.fromTo(activePanel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out" });
    }
}


// --- Biblioteca de Documentos ---

/**
 * Configura a interatividade da biblioteca de documentos
 */
function setupDocumentLibrary() {
    const libraryFilters = document.querySelector('#library-view .library-filters');
    const searchInput = document.querySelector('#library-view .library-search-input');

    // Filtros
    if (libraryFilters) {
        libraryFilters.addEventListener('click', (e) => {
            const filterBtn = e.target.closest('.library-filter[data-filter]');
            if (filterBtn) {
                const filterValue = filterBtn.dataset.filter;
                // Remove active de outros botões e adiciona no clicado
                libraryFilters.querySelectorAll('.library-filter').forEach(btn => btn.classList.remove('active'));
                filterBtn.classList.add('active');
                // Renderiza a biblioteca com o filtro aplicado
                renderDocumentLibrary(filterValue);
            }
        });
    }

    // Busca (simples, filtra pelo título)
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            const searchTerm = searchInput.value.toLowerCase();
            const currentFilter = libraryFilters?.querySelector('.library-filter.active')?.dataset.filter || 'all';
            filterAndRenderLibrary(currentFilter, searchTerm);
        }, 300)); // Debounce para evitar buscas a cada tecla
    }
}

/**
 * Filtra e renderiza a biblioteca com base no filtro de tipo e termo de busca
 */
function filterAndRenderLibrary(typeFilter, searchTerm) {
     const container = document.getElementById('documentList');
    if (!container) return;

    container.innerHTML = ''; // Limpa a lista

    const filteredDocs = state.documents.filter(doc =>
        (typeFilter === 'all' || doc.type === typeFilter) &&
        (!searchTerm || doc.title.toLowerCase().includes(searchTerm))
    );

    if (filteredDocs.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; text-align: center; color: var(--text-tertiary);">Nenhum documento encontrado.</p>';
        return;
    }

    // Reutiliza a lógica de renderDocumentLibrary, mas com os documentos já filtrados
    filteredDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'document-item';
        item.classList.add(`document-${doc.type}`);
        item.dataset.id = doc.id;
        item.dataset.type = doc.type;

        item.innerHTML = `
            <div class="document-icon">
                <i class="${doc.icon || 'fas fa-file'}"></i>
            </div>
            <div class="document-info">
                <div class="document-title">${doc.title}</div>
                <div class="document-meta">${doc.date}</div>
            </div>
            <div class="document-actions">
                 <button class="document-action-btn process-doc" title="Processar">
                     <i class="fas fa-cogs"></i>
                 </button>
                 <button class="document-action-btn download-doc" title="Download">
                     <i class="fas fa-download"></i>
                 </button>
            </div>
        `;

        item.addEventListener('click', () => {
            setActiveDocumentItem(doc.id);
            viewDocumentInWorkspace(doc.id);
        });
        item.querySelector('.process-doc').addEventListener('click', (e) => { e.stopPropagation(); startProcessingDocument(doc.id); });
        item.querySelector('.download-doc').addEventListener('click', (e) => { e.stopPropagation(); downloadDocument(doc.id); });

        container.appendChild(item);
    });

    // Mantém o item ativo se ele ainda estiver visível após filtrar
     if (state.currentDocumentId && !filteredDocs.some(d => d.id === state.currentDocumentId)) {
         // Se o item ativo não está mais visível, limpa a seleção e a visualização
         state.currentDocumentId = null;
         showEmptyDocumentView();
     } else if (state.currentDocumentId) {
         setActiveDocumentItem(state.currentDocumentId); // Reafirma a seleção
     } else {
         showEmptyDocumentView(); // Mostra vazio se nada estiver selecionado
     }
}


// --- Modo Foco ---
function setupFocusMode() {
    const toggleBtn = document.getElementById('focusModeToggle'); // Botão na view 'new'
    const toggleBtnProcessing = document.getElementById('focusModeToggleProcessing'); // Botão na view 'processing'

    const toggleAction = () => {
        document.body.classList.toggle('focus-mode');
        // Atualiza ícone do botão (exemplo)
        const icon = toggleBtn?.querySelector('i');
        const iconProcessing = toggleBtnProcessing?.querySelector('i');
        const isFocus = document.body.classList.contains('focus-mode');
        if (icon) icon.className = isFocus ? 'fas fa-compress-alt' : 'fas fa-expand-alt';
        if (iconProcessing) iconProcessing.className = isFocus ? 'fas fa-compress-alt' : 'fas fa-expand-alt';
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleAction);
    if (toggleBtnProcessing) toggleBtnProcessing.addEventListener('click', toggleAction);
}

// --- Notificações Toast ---

/**
 * Mostra uma notificação toast
 * @param {'success' | 'error' | 'warning' | 'info'} type Tipo de toast
 * @param {string} title Título do toast
 * @param {string} message Mensagem do toast
 * @param {number} duration Duração em ms (padrão 5000)
 */
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`; // Adiciona classe de tipo para estilização extra

    let iconClass = 'fas fa-info-circle'; // Ícone padrão (info)
    if (type === 'success') iconClass = 'fas fa-check-circle';
    if (type === 'error') iconClass = 'fas fa-times-circle';
    if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';

    toast.innerHTML = `
        <div class="toast-icon ${type}">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // Animação de entrada (feita via CSS @keyframes toast-enter)

    // Botão de fechar
    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });

    // Remover automaticamente após duração
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Remove um toast específico com animação
 */
function removeToast(toastElement) {
    toastElement.classList.add('exit');
    // Remove do DOM após a animação de saída
    toastElement.addEventListener('animationend', () => {
        if (toastElement.parentNode) { // Verifica se ainda está no DOM
             toastElement.remove();
        }
    });
}

// --- Utilitários ---

/**
 * Debounce: Atrasar a execução de uma função até que um certo tempo tenha passado sem chamadas
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
