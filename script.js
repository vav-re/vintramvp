/**
 * VINTRA - Análise Dimensional Clínica
 * Script principal da aplicação
 */

// Estado global da aplicação
const state = {
    transcriptionText: "",
    vintraText: "",
    soapText: "",
    ipissimaText: "",
    narrativeText: "",
    orientacoesText: "",
    recordedBlob: null,
    uploadedFile: null,
    currentModalDocType: null,
    activeTab: "dashboard",
    isDiarizationEnabled: true,
    isProcessing: false, // Flag global para impedir processos simultâneos
    recentDocuments: [], // Documentos recentes para o dashboard
    documents: [] // Documentos na biblioteca
};

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar animação do logo de splash
    setTimeout(() => {
        animateLogo();
    }, 500);
    
    // Carregar dados de exemplo
    loadDemoData();
    
    // Configurar eventos do sistema
    setupLogin();
    setupNavigation();
    setupSidebar();
    setupMobileMenu();
    setupRecorder();
    setupUpload();
    setupTranscription();
    setupProcessing();
    setupResultsTabs();
    setupModal();
    setupFocusMode();
    initFluidAnimations();
});

/**
 * Carrega dados de exemplo para demonstração
 */
function loadDemoData() {
    // Exemplo de documentos recentes para o dashboard
    state.recentDocuments = [
        { id: 'doc1', title: 'Entrevista_Maria.mp3', type: 'audio', date: '25/03/2025', time: '10:30', icon: 'fas fa-microphone', color: '#8B5CF6' },
        { id: 'doc2', title: 'Transcrição_Maria.txt', type: 'transcription', date: '25/03/2025', time: '10:35', icon: 'fas fa-file-alt', color: '#6366F1' },
        { id: 'doc3', title: 'VINTRA_Maria.txt', type: 'vintra', date: '25/03/2025', time: '10:40', icon: 'fas fa-clipboard-list', color: '#0EA5E9' },
        { id: 'doc4', title: 'SOAP_Maria.txt', type: 'soap', date: '25/03/2025', time: '10:45', icon: 'fas fa-notes-medical', color: '#10B981' }
    ];
    
    // Exemplo de documentos para a biblioteca
    state.documents = [
        { id: 'doc1', title: 'Entrevista_Maria.mp3', type: 'audio', date: '25/03/2025', time: '10:30', meta: '15.3 MB', icon: 'fas fa-microphone', color: '#8B5CF6' },
        { id: 'doc2', title: 'Transcrição_Maria.txt', type: 'transcription', date: '25/03/2025', time: '10:35', meta: '12.8 KB', icon: 'fas fa-file-alt', color: '#6366F1' },
        { id: 'doc3', title: 'VINTRA_Maria.txt', type: 'vintra', date: '25/03/2025', time: '10:40', meta: '14.5 KB', icon: 'fas fa-clipboard-list', color: '#0EA5E9' },
        { id: 'doc4', title: 'SOAP_Maria.txt', type: 'soap', date: '25/03/2025', time: '10:45', meta: '9.2 KB', icon: 'fas fa-notes-medical', color: '#10B981' },
        { id: 'doc5', title: 'Análise_Narrativa_Maria.txt', type: 'narrative', date: '25/03/2025', time: '10:50', meta: '11.7 KB', icon: 'fas fa-book', color: '#F59E0B' },
        { id: 'doc6', title: 'Ipíssima_Maria.txt', type: 'ipissima', date: '25/03/2025', time: '10:55', meta: '7.3 KB', icon: 'fas fa-quote-right', color: '#EC4899' },
        { id: 'doc7', title: 'Orientações_Maria.txt', type: 'orientacoes', date: '25/03/2025', time: '11:00', meta: '8.5 KB', icon: 'fas fa-clipboard-check', color: '#8B5CF6' }
    ];
    
    // Exemplo de conteúdo para transcrição
    state.transcriptionText = `Entrevista Clínica - 25 de Março de 2025

Médico: Bom dia, Maria. Como você está se sentindo hoje?

Paciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar.

Médico: Entendo. Pode me falar mais sobre essa dor? Onde você sente mais intensamente?

Paciente: É nas costas, na região lombar principalmente. Mas também tenho dor nas pernas, uma dormência às vezes. E dor de cabeça quase todo dia. Tomo dipirona direto.

Médico: E quando começou isso? Você se lembra de algum evento específico?

Paciente: Foi depois que meu marido faleceu, em janeiro. Ele era meu companheiro, meu amigo. E eu sinto muita falta, eu não me conformo... [paciente fica emocionada]. Depois disso, parece que meu corpo desabou. Antes eu tinha algumas dores, mas nada assim.

Médico: Sinto muito pela sua perda, Maria. É um momento muito difícil mesmo. Como está seu sono?

Paciente: Péssimo. Demoro pra dormir, acordo várias vezes de madrugada. Fico pensando nele, nas coisas que a gente fazia. Na nossa rotina. Aí tomo o clonazepam que o outro médico me receitou, mas mesmo assim...

Médico: E seu apetite?

Paciente: Diminuiu bastante. Não tenho vontade de cozinhar só pra mim. Era ele que gostava dos meus pratos. Às vezes fico o dia inteiro só com café. Emagreci quase 6 quilos nos últimos meses.`;
    
    // Preencher documentos recentes no dashboard
    const recentDocumentsEl = document.getElementById('recentDocuments');
    if (recentDocumentsEl) {
        recentDocumentsEl.innerHTML = '';
        state.recentDocuments.forEach(doc => {
            const item = createDocumentItem(doc, 'recent');
            recentDocumentsEl.appendChild(item);
        });
    }
    
    // Preencher documentos na biblioteca
    const documentListEl = document.getElementById('documentList');
    if (documentListEl) {
        documentListEl.innerHTML = '';
        const section = document.createElement('div');
        section.className = 'library-section';
        
        const header = document.createElement('div');
        header.className = 'library-section-header';
        header.innerHTML = `
            <div class="library-section-title">Todos os Documentos</div>
        `;
        
        const content = document.createElement('div');
        
        state.documents.forEach(doc => {
            const item = createDocumentItem(doc, 'library');
            content.appendChild(item);
        });
        
        section.appendChild(header);
        section.appendChild(content);
        documentListEl.appendChild(section);
    }
    
    // Preencher conteúdo de resultado para demonstração
    document.getElementById('transcriptionContent').textContent = state.transcriptionText;
}

/**
 * Cria um item de documento para listar no dashboard ou biblioteca
 */
