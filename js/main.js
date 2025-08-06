// JavaScript para o Sistema da Cafeteria - Relatório Interativo

document.addEventListener('DOMContentLoaded', function() {
    // SPA Navigation Logic
    const navLinks = document.querySelectorAll('#main-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Accordion Logic for Use Cases
    const useCases = [
        { title: 'Realizar Cadastro e Autenticação', content: 'O cliente fornece suas informações para cadastro ou suas credenciais para autenticação, garantindo acesso seguro ao aplicativo.' },
        { title: 'Visualizar Menu de Produtos', content: 'O cliente navega pelo menu de produtos, visualizando as opções de cafés, chás, salgados, doces e bebidas.' },
        { title: 'Montar e Enviar Pedido', content: 'O cliente seleciona os itens desejados do menu, monta seu pedido e o envia para o café.' },
        { title: 'Escolher Modalidade de Pedido', content: 'O cliente escolhe entre as modalidades de entrega ou retirada no balcão para o seu pedido.' },
        { title: 'Reservar Mesa', content: 'O cliente seleciona uma mesa disponível no ambiente físico do café e realiza a reserva.' },
        { title: 'Realizar Pagamento', content: 'O cliente efetua o pagamento do pedido utilizando PIX ou cartão de crédito/débito.' },
        { title: 'Gerenciar Café (Admin)', content: 'O administrador ou funcionário do café gerencia produtos, reservas, pedidos e visualiza avaliações dos clientes.' }
    ];

    const accordionContainer = document.getElementById('accordion-container');
    useCases.forEach((uc, index) => {
        const item = document.createElement('div');
        item.className = 'bg-white border border-gray-200 rounded-xl shadow-sm';
        item.innerHTML = `
            <button class="accordion-toggle w-full flex justify-between items-center p-5 text-left font-semibold">
                <span>${uc.title}</span>
                <i class="fa-solid fa-chevron-down transition-transform"></i>
            </button>
            <div class="accordion-content px-5 pb-5">
                <p class="text-gray-600">${uc.content}</p>
            </div>
        `;
        accordionContainer.appendChild(item);
    });

    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('i');
            
            toggle.parentElement.classList.toggle('bg-green-50');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('rotate-180');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.add('rotate-180');
            }
        });
    });

    // Tab Logic for System Flows
    const diagrams = [
        { id: 'cadastro', title: 'Cadastro de Cliente', img: 'assets/images/fluxo/cadastro_cliente.png',
          description: 'O sistema gerencia o processo completo de cadastramento com validações robustas. Inclui verificação de duplicidade, validação de dados, criação de credenciais seguras e confirmação por email antes da ativação da conta.' },
        { id: 'pedido', title: 'Fazer Pedido', img: 'assets/images/fluxo/fazer_pedido.png',
          description: 'O cliente navega pelo menu, seleciona produtos e confirma o pedido. O sistema valida disponibilidade no estoque, calcula valores, gera número do pedido e encaminha automaticamente para a cozinha iniciar o preparo.' },
        { id: 'pagamento', title: 'Processar Pagamento', img: 'assets/images/fluxo/processar_pagamento.png',
          description: 'Sistema multimodal que suporta PIX (com QR Code), dinheiro (com cálculo de troco) e cartão (com validação online). Cada modalidade possui processador específico, garantindo segurança e flexibilidade para o cliente.' },
        { id: 'reserva', title: 'Solicitar Reserva', img: 'assets/images/fluxo/solicitar_reserva.png',
          description: 'O cliente solicita reserva informando data, hora e número de pessoas. O sistema verifica disponibilidade em tempo real, consulta o status das mesas e confirma a reserva com número de identificação.' },
        { id: 'entrega', title: 'Entrega do Pedido', img: 'assets/images/fluxo/entrega_pedido.png',
          description: 'Coordena o fluxo final do atendimento desde a conclusão do preparo até a entrega. Inclui notificação ao cliente, verificação de completude, registro de métricas de qualidade e tempo de atendimento.' }
    ];

    const tabsContainer = document.getElementById('diagram-tabs');
    const diagramContainer = document.getElementById('diagram-container');

    diagrams.forEach((diagram, index) => {
        const button = document.createElement('button');
        button.className = 'tab-button text-sm font-medium px-4 py-2 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 transition-colors';
        button.textContent = diagram.title;
        button.setAttribute('data-target', diagram.id);
        if (index === 0) button.classList.add('active');
        tabsContainer.appendChild(button);

        const content = document.createElement('div');
        content.id = diagram.id;
        content.className = 'diagram-content p-4 bg-white rounded-xl shadow-sm border border-gray-200';
        if (index === 0) content.classList.add('active');
        content.innerHTML = `
            <h3 class="text-2xl font-semibold mb-4 text-green-700">${diagram.title}</h3>
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div class="lg:col-span-3 bg-gray-100 p-4 rounded-lg flex justify-center items-center">
                    <img src="${diagram.img}" alt="Diagrama de ${diagram.title}" class="rounded-md max-w-full h-auto">
                </div>
                <div class="lg:col-span-2">
                    <h4 class="font-semibold text-lg mb-2">Descrição do Fluxo</h4>
                    <p class="text-gray-600 leading-relaxed text-justify">${diagram.description}</p>
                </div>
            </div>
        `;
        diagramContainer.appendChild(content);
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    const diagramContents = document.querySelectorAll('.diagram-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            diagramContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetId) {
                    content.classList.add('active');
                }
            });
        });
    });
});
