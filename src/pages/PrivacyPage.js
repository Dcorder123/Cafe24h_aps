import React, { useState } from 'react';
import { PAGES } from '../utils/constants';

const PrivacyPage = ({ darkMode = false, onNavigate, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleClearData = () => {
    if (window.confirm('Deseja excluir todos os seus dados cadastrais, histórico e pedidos salvos neste navegador?')) {
      localStorage.removeItem('cafe24h_user');
      localStorage.removeItem('cafe24h_customers_by_phone');
      localStorage.removeItem('cafe24h_cart');
      localStorage.removeItem('cafe24h_orders');
      localStorage.removeItem('cafe24h_reservations');
      localStorage.removeItem('cafe24h_cookie_consent');
      alert('Seus dados locais foram apagados com sucesso!');
      if (onNavigate) onNavigate(PAGES.MENU);
    }
  };

  const tabs = [
    { id: 'privacy', label: 'Aviso de Privacidade (LGPD)', icon: '🔒' },
    { id: 'terms', label: 'Termos de Uso', icon: '📄' },
    { id: 'cookies', label: 'Política de Cookies', icon: '🍪' },
    { id: 'about', label: 'Sobre Nós', icon: '☕' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header com Navegação de Abas */}
      <div className={`p-6 sm:p-8 rounded-2xl shadow-md ${
        darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-gradient-to-r from-amber-50 to-amber-100 text-gray-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl sm:text-3xl">🏛️</span>
              <h1 className="text-2xl sm:text-3xl font-bold">Portal Institucional & Legal</h1>
            </div>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Transparência, proteção de dados e diretrizes de uso do sistema Caffe 24h.
            </p>
          </div>
          <button
            onClick={() => onNavigate && onNavigate(PAGES.MENU)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-md transition-all flex items-center gap-1.5"
          >
            <span>☕</span> Voltar ao Cardápio
          </button>
        </div>

        {/* Abas */}
        <div className="flex flex-wrap gap-2 border-t pt-4 border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-white/80 text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo da Aba */}
      <div className={`p-6 sm:p-8 rounded-2xl shadow-md space-y-6 ${
        darkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white text-gray-700'
      }`}>

        {/* 1. ABA: AVISO DE PRIVACIDADE */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <h3 className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2 mb-1">
                <span>💼</span> Demonstração Técnica & LGPD (Lei nº 13.709/2018)
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">
                Este sistema foi concebido para demonstração de arquitetura e portfólio. As informações coletadas são armazenadas localmente no seu próprio navegador e utilizadas estritamente para o fluxo de pedidos e reservas.
              </p>
            </div>

            <section className="space-y-2">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <span>1.</span> Informações Coletadas e Finalidade
              </h2>
              <ul className="list-disc list-inside text-xs sm:text-sm space-y-2 pl-2">
                <li><strong>Nome Completo:</strong> Identificar pedidos na cozinha e vincular reservas de mesa.</li>
                <li><strong>Telefone Celular:</strong> Chave de login rápido para restauração de perfil e contato sobre o pedido.</li>
                <li><strong>Endereço e Número:</strong> Utilizados exclusivamente caso o cliente escolha a modalidade de entrega em domicílio.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <span>2.</span> Segurança Bancária (Padrão PCI-DSS)
              </h2>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-green-700 dark:text-green-300">
                  🛡️ Zero armazenamento de senhas ou CVV
                </p>
                <p>
                  Não armazenamos códigos CVV ou números integrais de cartões de crédito. Qualquer transação nesta plataforma ocorre de forma simulada ou através de APIs seguras homologadas.
                </p>
              </div>
            </section>

            <section className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                <span>3.</span> Direitos do Usuário (Art. 18 da LGPD)
              </h2>
              <p className="text-xs sm:text-sm">
                Você pode apagar imediatamente todos os seus dados deste dispositivo:
              </p>
              <div>
                <button
                  onClick={handleClearData}
                  className="px-4 py-2.5 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-500/30 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span>🗑️</span> Excluir Meus Dados Deste Navegador
                </button>
              </div>
            </section>
          </div>
        )}

        {/* 2. ABA: TERMOS DE USO */}
        {activeTab === 'terms' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <span>📄</span> Termos e Condições de Uso
            </h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>1. Aceitação dos Termos:</strong> Ao acessar e utilizar o aplicativo Caffe 24h, você concorda com as diretrizes operacionais de pedidos, agendamento de reservas e regras de conduta descritas neste documento.
              </p>
              <p>
                <strong>2. Realização de Pedidos:</strong> Todos os pedidos realizados via cardápio digital passam por confirmação. Em caso de cancelamento, o cliente deverá notificar o estabelecimento no prazo de até 10 minutos após o envio do pedido.
              </p>
              <p>
                <strong>3. Política de Reservas:</strong> As mesas reservadas têm tolerância de 15 minutos em relação ao horário agendado. Após esse período, a mesa poderá ser liberada para outros clientes.
              </p>
              <p>
                <strong>4. Propriedade Intelectual:</strong> O design, código-fonte e marcas associadas a este projeto são de autoria intelectual para fins de portfólio profissional e acadêmico.
              </p>
            </div>
          </div>
        )}

        {/* 3. ABA: POLÍTICA DE COOKIES */}
        {activeTab === 'cookies' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <span>🍪</span> Política de Cookies e Armazenamento
            </h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
              <p>
                Utilizamos tecnologias de armazenamento local (<code>localStorage</code>) para finalidades estritamente técnicas e de conveniência do usuário:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2">
                <li><strong>Preferência de Tema:</strong> Salva sua escolha de Modo Escuro ou Claro.</li>
                <li><strong>Carrinho Persistente:</strong> Mantém seus itens selecionados mesmo que a página seja recarregada.</li>
                <li><strong>Identificação por Celular:</strong> Permite que seus dados de contato e endereço sejam carregados com 1 toque no próximo pedido.</li>
                <li><strong>Consentimento de Cookies:</strong> Registra a aceitação do banner informativo de privacidade.</li>
              </ul>
              <p className="pt-2">
                Você pode desabilitar o armazenamento local diretamente nas configurações do seu navegador ou utilizar o botão de exclusão de dados nesta página.
              </p>
            </div>
          </div>
        )}

        {/* 4. ABA: SOBRE NÓS */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
              <span>☕</span> Sobre o Caffe 24h
            </h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
              <p>
                O <strong>Caffe 24h</strong> nasceu com a missão de unir a arte da cafeteria especial à conveniência moderna de atendimento ininterrupto. Selecionamos grãos 100% arábica de pequenos produtores brasileiros e preparamos receitas artesanais de confeitaria e panificação fresca.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-amber-50/50 border-amber-200'}`}>
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-1">Nossa Missão</h4>
                  <p className="text-xs">Oferecer café de qualidade superior, conforto e acolhimento em qualquer hora do dia ou da noite.</p>
                </div>
                <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-1">Tecnologia & Experiência</h4>
                  <p className="text-xs">Sistema interativo com pedidos em tempo real, cálculo de troco, reservas automatizadas e acessibilidade.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PrivacyPage;