function createDocumentItem(doc, type = 'library') {
    const item = document.createElement('div');
    
    if (type === 'library') {
        item.className = `document-item ${doc.type}`;
        item.dataset.id = doc.id;
        item.dataset.type = doc.type;
        
        item.innerHTML = `
            <div class="document-icon" style="color: ${doc.color}">
                <i class="${doc.icon}"></i>
            </div>
            <div class="document-info">
                <div class="document-title">${doc.title}</div>
                <div class="document-meta">${doc.date} • ${doc.time} • ${doc.meta}</div>
            </div>
            <div class="document-actions">
                <button class="document-action-btn">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
        
        // Adicionar evento para visualização do documento
        item.addEventListener('click', function() {
            setActiveDocument(doc);
        });
    } else {
        item.className = 'recent-item glow-effect';
        item.dataset.id = doc.id;
        
        item.innerHTML = `
            <div class="recent-item-icon" style="color: ${doc.color}">
                <i class="${doc.icon}"></i>
            </div>
            <div class="recent-item-info">
                <div class="recent-item-title">${doc.title}</div>
                <div class="recent-item-meta">
                    <span>${getTypeLabel(doc.type)}</span>
                    <div class="recent-item-meta-divider"></div>
                    <span>${doc.date}</span>
                    <div class="recent-item-meta-divider"></div>
                    <span>${doc.time}</span>
                </div>
            </div>
        `;
        
        // Adicionar evento para visualização do documento
        item.addEventListener('click', function() {
            switchView('library');
            setTimeout(() => {
                setActiveDocument(doc);
            }, 300);
        });
    }
    
    return item;
}

/**
 * Retorna o label do tipo de documento
 */
function getTypeLabel(type) {
    const labels = {
        'audio': 'Áudio',
        'transcription': 'Transcrição',
        'vintra': 'VINTRA',
        'soap': 'SOAP',
        'narrative': 'Análise Narrativa',
        'ipissima': 'Ipíssima',
        'orientacoes': 'Orientações'
    };
    
    return labels[type] || type;
}

/**
 * Define documento ativo na biblioteca e exibe seu conteúdo
 */
function setActiveDocument(doc) {
    // Remover classe ativa de todos os documentos
    document.querySelectorAll('.document-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe ativa ao documento selecionado
    const selectedItem = document.querySelector(`.document-item[data-id="${doc.id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Exibir conteúdo do documento
    const documentView = document.getElementById('documentView');
    if (!documentView) return;
    
    // Criar conteúdo baseado no tipo de documento
    let documentContent = '';
    
    switch (doc.type) {
        case 'audio':
            documentContent = `
                <div class="document-toolbar">
                    <div class="document-info-header">
                        <div class="document-info-icon" style="color: ${doc.color}">
                            <i class="${doc.icon}"></i>
                        </div>
                        <div class="document-info-details">
                            <h2>${doc.title}</h2>
                            <div class="document-info-meta">
                                <span>Modificado: ${doc.date} ${doc.time}</span>
                                <div class="document-info-meta-divider"></div>
                                <span>${doc.meta}</span>
                            </div>
                        </div>
                    </div>
                    <div class="document-toolbar-actions">
                        <button class="toolbar-btn">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                        <button class="toolbar-btn primary" onclick="processAudio('${doc.id}')">
                            <i class="fas fa-file-alt"></i> Transcrever
                        </button>
                    </div>
                </div>
                <div class="document-content">
                    <div class="document-container" style="text-align: center; padding: 3rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem; color: ${doc.color}">
                            <i class="${doc.icon}"></i>
                        </div>
                        <h3 style="margin-bottom: 1rem;">Gravação de Áudio</h3>
                        <p style="margin-bottom: 2rem; color: var(--text-secondary);">Duração: 28:45</p>
                        <audio controls style="width: 100%; max-width: 400px;">
                            <source src="#" type="audio/mpeg">
                            Seu navegador não suporta o elemento de áudio.
                        </audio>
                        <p style="margin-top: 2rem; color: var(--text-tertiary);">
                            <i class="fas fa-info-circle"></i> 
                            Este arquivo de áudio pode ser processado para gerar uma transcrição automática.
                        </p>
                        <button class="btn btn-primary" style="margin-top: 2rem;" onclick="processAudio('${doc.id}')">
                            <i class="fas fa-file-alt btn-icon"></i>
                            Transcrever Áudio
                        </button>
                    </div>
                </div>
            `;
            break;
            
        case 'transcription':
            documentContent = `
                <div class="document-toolbar">
                    <div class="document-info-header">
                        <div class="document-info-icon" style="color: ${doc.color}">
                            <i class="${doc.icon}"></i>
                        </div>
                        <div class="document-info-details">
                            <h2>${doc.title}</h2>
                            <div class="document-info-meta">
                                <span>Modificado: ${doc.date} ${doc.time}</span>
                                <div class="document-info-meta-divider"></div>
                                <span>${doc.meta}</span>
                            </div>
                        </div>
                    </div>
                    <div class="document-toolbar-actions">
                        <button class="toolbar-btn" id="editDocBtn">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="toolbar-btn">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                        <button class="toolbar-btn primary" onclick="processTranscription()">
                            <i class="fas fa-cogs"></i>
                            Processar
                        </button>
                    </div>
                </div>
                <div class="document-content">
                    <div class="document-container">
                        <div class="document-view" id="activeDocumentContent">${state.transcriptionText}</div>
                    </div>
                </div>
                <div class="document-footer">
                    <div class="document-status saved">
                        <i class="fas fa-check-circle"></i>
                        Salvo em ${doc.date} ${doc.time}
                    </div>
                    <div class="document-footer-actions">
                        <div class="processing-options">
                            <div class="option">
                                <input type="radio" id="process-vintra" name="process-type" checked>
                                <label for="process-vintra">VINTRA</label>
                            </div>
                            <div class="option">
                                <input type="radio" id="process-soap" name="process-type">
                                <label for="process-soap">SOAP</label>
                            </div>
                            <div class="option">
                                <input type="radio" id="process-narrative" name="process-type">
                                <label for="process-narrative">Análise Narrativa</label>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="processTranscription()">
                            <i class="fas fa-cogs btn-icon"></i>
                            Processar Documento
                        </button>
                    </div>
                </div>
            `;
            break;
            
        default:
            // Para documentos de resultado (VINTRA, SOAP, etc.)
            let content = '';
            if (doc.type === 'vintra' && state.vintraText) content = state.vintraText;
            else if (doc.type === 'soap' && state.soapText) content = state.soapText;
            else if (doc.type === 'ipissima' && state.ipissimaText) content = state.ipissimaText;
            else if (doc.type === 'narrative' && state.narrativeText) content = state.narrativeText;
            else if (doc.type === 'orientacoes' && state.orientacoesText) content = state.orientacoesText;
            else {
                // Gerar conteúdo de exemplo se não houver
                content = generateSampleContent(doc.type);
            }
            
            documentContent = `
                <div class="document-toolbar">
                    <div class="document-info-header">
                        <div class="document-info-icon" style="color: ${doc.color}">
                            <i class="${doc.icon}"></i>
                        </div>
                        <div class="document-info-details">
                            <h2>${doc.title}</h2>
                            <div class="document-info-meta">
                                <span>Modificado: ${doc.date} ${doc.time}</span>
                                <div class="document-info-meta-divider"></div>
                                <span>${doc.meta}</span>
                            </div>
                        </div>
                    </div>
                    <div class="document-toolbar-actions">
                        <button class="toolbar-btn" onclick="viewDocumentInModal('${doc.type}', '${doc.title}')">
                            <i class="fas fa-eye"></i>
                            Ver/Editar
                        </button>
                        <button class="toolbar-btn">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                    </div>
                </div>
                <div class="document-content">
                    <div class="document-container">
                        <div class="document-view">${content}</div>
                    </div>
                </div>
            `;
    }
    
    documentView.innerHTML = documentContent;
    
    // Adicionar eventos após inserir o HTML
    const editDocBtn = document.getElementById('editDocBtn');
    if (editDocBtn) {
        editDocBtn.addEventListener('click', function() {
            viewDocumentInModal('transcription', doc.title);
        });
    }
}

/**
 * Função para processamento de áudio específico
 */
function processAudio(audioId) {
    // Simulação - na prática, usaria o arquivo de áudio real
    showToast('info', 'Iniciando processamento', 'Preparando para transcrever o áudio...');
    
    // Mudar para tela de processamento
    switchView('new');
    
    // Selecionar a aba de gravação
    const recordTab = document.querySelector('[data-new-tab="record"]');
    if (recordTab) {
        recordTab.click();
    }
    
    // Simular um arquivo de áudio carregado após um pequeno delay
    setTimeout(() => {
        // Mostrar o preview
        const recordingPreview = document.getElementById('recordingPreview');
        if (recordingPreview) recordingPreview.classList.add('visible');
        
        // Atualizar informações
        const recordingFileName = document.getElementById('recordingFileName');
        const recordingFileMeta = document.getElementById('recordingFileMeta');
        if (recordingFileName) recordingFileName.textContent = "Entrevista_Maria.mp3";
        if (recordingFileMeta) recordingFileMeta.textContent = "15.3 MB • 28:45";
        
        showToast('success', 'Áudio preparado', 'O áudio está pronto para ser transcrito.');
    }, 800);
}

/**
 * Gerar conteúdo de exemplo baseado no tipo de documento
 */
function generateSampleContent(type) {
    switch(type) {
        case 'vintra':
            return `# VINTRA - ANÁLISE DIMENSIONAL
**Paciente:** Maria
**Data:** 25 de Março de 2025

## QUEIXA PRINCIPAL
- Dor lombar persistente
- Insônia
- Perda de apetite
- Dores generalizadas (pernas, cefaleia)

## HISTÓRIA DA DOENÇA ATUAL
Paciente relata início dos sintomas após o falecimento do marido em janeiro. Queixa-se de dor lombar intensa, dormência nas pernas e cefaleia frequente. Refere uso contínuo de dipirona para alívio sintomático.

## MEDICAÇÕES EM USO
- Clonazepam (insônia)
- Fluoxetina (prescrito por psiquiatra)
- Dipirona (uso frequente para dor)
- Omeprazol
- Anti-inflamatório não especificado (refere azia como efeito colateral)`;
            
        case 'soap':
            return `# NOTA SOAP
**Paciente:** Maria
**Data:** 25 de Março de 2025
**Médico Responsável:** Dr. Santos

## S (SUBJETIVO)
Paciente feminina, idade não especificada, viúva recente (marido falecido em janeiro), queixa-se de dor lombar intensa, dormência nas pernas e cefaleia frequente. Refere que os sintomas iniciaram após o falecimento do marido. Relata uso de analgésicos (dipirona) constantemente, com pouco alívio.`;
            
        case 'ipissima':
            return `# IPÍSSIMA NARRATIVA
**Paciente:** Maria
**Data:** 25 de Março de 2025

---

Eu não estou bem. A dor continua mesmo tomando remédios, e parece que nada adianta. Durmo mal, acordo cansada, e às vezes penso que nunca vou melhorar.

A dor é principalmente nas costas, na região lombar. Também sinto dor nas pernas e uma dormência de vez em quando. Dor de cabeça quase todo dia, por isso tomo dipirona constantemente.`;
            
        case 'narrative':
            return `# ANÁLISE NARRATIVA
**Paciente:** Maria
**Data:** 25 de Março de 2025

## RESUMO DA NARRATIVA
Maria apresenta uma narrativa centrada em seu processo de luto, dor física e sofrimento emocional após o falecimento do marido em janeiro. Sua história organiza-se temporalmente em um "antes" e um "depois" da perda, com uma clara ruptura biográfica.`;
            
        case 'orientacoes':
            return `# ORIENTAÇÕES AO PACIENTE
**Nome:** Maria
**Data:** 25 de Março de 2025

## ENTENDENDO SEU QUADRO

Cara Maria,

A avaliação realizada hoje revelou que você está vivendo um período muito difícil de luto pela perda recente do seu marido. Este processo de luto está afetando tanto seu bem-estar emocional quanto físico, manifestando-se através de dores (especialmente lombares), problemas de sono, perda de apetite e isolamento social.`;
            
        default:
            return '<p>Conteúdo não disponível</p>';
    }
}

/**
 * Visualizar documento em modal
 */
function viewDocumentInModal(type, title) {
    let content = '';
    let typeFormatted = type;
    
    // Obter conteúdo baseado no tipo
    switch(type) {
        case 'transcription':
            content = state.transcriptionText;
            typeFormatted = 'Transcrição';
            break;
        case 'vintra':
            content = state.vintraText || generateSampleContent('vintra');
            typeFormatted = 'Formato VINTRA';
            break;
        case 'soap':
            content = state.soapText || generateSampleContent('soap');
            typeFormatted = 'Formato SOAP';
            break;
        case 'ipissima':
            content = state.ipissimaText || generateSampleContent('ipissima');
            typeFormatted = 'Ipíssima Narrativa';
            break;
        case 'narrative':
            content = state.narrativeText || generateSampleContent('narrative');
            typeFormatted = 'Análise Narrativa';
            break;
        case 'orientacoes':
            content = state.orientacoesText || generateSampleContent('orientacoes');
            typeFormatted = 'Orientações';
            break;
    }
    
    openModal(type, typeFormatted, content);
}

/**
 * Animação do logo na tela inicial
 */
function animateLogo() {
    // Configurar elementos do logo
    const paths = document.querySelectorAll('.logo-path');
    const logo = document.getElementById('vintra-logo');
    const backgroundGlow = document.querySelector('.background-glow');
    const splashScreen = document.getElementById('splashScreen');
    
    // Criar GSAP timeline para animação
    const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: function() {
            setTimeout(() => {
                if (splashScreen) {
                    splashScreen.classList.add('hidden');
                }
                const loginScreen = document.getElementById('loginScreen');
                if (loginScreen) {
                    loginScreen.classList.add('visible');
                }
            }, 500);
        }
    });
    
    // Inicializar os paths
    gsap.set(paths, {
        strokeDasharray: function(i, target) {
            return target.getTotalLength();
        },
        strokeDashoffset: function(i, target) {
            return target.getTotalLength();
        },
        opacity: 0.2
    });
    
   // Inicializar logo
gsap.set(logo, {
    scale: 0.98,
    opacity: 0.85,
    y: -50 // Adicione esta linha para começar mais acima
});

// Na sequência de animação
timeline
    .to(logo, {
        scale: 1.2, // Aumente para um valor maior que 1
        opacity: 1,
        duration: 2.5,
        ease: "sine.inOut"
    })
        // Animar traçados dos caminhos
        .to(paths, {
            strokeDashoffset: 0,
            duration: 1.8,
            opacity: 1,
            stagger: 0.08,
            ease: "sine.inOut"
        }, 0.5)
        // Glow durante o desenho
        .to(backgroundGlow, {
            opacity: 0.3,
            duration: 2.5,
            ease: "sine.inOut"
        }, 1)
        // Pausa antes de preencher
        .to({}, { duration: 0.8 })
        // Preenchimento gradual
        .to(paths, {
            fill: "rgba(255, 255, 255, 0.95)",
            duration: 1.2,
            stagger: 0.08,
            ease: "power1.inOut"
        })
        // Efeito de brilho
        .to(paths, {
            filter: "url(#glow)",
            duration: 1.5,
            ease: "sine.inOut"
        }, "-=0.5")
        // Intensificar o brilho de fundo
        .to(backgroundGlow, {
            opacity: 0.8,
            background: "radial-gradient(circle, rgba(100, 100, 100, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
            duration: 1.2
        }, "-=1")
        // Preparação para inversão de cores
        .to(logo, {
            scale: 1.02,
            duration: 0.8,
            ease: "sine.inOut"
        })
        .to(logo, {
            scale: 1,
            duration: 0.8,
            ease: "sine.inOut"
        })
        // Transição para fundo branco
        .to('#splashScreen', {
            backgroundColor: "#ffffff",
            duration: 2,
            ease: "power2.inOut"
        })
        // Transição do logo para preto
        .to(paths, {
            stroke: "#000000",
            fill: "#000000",
            duration: 1.8,
            ease: "power2.inOut"
        }, "-=1.5");
}

/**
 * Configuração de login
 */
function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordError = document.getElementById('passwordError');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('password').value;
            
            // Senha simples para demonstração
            if (password === 'vintra123') {
                // Animar saída do form de login
                gsap.to(".login-container", {
                    y: -20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                    onComplete: () => {
                        document.getElementById('loginScreen').classList.remove('visible');
                        setTimeout(() => {
                            // Exibir o app principal
                            document.getElementById('appContainer').style.display = 'flex';
                            
                            // Animar entrada dos elementos
                            animateAppEntrance();
                        }, 600);
                    }
                });
            } else {
                // Efeito de shake para erro
                gsap.to(".login-container", {
                    x: [-10, 10, -10, 10, 0],
                    duration: 0.4,
                    ease: "power2.inOut"
                });
                
                passwordError.style.display = 'block';
                setTimeout(() => {
                    passwordError.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    // Eventos de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Animação de entrada da aplicação
 */
function animateAppEntrance() {
    // Animar header
    gsap.from(".app-header", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Animar sidebar
    gsap.from(".app-sidebar", {
        x: -20,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });
    
    // Animar conteúdo principal
    gsap.from(".dashboard", {
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out"
    });
    
    // Animar mensagem de boas-vindas
    gsap.from(".welcome-message", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "power2.out"
    });
    
    // Animar documentos recentes
    gsap.from(".recent-item", {
        x: 30,
        opacity: 0,
        duration: 0.6,
        delay: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });
}

/**
 * Função de logout
 */
function handleLogout(e) {
    e.preventDefault();
    
    // Animar saída do app
    gsap.to(".app-main", {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('loginScreen').classList.add('visible');
            
            // Reset do form de login
            setTimeout(() => {
                gsap.fromTo(".login-container", 
                    {y: 30, opacity: 0},
                    {y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out"}
                );
                document.getElementById('password').value = '';
            }, 10);
        }
    });
}

/**
 * Configuração da navegação por tabs
 */
function setupNavigation() {
    // Eventos de clique para navegação principal
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            switchView(this.dataset.target);
        });
    });
    
    // Eventos para links da sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-target]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            switchView(this.dataset.target);
        });
    });
    
    // Tabs na tela de novo documento
    const newTabButtons = document.querySelectorAll('[data-new-tab]');
    newTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            newTabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Mostrar tab correspondente
            const tabId = this.dataset.newTab + '-tab';
            const tabs = document.querySelectorAll('#record-tab, #upload-tab, #transcribe-tab');
            
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    tab.style.display = 'block';
                } else {
                    tab.style.display = 'none';
                }
            });
        });
    });
    
    // Filtros de documentos na biblioteca
    const filters = document.querySelectorAll('.library-filter[data-filter]');
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remover classe ativa de todos os filtros
            filters.forEach(f => f.classList.remove('active'));
            
            // Adicionar classe ativa ao filtro clicado
            this.classList.add('active');
            
            // Filtrar documentos
            const filterType = this.dataset.filter;
            const documents = document.querySelectorAll('.document-item');
            
            documents.forEach(doc => {
                if (filterType === 'all' || doc.dataset.type === filterType) {
                    doc.style.display = 'flex';
                } else {
                    doc.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Alternar entre as views
 */
window.switchView = function(viewId) {
    if (state.activeTab === viewId) return;
    
    // Verificar se está em processamento
    if (state.isProcessing) {
        showToast('warning', 'Processo em andamento', 'Por favor, aguarde a conclusão do processo atual.');
        return;
    }
    
    // Obter elementos de view
    const currentViewElem = document.getElementById(`${state.activeTab}-view`);
    const newViewElem = document.getElementById(`${viewId}-view`);
    
    if (!currentViewElem || !newViewElem) {
        console.error(`Elemento de view não encontrado: ${state.activeTab}-view ou ${viewId}-view`);
        return;
    }
    
    // Animar transição
    gsap.to(currentViewElem, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
            currentViewElem.style.display = 'none';
            
            // Mostrar nova view
            newViewElem.style.display = viewId === 'dashboard' ? 'block' : 'flex';
            
            // Animar entrada
            gsap.fromTo(newViewElem, 
                {opacity: 0, y: -20},
                {opacity: 1, y: 0, duration: 0.5, ease: "power2.out"}
            );
            
            // Animações específicas por view
            if (viewId === 'library') {
                gsap.fromTo(".document-item", 
                    {x: -20, opacity: 0},
                    {x: 0, opacity: 1, stagger: 0.03, delay: 0.2, duration: 0.5, ease: "power2.out"}
                );
            } else if (viewId === 'new') {
                gsap.fromTo(".recording-module, .upload-module", 
                    {y: 20, opacity: 0},
                    {y: 0, opacity: 1, delay: 0.2, duration: 0.6, ease: "power2.out"}
                );
            }
        }
    });
    
    // Atualizar estado
    state.activeTab = viewId;
    
    // Atualizar navegação
    updateNavigation(viewId);
};

/**
 * Atualizar estado de navegação
 */
function updateNavigation(viewId) {
    // Atualizar links
    document.querySelectorAll(`.nav-item, .sidebar-link, .mobile-menu-item`).forEach(item => {
        if (item.dataset.target === viewId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Configuração da sidebar
 */
function setupSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.app-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
            
            // Animar itens da sidebar expandida
            if (sidebar.classList.contains('expanded')) {
                gsap.fromTo('.sidebar-link span',
                    {opacity: 0, x: -10},
                    {opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: "power2.out"}
                );
            }
        });
    }
}

/**
 * Configuração do menu mobile
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.add('open');
            if (mobileMenuBackdrop) mobileMenuBackdrop.classList.add('open');
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            if (mobileMenuBackdrop) mobileMenuBackdrop.classList.remove('open');
        });
    }
    
    if (mobileMenuBackdrop) {
        mobileMenuBackdrop.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            this.classList.remove('open');
        });
    }
    
    // Eventos de clique para itens do menu mobile
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item[data-target]');
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            if (mobileMenuBackdrop) mobileMenuBackdrop.classList.remove('open');
            
            if (this.dataset.target) {
                switchView(this.dataset.target);
            }
        });
    });
}

/**
 * Configuração do gravador de áudio
 */
function setupRecorder() {
    let mediaRecorder = null;
    let audioChunks = [];
    let recordingTimer = null;
    let recordingSeconds = 0;
    
    // Botões de controle
    const startRecordingBtn = document.getElementById('startRecordingBtn');
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    const pauseRecordingBtn = document.getElementById('pauseRecordingBtn');
    const processRecordingBtn = document.getElementById('processRecordingBtn');
    const recordingStatus = document.getElementById('recordingStatus');
    const recordingTime = document.getElementById('recordingTime');
    
    if (startRecordingBtn) {
        startRecordingBtn.addEventListener('click', async function() {
            if (state.isProcessing) return;
            
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];
                
                mediaRecorder.addEventListener('dataavailable', e => {
                    if (e.data.size > 0) {
                        audioChunks.push(e.data);
                    }
                });
                
                mediaRecorder.addEventListener('stop', () => {
                    // Liberar microfone
                    stream.getTracks().forEach(track => track.stop());
                    
                    if (audioChunks.length === 0) {
                        showToast('error', 'Erro', 'Nenhum áudio foi gravado.');
                        recordingStatus.textContent = "Gravação falhou";
                        return;
                    }
                    
                    // Criar blob de áudio
                    state.recordedBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    state.uploadedFile = null; // Limpar upload anterior
                    
                    // Exibir preview de gravação
                    const recordingPreview = document.getElementById('recordingPreview');
                    if (recordingPreview) recordingPreview.classList.add('visible');
                    
                    // Atualizar informações
                    const recordingFileName = document.getElementById('recordingFileName');
                    const recordingFileMeta = document.getElementById('recordingFileMeta');
                    
                    const now = new Date();
                    const dateStr = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear()}`;
                    const timeFormatted = formatTime(recordingSeconds);
                    
                    if (recordingFileName) {
                        recordingFileName.textContent = `Gravacao_${dateStr}.webm`;
                    }
                    
                    if (recordingFileMeta) {
                        // Aproximar tamanho do arquivo
                        const fileSizeMB = (state.recordedBlob.size / (1024 * 1024)).toFixed(1);
                        recordingFileMeta.textContent = `${fileSizeMB} MB • ${timeFormatted}`;
                    }
                    
                    // Atualizar estado da UI
                    recordingStatus.textContent = "Gravação concluída";
                    showToast('success', 'Sucesso', 'Gravação concluída com sucesso');
                });
                
                // Iniciar gravação
                mediaRecorder.start();
                
                // Atualizar interface
                startRecordingBtn.classList.add('hidden');
                stopRecordingBtn.classList.remove('hidden');
                pauseRecordingBtn.classList.remove('hidden');
                recordingStatus.textContent = "Gravando...";
                
                // Criar visualizador
                createVisualizer();
                
                // Iniciar timer
                recordingSeconds = 0;
                updateRecordingTimer();
                recordingTimer = setInterval(updateRecordingTimer, 1000);
                
            } catch (err) {
                console.error("Erro ao acessar microfone:", err);
                showToast('error', 'Erro', 'Não foi possível acessar o microfone. Verifique as permissões do navegador.');
                recordingStatus.textContent = "Erro no microfone";
            }
        });
    }
    
    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', function() {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                clearInterval(recordingTimer);
                
                // Reset de UI
                stopRecordingBtn.classList.add('hidden');
                pauseRecordingBtn.classList.add('hidden');
                startRecordingBtn.classList.remove('hidden');
            }
        });
    }
    
    if (pauseRecordingBtn) {
        pauseRecordingBtn.addEventListener('click', function() {
            if (!mediaRecorder) return;
            
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.pause();
                recordingStatus.textContent = "Pausado";
                clearInterval(recordingTimer);
                
                // Pausar visualizador
                document.querySelectorAll('.visualizer-bar').forEach(bar => {
                    bar.style.height = '5px';
                });
                
            } else if (mediaRecorder.state === 'paused') {
                mediaRecorder.resume();
                recordingStatus.textContent = "Gravando...";
                recordingTimer = setInterval(updateRecordingTimer, 1000);
                
                // Retomar visualizador
                animateVisualizer();
            }
        });
    }
    
    // Botão para iniciar transcrição
    if (processRecordingBtn) {
        processRecordingBtn.addEventListener('click', function() {
            const audioSource = state.recordedBlob || state.uploadedFile;
            
            if (!audioSource) {
                showToast('error', 'Erro', 'Nenhum áudio disponível para transcrever.');
                return;
            }
            
            simulateTranscriptionProcess();
        });
    }
    
    // Remover gravação
    const recordingRemoveBtn = document.getElementById('recordingRemoveBtn');
    if (recordingRemoveBtn) {
        recordingRemoveBtn.addEventListener('click', function() {
            const recordingPreview = document.getElementById('recordingPreview');
            if (recordingPreview) {
                recordingPreview.classList.remove('visible');
            }
            
            state.recordedBlob = null;
        });
    }
    
    // Funções auxiliares
    function updateRecordingTimer() {
        recordingSeconds++;
        if (recordingTime) {
            recordingTime.textContent = formatTime(recordingSeconds);
        }
    }
    
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    function createVisualizer() {
        const visualizerBars = document.getElementById('visualizerBars');
        if (!visualizerBars) return;
        
        // Limpar barras anteriores
        visualizerBars.innerHTML = '';
        
        // Criar barras
        for (let i = 0; i < 100; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            visualizerBars.appendChild(bar);
        }
        
        // Animar visualizador
        animateVisualizer();
    }
}

/**
 * Animar visualizador de áudio
 */
function animateVisualizer() {
    const visualizerBars = document.getElementById('visualizerBars');
    if (!visualizerBars) return;
    
    const bars = visualizerBars.querySelectorAll('.visualizer-bar');
    if (!bars.length) return;
    
    // Animação simples para demonstração
    const animate = () => {
        // Verificar se ainda há gravação ativa
        const recordingStatus = document.getElementById('recordingStatus');
        if (!recordingStatus || recordingStatus.textContent !== "Gravando...") {
            return;
        }
        
        bars.forEach(bar => {
            const height = Math.random() * 90 + 10;
            bar.style.height = `${height}px`;
        });
        
        // Continuar animação
        requestAnimationFrame(animate);
    };
    
    animate();
}

/**
 * Configuração de upload de arquivo
 */
function setupUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const uploadInput = document.getElementById('uploadInput');
    const uploadPreview = document.getElementById('uploadPreview');
    const uploadRemoveBtn = document.getElementById('uploadRemoveBtn');
    const processUploadBtn = document.getElementById('processUploadBtn');
    
    if (uploadArea && uploadInput) {
        // Clique para selecionar arquivo
        uploadArea.addEventListener('click', function() {
            uploadInput.click();
        });
        
        // Drag & drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            uploadArea.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        ['dragenter', 'dragover'].forEach(event => {
            uploadArea.addEventListener(event, () => {
                uploadArea.classList.add('dragover');
            });
        });
        
        ['dragleave', 'drop'].forEach(event => {
            uploadArea.addEventListener(event, () => {
                uploadArea.classList.remove('dragover');
            });
        });
        
        // Processar arquivo arrastado
        uploadArea.addEventListener('drop', e => {
            if (e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        
        // Processar arquivo selecionado
        uploadInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFileUpload(this.files[0]);
            }
        });
    }
    
    // Remover arquivo
    if (uploadRemoveBtn) {
        uploadRemoveBtn.addEventListener('click', function() {
            if (uploadPreview) {
                uploadPreview.classList.remove('visible');
            }
            if (uploadInput) {
                uploadInput.value = '';
            }
            state.uploadedFile = null;
        });
    }
    
    // Processar upload
    if (processUploadBtn) {
        processUploadBtn.addEventListener('click', function() {
            if (!state.uploadedFile) {
                showToast('error', 'Erro', 'Nenhum arquivo selecionado.');
                return;
            }
            
            // Verificar tipo de arquivo
            if (state.uploadedFile.type.startsWith('audio/')) {
                simulateAudioUploadProcess();
            } else {
                simulateTextUploadProcess();
            }
        });
    }
    
    // Função para processar upload de arquivo
    function handleFileUpload(file) {
        if (!file) return;
        
        // Validações
        if (file.size > 50 * 1024 * 1024) { // Limite de 50MB
            showToast('error', 'Erro', 'O arquivo excede o tamanho máximo de 50MB.');
            return;
        }
        
        // Aceitar apenas arquivos de áudio e texto
        const validTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/webm', 
                           'text/plain', 'text/markdown', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        if (!file.type.startsWith('audio/') && 
            !file.type.startsWith('text/') && 
            !file.name.endsWith('.doc') && 
            !file.name.endsWith('.docx')) {
            
            showToast('error', 'Erro', 'Formato de arquivo não suportado.');
            return;
        }
        
        // Atualizar estado
        state.uploadedFile = file;
        state.recordedBlob = null; // Limpar gravação anterior
        
        // Atualizar preview
        const fileName = document.getElementById('uploadFileName');
        const fileMeta = document.getElementById('uploadFileMeta');
        const fileIcon = document.querySelector('#uploadPreview .upload-preview-icon i');
        
        if (fileName) fileName.textContent = file.name;
        
        if (fileMeta) {
            // Formatar tamanho
            let sizeStr = '';
            if (file.size < 1024) {
                sizeStr = file.size + ' bytes';
            } else if (file.size < 1024 * 1024) {
                sizeStr = (file.size / 1024).toFixed(1) + ' KB';
            } else {
                sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
            }
            
            fileMeta.textContent = sizeStr;
        }
        
        if (fileIcon) {
            // Ícone baseado no tipo
            if (file.type.startsWith('audio/')) {
                fileIcon.className = 'fas fa-file-audio';
            } else if (file.type.startsWith('text/')) {
                fileIcon.className = 'fas fa-file-alt';
            } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                fileIcon.className = 'fas fa-file-word';
            } else {
                fileIcon.className = 'fas fa-file';
            }
        }
        
        // Mostrar preview
        if (uploadPreview) {
            uploadPreview.classList.add('visible');
        }
        
        showToast('success', 'Arquivo carregado', 'Arquivo pronto para processamento.');
    }
}

/**
 * Configuração da transcrição manual
 */
function setupTranscription() {
    const processTranscriptionBtn = document.getElementById('processTranscriptionBtn');
    
    if (processTranscriptionBtn) {
        processTranscriptionBtn.addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText');
            
            if (!transcriptionText || !transcriptionText.value.trim()) {
                showToast('warning', 'Texto vazio', 'Por favor, digite ou cole um texto para processar.');
                return;
            }
            
            // Salvar texto
            state.transcriptionText = transcriptionText.value;
            
            // Simular processamento
            simulateManualTranscriptionProcess();
        });
    }
}

/**
 * Configuração do processamento para diferentes formatos
 */
function setupProcessing() {
    const startProcessingBtn = document.getElementById('startProcessingBtn');
    const viewResultsBtn = document.getElementById('viewResultsBtn');
    
    // Opções de formato
    const formatOptions = document.querySelectorAll('.document-format-option');
    if (formatOptions.length) {
        formatOptions.forEach(option => {
            option.addEventListener('click', function() {
                this.classList.toggle('active');
            });
        });
    }
    
    // Botão de iniciar processamento
    if (startProcessingBtn) {
        startProcessingBtn.addEventListener('click', function() {
            // Verificar se há algum formato selecionado
            const selectedFormats = document.querySelectorAll('.document-format-option.active');
            if (!selectedFormats.length) {
                showToast('warning', 'Nenhum formato selecionado', 'Selecione pelo menos um formato para processar.');
                return;
            }
            
            // Verificar se há transcrição
            if (!state.transcriptionText) {
                showToast('error', 'Erro', 'Nenhuma transcrição disponível para processar.');
                return;
            }
            
            // Iniciar processamento
            simulateFormatGenerationProcess(selectedFormats);
        });
    }
    
    // Botão para ver resultados
    if (viewResultsBtn) {
        viewResultsBtn.addEventListener('click', function() {
            switchView('results');
        });
    }
}

/**
 * Configuração das tabs de resultados
 */
function setupResultsTabs() {
    const tabs = document.querySelectorAll('.document-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover classe ativa de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Ativar tab atual
            this.classList.add('active');
            
            // Ativar painel correspondente
            const panelId = this.dataset.panel;
            const panels = document.querySelectorAll('.document-tab-panel');
            
            panels.forEach(panel => {
                if (panel.id === panelId) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
    
    // Botão de download
    const downloadResultsBtn = document.getElementById('downloadResultsBtn');
    if (downloadResultsBtn) {
        downloadResultsBtn.addEventListener('click', function() {
            // Identificar qual tab está ativa
            const activeTab = document.querySelector('.document-tab.active');
            if (!activeTab) return;
            
            const panelId = activeTab.dataset.panel;
            let content = '';
            let filename = '';
            
            // Obter conteúdo baseado na tab ativa
            switch(panelId) {
                case 'transcription-panel':
                    content = state.transcriptionText;
                    filename = 'transcricao.txt';
                    break;
                case 'vintra-panel':
                    content = state.vintraText;
                    filename = 'vintra_formato.txt';
                    break;
                case 'soap-panel':
                    content = state.soapText;
                    filename = 'soap_formato.txt';
                    break;
                case 'ipissima-panel':
                    content = state.ipissimaText;
                    filename = 'ipissima_narrativa.txt';
                    break;
                case 'narrative-panel':
                    content = state.narrativeText;
                    filename = 'analise_narrativa.txt';
                    break;
                case 'orientacoes-panel':
                    content = state.orientacoesText;
                    filename = 'orientacoes.txt';
                    break;
            }
            
            if (!content) {
                showToast('warning', 'Conteúdo vazio', 'Não há conteúdo para download.');
                return;
            }
            
            // Criar blob e link de download
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // Limpar após download
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        });
    }
}

/**
 * Configuração de modais
 */
function setupModal() {
    const modal = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancelBtn');
    const modalSave = document.getElementById('modalSave');
    
    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    // Clicar fora para fechar
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
  
  // No final da função setupModal():
// Garantir que o modal tenha uma textarea
const modalBody = document.getElementById('modalBody');
if (modalBody && !document.getElementById('modalContent')) {
    const textarea = document.createElement('textarea');
    textarea.id = 'modalContent';
    textarea.className = 'document-edit';
    textarea.style.width = '100%';
    textarea.style.minHeight = '300px';
    modalBody.appendChild(textarea);
}

// Configurar botão de confirmar
document.getElementById('modalConfirmBtn').addEventListener('click', function() {
    const content = document.getElementById('modalContent').value;
    const docType = state.currentModalDocType;
    
    if (!docType) return;
    
    // Salvar conteúdo baseado no tipo
    switch(docType) {
        case 'transcription':
            state.transcriptionText = content;
            document.getElementById('transcriptionContent').textContent = content;
            break;
        case 'vintra':
            state.vintraText = content;
            document.getElementById('vintraContent').textContent = content;
            break;
        // Demais casos...
    }
    
    showToast('success', 'Alterações salvas', 'O documento foi atualizado com sucesso.');
    closeModal();
});
    
    // Tecla Esc para fechar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Salvar alterações
    if (modalSave) {
        modalSave.addEventListener('click', function() {
            const content = document.getElementById('modalContent').value;
            const docType = state.currentModalDocType;
            
            if (!docType) return;
            
            // Salvar conteúdo baseado no tipo
            switch(docType) {
                case 'transcription':
                    state.transcriptionText = content;
                    document.getElementById('transcriptionContent').textContent = content;
                    break;
                case 'vintra':
                    state.vintraText = content;
                    document.getElementById('vintraContent').textContent = content;
                    break;
                case 'soap':
                    state.soapText = content;
                    document.getElementById('soapContent').textContent = content;
                    break;
                case 'ipissima':
                    state.ipissimaText = content;
                    document.getElementById('ipissimaContent').textContent = content;
                    break;
                case 'narrative':
                    state.narrativeText = content;
                    document.getElementById('narrativeContent').textContent = content;
                    break;
                case 'orientacoes':
                    state.orientacoesText = content;
                    document.getElementById('orientacoesContent').textContent = content;
                    break;
            }
            
            showToast('success', 'Alterações salvas', 'O documento foi atualizado com sucesso.');
            closeModal();
        });
    }
}

// Substitua toda a função setupFocusMode() por esta versão:
function setupFocusMode() {
    // Desabilitar visualmente todos os botões de modo foco
    const focusModeToggles = document.querySelectorAll('.focus-mode-btn');
    
    focusModeToggles.forEach(toggle => {
        // Adicionar classe para estilo visual de desabilitado
        toggle.classList.add('disabled');
        // Adicionar atributo disabled
        toggle.setAttribute('disabled', 'disabled');
        // Adicionar estilo inline para garantir
        toggle.style.opacity = '0.5';
        toggle.style.pointerEvents = 'none';
        // Adicionar tooltip explicativo
        toggle.setAttribute('title', 'Modo foco desativado temporariamente');
    });
    
    // Remover eventos (caso já tenham sido adicionados)
    focusModeToggles.forEach(toggle => {
        toggle.removeEventListener('click', toggleFocusMode);
    });
}

// A função toggleFocusMode pode ser mantida, mas não fará nada
// pois os botões não terão eventos de clique
/**
 * Abrir modal com conteúdo
 */
function openModal(docType, title, content) {
    const modal = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    state.currentModalDocType = docType;
    
    modalTitle.textContent = title;
    modalContent.value = content;
    
    modal.classList.add('show');
    modalContent.focus();
}

/**
 * Fechar modal
 */
function closeModal() {
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.classList.remove('show');
    }
    state.currentModalDocType = null;
}

/**
 * Exibir mensagem toast
 */
function showToast(type, title, message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Definir ícone baseado no tipo
    let iconClass = 'fas fa-info-circle';
    if (type === 'success') iconClass = 'fas fa-check-circle';
    else if (type === 'error') iconClass = 'fas fa-exclamation-triangle';
    else if (type === 'warning') iconClass = 'fas fa-exclamation-circle';
    
    toast.innerHTML = `
        <div class="toast-icon ${type}">
            <i class="${iconClass}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" title="Fechar">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar ao container
    toastContainer.appendChild(toast);
    
    // Adicionar evento para fechar
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            toast.classList.add('exit');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        });
    }
    
    // Auto-remover após alguns segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('exit');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }
    }, 5000);
}

/**
 * Inicializar efeitos de animação
 */
function initFluidAnimations() {
    // Efeito de ripple para botões
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            ripple.classList.add('ripple-animation');
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
}

/**
 * Simulações de processamento
 */

// Simular processamento de transcrição
function simulateTranscriptionProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    // Atualizar UI
    const transcriptionSteps = document.getElementById('transcriptionSteps');
    const transcriptionStepsProgress = document.getElementById('transcriptionStepsProgress');
    if (transcriptionSteps) transcriptionSteps.style.display = 'block';
    
    // Simular progresso em etapas
    simulateStepProgress(
        document.querySelectorAll('#transcriptionSteps .transcription-step'),
        transcriptionStepsProgress,
        function() {
            // Completar processo
            state.isProcessing = false;
            
            // Gerar transcrição de exemplo
            state.transcriptionText = generateSampleTranscription(state.isDiarizationEnabled);
            
            // Mostrar painel de conclusão
            const completedPanel = document.getElementById('transcriptionCompletedPanel');
            if (completedPanel) completedPanel.classList.add('active');
            
            // Atualizar resultados
            document.getElementById('transcriptionContent').textContent = state.transcriptionText;
            
            showToast('success', 'Transcrição concluída', 'O áudio foi transcrito com sucesso.');
        },
        function(step) {
     // Mostrar preview de transcrição
            if (step === 2) {
                const liveTranscriptionPreview = document.getElementById('liveTranscriptionPreview');
                if (liveTranscriptionPreview) {
                    liveTranscriptionPreview.classList.add('active');
                }
            }
        }
    );
}

/**
 * Simular processo de upload de áudio
 */
function simulateAudioUploadProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    // Atualizar UI
    const transcriptionSteps = document.getElementById('uploadTranscriptionSteps');
    const transcriptionStepsProgress = document.getElementById('uploadTranscriptionStepsProgress');
    if (transcriptionSteps) transcriptionSteps.style.display = 'block';
    
    // Esconder preview de upload durante processamento
    const progressContainer = document.getElementById('uploadProgress');
    if (progressContainer) progressContainer.style.display = 'block';
    
    // Simular progresso em etapas
    simulateStepProgress(
        document.querySelectorAll('#uploadTranscriptionSteps .transcription-step'),
        transcriptionStepsProgress,
        function() {
            // Completar processo
            state.isProcessing = false;
            
            // Esconder progresso e mostrar conclusão
            if (progressContainer) progressContainer.style.display = 'none';
            
            // Gerar transcrição de exemplo
            state.transcriptionText = generateSampleTranscription(state.isDiarizationEnabled);
            
            // Mostrar painel de conclusão
            const completedPanel = document.getElementById('uploadCompletedPanel');
            if (completedPanel) completedPanel.classList.add('active');
            
            // Atualizar resultados
            document.getElementById('transcriptionContent').textContent = state.transcriptionText;
            
            showToast('success', 'Processamento concluído', 'O arquivo foi processado com sucesso.');
        }
    );
}

/**
 * Simular processo de upload de texto
 */
function simulateTextUploadProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    // Atualizar UI
    const uploadProgress = document.getElementById('uploadProgress');
    if (uploadProgress) uploadProgress.style.display = 'block';
    
    // Atualizar barra de progresso
    const uploadProgressBar = document.getElementById('uploadProgressBar');
    const uploadProgressPercentage = document.getElementById('uploadProgressPercentage');
    const uploadProgressStatus = document.getElementById('uploadProgressStatus');
    
    // Simulação de progresso
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (progress > 100) progress = 100;
        
        if (uploadProgressBar) uploadProgressBar.style.width = progress + '%';
        if (uploadProgressPercentage) uploadProgressPercentage.textContent = progress + '%';
        
        // Atualizar status
        if (uploadProgressStatus) {
            if (progress < 30) {
                uploadProgressStatus.textContent = 'Analisando documento...';
            } else if (progress < 60) {
                uploadProgressStatus.textContent = 'Processando conteúdo...';
            } else if (progress < 90) {
                uploadProgressStatus.textContent = 'Formatando resultado...';
            } else {
                uploadProgressStatus.textContent = 'Finalizando...';
            }
        }
        
        if (progress === 100) {
            clearInterval(progressInterval);
            // Completar após breve delay
            setTimeout(() => {
                state.isProcessing = false;
                
                // Esconder progresso
                if (uploadProgress) uploadProgress.style.display = 'none';
                
                // Atualizar estado
                state.transcriptionText = state.uploadedFile.type.startsWith('text/') 
                    ? '# Transcrição importada\n\nDocumento importado em ' + new Date().toLocaleString()
                    : generateSampleTranscription(false);
                
                // Mostrar painel de conclusão
                const completedPanel = document.getElementById('uploadCompletedPanel');
                if (completedPanel) completedPanel.classList.add('active');
                
                // Atualizar resultados
                document.getElementById('transcriptionContent').textContent = state.transcriptionText;
                
                showToast('success', 'Importação concluída', 'O documento foi importado com sucesso.');
            }, 500);
        }
    }, 200);
}

/**
 * Simular processo de transcrição manual
 */
function simulateManualTranscriptionProcess() {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    // Obter texto da área de transcrição
    const transcriptionText = document.getElementById('transcriptionText');
    if (!transcriptionText || !transcriptionText.value.trim()) {
        showToast('error', 'Erro', 'Texto vazio. Adicione conteúdo para processar.');
        state.isProcessing = false;
        return;
    }
    
    // Atualizar o estado
    state.transcriptionText = transcriptionText.value;
    
    // Atualizar UI
    const manualTranscriptionSteps = document.getElementById('manualTranscriptionSteps');
    const manualTranscriptionStepsProgress = document.getElementById('manualTranscriptionStepsProgress');
    if (manualTranscriptionSteps) manualTranscriptionSteps.style.display = 'block';
    
    // Simular progresso em etapas
    simulateStepProgress(
        document.querySelectorAll('#manualTranscriptionSteps .transcription-step'),
        manualTranscriptionStepsProgress,
        function() {
            // Completar processo
            state.isProcessing = false;
            
            // Mostrar painel de conclusão
            const completedPanel = document.getElementById('manualTranscriptionCompletedPanel');
            if (completedPanel) completedPanel.classList.add('active');
            
            // Atualizar resultados
            document.getElementById('transcriptionContent').textContent = state.transcriptionText;
            
            showToast('success', 'Salvo com sucesso', 'A transcrição foi salva com sucesso.');
        }
    );
}

/**
 * Processa uma transcrição salva para gerar outros formatos
 */
function processTranscription() {
    switchView('processing');
    
    // Atualizar título do documento sendo processado
    const processingDocumentTitle = document.getElementById('processingDocumentTitle');
    if (processingDocumentTitle) {
        processingDocumentTitle.textContent = 'Transcrição_' + new Date().toLocaleDateString().replace(/\//g, '_');
    }
}

/**
 * Simular geração de formatos como VINTRA, SOAP, etc.
 */
function simulateFormatGenerationProcess(selectedFormats) {
    if (state.isProcessing) return;
    state.isProcessing = true;
    
    // Atualizar UI
    const processingProgress = document.getElementById('processingProgress');
    if (processingProgress) processingProgress.style.display = 'block';
    
    // Atualizar barra de progresso
    const processingProgressBar = document.getElementById('processingProgressBar');
    const processingProgressPercentage = document.getElementById('processingProgressPercentage');
    const processingProgressStatus = document.getElementById('processingProgressStatus');
    
    // Formatos selecionados
    const formats = Array.from(selectedFormats).map(format => format.dataset.format);
    
    // Simulação de progresso
    let progress = 0;
    const totalFormats = formats.length;
    let currentFormat = 0;
    
    // Simular processamento de cada formato
    const processFormat = () => {
        if (currentFormat >= totalFormats) {
            // Finalizar processo
            if (processingProgressBar) processingProgressBar.style.width = '100%';
            if (processingProgressPercentage) processingProgressPercentage.textContent = '100%';
            if (processingProgressStatus) processingProgressStatus.textContent = 'Finalizado';
            
            setTimeout(() => {
                state.isProcessing = false;
                
                // Esconder progresso
                if (processingProgress) processingProgress.style.display = 'none';
                
                // Mostrar painel de conclusão
                const completedPanel = document.getElementById('processingCompletedPanel');
                if (completedPanel) completedPanel.classList.add('active');
                
                // Gerar conteúdo para cada formato
                formats.forEach(format => {
                    switch(format) {
                        case 'vintra':
                            state.vintraText = generateSampleContent('vintra');
                            document.getElementById('vintraContent').textContent = state.vintraText;
                            break;
                        case 'soap':
                            state.soapText = generateSampleContent('soap');
                            document.getElementById('soapContent').textContent = state.soapText;
                            break;
                        case 'ipissima':
                            state.ipissimaText = generateSampleContent('ipissima');
                            document.getElementById('ipissimaContent').textContent = state.ipissimaText;
                            break;
                        case 'narrative':
                            state.narrativeText = generateSampleContent('narrative');
                            document.getElementById('narrativeContent').textContent = state.narrativeText;
                            break;
                        case 'orientacoes':
                            state.orientacoesText = generateSampleContent('orientacoes');
                            document.getElementById('orientacoesContent').textContent = state.orientacoesText;
                            break;
                    }
                });
                
                showToast('success', 'Processamento concluído', `${formats.length} documentos foram gerados com sucesso.`);
            }, 500);
            
            return;
        }
        
        // Obter formato atual
        const format = formats[currentFormat];
        if (processingProgressStatus) processingProgressStatus.textContent = `Processando formato ${getTypeLabel(format)}...`;
        
        // Simular progresso para o formato atual
        const startProgress = (currentFormat / totalFormats) * 100;
        const endProgress = ((currentFormat + 1) / totalFormats) * 100;
        let formatProgress = 0;
        
        const formatInterval = setInterval(() => {
            formatProgress += 5;
            
            if (formatProgress > 100) {
                clearInterval(formatInterval);
                currentFormat++;
                processFormat();
                return;
            }
            
            // Calcular progresso total
            progress = startProgress + (formatProgress / 100) * (endProgress - startProgress);
            
            if (processingProgressBar) processingProgressBar.style.width = progress + '%';
            if (processingProgressPercentage) processingProgressPercentage.textContent = Math.round(progress) + '%';
        }, 100);
    };
    
    // Iniciar processamento
    processFormat();
}

/**
 * Simular progresso em etapas
 */
function simulateStepProgress(steps, progressBar, onComplete, stepCallback) {
    if (!steps || !steps.length) return;
    
    const stepCount = steps.length;
    let currentStep = 0;
    
    // Resetar todas as etapas
    steps.forEach(step => {
        step.classList.remove('active', 'completed', 'completing');
    });
    
    // Função para avançar para a próxima etapa
    const nextStep = () => {
        if (currentStep >= stepCount) {
            // Processo completo
            if (typeof onComplete === 'function') {
                onComplete();
            }
            return;
        }
        
        // Calcular progresso
        const progress = ((currentStep + 0.5) / stepCount) * 100;
        
        // Atualizar barra de progresso
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        // Marcar etapa atual como ativa
        const activeStep = steps[currentStep];
        activeStep.classList.add('active');
        
        // Executar callback para a etapa
        if (typeof stepCallback === 'function') {
            stepCallback(currentStep + 1);
        }
        
        // Simular progresso desta etapa
        setTimeout(() => {
            // Marcar como completada
            activeStep.classList.remove('active');
            activeStep.classList.add('completing');
            
            setTimeout(() => {
                activeStep.classList.remove('completing');
                activeStep.classList.add('completed');
                
                // Avançar para próxima etapa
                currentStep++;
                nextStep();
            }, 500);
        }, 1500 + Math.random() * 1000);
    };
    
    // Iniciar simulação
    nextStep();
}

/**
 * Gerar uma transcrição de exemplo
 */
function generateSampleTranscription(includeDiarization = true) {
    if (includeDiarization) {
        return `Entrevista Clínica - 25 de Março de 2025

Médico: Bom dia, Maria. Como você está se sentindo hoje?

Paciente: Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar.

Médico: Entendo. Pode me falar mais sobre essa dor? Onde você sente mais intensamente?

Paciente: É nas costas, na região lombar principalmente. Mas também tenho dor nas pernas, uma dormência às vezes. E dor de cabeça quase todo dia. Tomo dipirona direto.

Médico: E quando começou isso? Você se lembra de algum evento específico?

Paciente: Foi depois que meu marido faleceu, em janeiro. Ele era meu companheiro, meu amigo. E eu sinto muita falta, eu não me conformo... [paciente fica emocionada]. Depois disso, parece que meu corpo desabou. Antes eu tinha algumas dores, mas nada assim.

Médico: Sinto muito pela sua perda, Maria. É um momento muito difícil mesmo. Como está seu sono?

Paciente: Péssimo. Demoro pra dormir, acordo várias vezes de madrugada. Fico pensando nele, nas coisas que a gente fazia. Na nossa rotina. Aí tomo o clonazepam que o outro médico me receitou, mas mesmo assim...

Médico: E seu apetite?

Paciente: Diminuiu bastante. Não tenho vontade de cozinhar só pra mim. Era ele que gostava dos meus pratos. Às vezes fico o dia inteiro só com café. Emagreci quase 6 quilos nos últimos meses.

Médico: Entendo. E você tem sentido outros sintomas além das dores? Alguma alteração no intestino, na pele?

Paciente: Intestino está normal, acho. A pele está mais seca, mas deve ser porque não tenho me cuidado muito. Sabe como é, doutor... a gente perde a vontade de se cuidar.

Médico: Compreendo, Maria. E como está seu ânimo? Tem conseguido fazer as atividades do dia a dia?

Paciente: É difícil... tem dias que não consigo nem levantar da cama. A casa fica bagunçada, não tenho vontade de limpar. Minha filha vem de vez em quando e me ajuda, mas ela tem a vida dela, o trabalho, os filhos... E eu não quero ficar dando trabalho. Já basta ter que vir aqui me trazer no médico hoje.`;
    } else {
        return `Entrevista Clínica - 25 de Março de 2025

Bom dia, Maria. Como você está se sentindo hoje?

Ah, doutor... não estou bem. A dor continua, sabe? Eu tomo os remédios, mas parece que não adianta muito. Durmo mal, acordo cansada. Às vezes acho que nunca vou melhorar.

Entendo. Pode me falar mais sobre essa dor? Onde você sente mais intensamente?

É nas costas, na região lombar principalmente. Mas também tenho dor nas pernas, uma dormência às vezes. E dor de cabeça quase todo dia. Tomo dipirona direto.

E quando começou isso? Você se lembra de algum evento específico?

Foi depois que meu marido faleceu, em janeiro. Ele era meu companheiro, meu amigo. E eu sinto muita falta, eu não me conformo... [paciente fica emocionada]. Depois disso, parece que meu corpo desabou. Antes eu tinha algumas dores, mas nada assim.

Sinto muito pela sua perda, Maria. É um momento muito difícil mesmo. Como está seu sono?

Péssimo. Demoro pra dormir, acordo várias vezes de madrugada. Fico pensando nele, nas coisas que a gente fazia. Na nossa rotina. Aí tomo o clonazepam que o outro médico me receitou, mas mesmo assim...

E seu apetite?

Diminuiu bastante. Não tenho vontade de cozinhar só pra mim. Era ele que gostava dos meus pratos. Às vezes fico o dia inteiro só com café. Emagreci quase 6 quilos nos últimos meses.`;
    }
}

/**
 * Função para visualizar a transcrição
 */
function viewTranscription() {
    switchView('results');
}

/**
 * Inicializar animações fluidas
 */
function initFluidAnimations() {
    // Efeito de ripple para botões
    document.querySelectorAll('.btn, .library-btn, .toolbar-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            ripple.classList.add('ripple-animation');
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Animação sutil dos cartões na página inicial
    const items = document.querySelectorAll('.recent-item, .stat-card');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = 'float-subtle 5s infinite ease-in-out';
            item.style.animationDelay = (index * 0.2) + 's';
        }, 1000);
    });
}
