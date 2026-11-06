import React, { useState } from 'react';
import { PAGES } from '../utils/constants';
import { CustomerService } from '../services/CustomerService';
import { formatPhone, onlyNumbers } from '../utils/formatters';

const AccountPage = ({ darkMode = false, onToggleDarkMode, onNavigate }) => {
  const [user, setUser] = useState(() => CustomerService.getCurrentUser());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  
  // Estado para login rápido com celular
  const [phoneLoginInput, setPhoneLoginInput] = useState('');
  const [loginFeedback, setLoginFeedback] = useState({ type: '', message: '' });

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.name.trim()) {
      alert('Por favor, preencha o Nome Completo *');
      return;
    }
    const digits = (editForm.phone || '').replace(/\D/g, '');
    if (digits.length < 10) {
      alert('Por favor, informe um Telefone Celular válido com DDD *');
      return;
    }

    const saved = CustomerService.saveUser(editForm);
    setUser(saved);
    setIsEditing(false);
    alert('Dados salvos com sucesso!');
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta? Seus dados continuarão salvos e você poderá entrar a qualquer momento digitando seu celular.')) {
      CustomerService.logout();
      const anonymousUser = {
        isAnonymous: true,
        name: '',
        email: '',
        phone: '',
        address: '',
        number: '',
        preferences: { notifications: true }
      };
      setUser(anonymousUser);
      setEditForm(anonymousUser);
      setIsEditing(false);
      setPhoneLoginInput('');
      setLoginFeedback({ type: '', message: '' });
    }
  };

  // Login automático pelo celular
  const handlePhoneLoginChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhoneLoginInput(formatted);

    const digits = formatted.replace(/\D/g, '');
    if (digits.length >= 10) {
      const customer = CustomerService.loginWithPhone(digits);
      if (customer) {
        setUser(customer);
        setEditForm({ ...customer });
        setLoginFeedback({
          type: 'success',
          message: `✨ Bem-vindo(a) de volta, ${customer.name}! Seus dados foram carregados.`
        });
        setTimeout(() => setLoginFeedback({ type: '', message: '' }), 4000);
      } else {
        setLoginFeedback({
          type: 'info',
          message: 'Número não cadastrado anteriormente. Preencha seus dados para criar sua conta.'
        });
      }
    } else {
      setLoginFeedback({ type: '', message: '' });
    }
  };

  const accountStats = [
    { label: 'Pedidos Realizados', value: '3', icon: '📦' },
    { label: 'Total Gasto', value: 'R$ 84,50', icon: '💰' },
    { label: 'Pontos de Fidelidade', value: '85', icon: '⭐' },
    { label: 'Status', value: user.isAnonymous ? 'Anônimo' : 'Ativo', icon: '✅' }
  ];

  const quickActions = [
    { title: 'Meus Pedidos', description: 'Acompanhe seus pedidos', icon: '📋', action: 'history' },
    { title: 'Fazer Reserva', description: 'Reserve sua mesa', icon: '🗓️', action: 'reservation' },
    { title: 'Cardápio', description: 'Ver delícias disponíveis', icon: '☕', action: 'menu' },
    { title: 'Privacidade (LGPD)', description: 'Termos e proteção de dados', icon: '🔒', action: 'privacy' }
  ];

  const handleActionClick = (action) => {
    if (onNavigate) {
      if (['history', 'reservation', 'menu'].includes(action)) {
        onNavigate(action);
      } else if (action === 'privacy') {
        onNavigate(PAGES.PRIVACY);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header com Avatar e Identificação */}
      <div className={`p-8 rounded-2xl shadow-md ${
        darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-gradient-to-r from-amber-50 to-amber-100'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                {user.name ? `Olá, ${user.name}! 👋` : 'Olá, Visitante! 👋'}
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {user.name 
                  ? 'Seus dados e endereço ficam salvos para agilizar pedidos e reservas.'
                  : 'Entre com seu celular ou cadastre-se para salvar seus pedidos.'}
              </p>
            </div>
          </div>

          {/* Botões de Ação do Header */}
          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                onClick={() => {
                  setEditForm({ ...user });
                  setIsEditing(true);
                }}
                className="bg-amber-600 text-white px-5 py-2.5 rounded-xl hover:bg-amber-700 transition-colors duration-200 flex items-center gap-2 font-medium shadow-md text-sm"
              >
                ✏️ Editar Perfil
              </button>
            )}

            {!user.isAnonymous && (
              <button
                onClick={handleLogout}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors border ${
                  darkMode ? 'border-red-500/40 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
                title="Sair da sessão atual"
              >
                🚪 Sair
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card de Login Automático por Celular (para quando estiver deslogado ou quiser trocar de conta) */}
      <div className={`p-6 rounded-2xl shadow-md border ${
        darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-amber-200 text-gray-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📱</span>
            <div>
              <h2 className="font-bold text-base">Acesso Rápido com Celular</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Digite seu número cadastrado para carregar seus dados automaticamente
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={phoneLoginInput}
              onChange={handlePhoneLoginChange}
              className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300'
              }`}
            />
          </div>
        </div>

        {loginFeedback.message && (
          <div className={`p-3 rounded-xl text-xs font-medium ${
            loginFeedback.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-300'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300'
          }`}>
            {loginFeedback.message}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {accountStats.map((stat, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-md transition-shadow duration-200 ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-amber-500 mb-1">{stat.value}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Informações do Perfil */}
        <div className={`rounded-2xl shadow-md p-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white text-gray-800'
        }`}>
          <h2 className="text-xl font-bold mb-6 flex items-center">
            👤 <span className="ml-2">Informações Cadastrais</span>
          </h2>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome Completo <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${
                    darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${
                    darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone Celular / WhatsApp <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={editForm.phone || ''}
                  onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                  placeholder="(XX) XXXXX-XXXX"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${
                    darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Endereço (Rua/Av.)</label>
                  <input
                    type="text"
                    value={editForm.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Ex: Rua das Flores"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${
                      darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Número</label>
                  <input
                    type="text"
                    value={editForm.number || ''}
                    onChange={(e) => handleInputChange('number', onlyNumbers(e.target.value, 8))}
                    placeholder="123"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${
                      darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-xl hover:bg-amber-700 transition-colors font-medium shadow-md text-sm"
                >
                  💾 Salvar Dados
                </button>
                <button
                  onClick={handleCancel}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors text-sm ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="opacity-70 text-sm">Nome:</span>
                <span className="font-medium text-sm">{user.name || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="opacity-70 text-sm">Email:</span>
                <span className="font-medium text-sm">{user.email || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="opacity-70 text-sm">Telefone:</span>
                <span className="font-medium text-sm">{user.phone || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="opacity-70 text-sm">Endereço:</span>
                <span className="font-medium text-sm text-right max-w-xs">
                  {user.address ? `${user.address}${user.number ? ', ' + user.number : ''}` : 'Não informado'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Preferências e Segurança */}
        <div className={`rounded-2xl shadow-md p-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white text-gray-800'
        }`}>
          <h2 className="text-xl font-bold mb-6 flex items-center">
            ⚙️ <span className="ml-2">Preferências & Segurança</span>
          </h2>

          <div className="space-y-4">
            {/* Modo Escuro */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              darkMode ? 'bg-gray-900/60' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <span>{darkMode ? '🌙' : '☀️'}</span> Modo Escuro
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {darkMode ? 'Tema escuro ativo' : 'Tema claro ativo'}
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                  darkMode ? 'bg-amber-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Notificações */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${
              darkMode ? 'bg-gray-900/60' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className="font-medium flex items-center gap-2 text-sm">
                  <span>🔔</span> Notificações
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Receber alertas sobre status de pedidos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences?.notifications || false}
                  onChange={(e) => {
                    const updated = {
                      ...user,
                      preferences: { ...user.preferences, notifications: e.target.checked }
                    };
                    CustomerService.saveUser(updated);
                    setUser(updated);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Links Institucionais em formato de texto */}
            <div className={`p-4 rounded-xl border ${
              darkMode ? 'bg-gray-900/40 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <h3 className="font-medium text-sm flex items-center gap-2 mb-1.5">
                <span>🔒</span> Informações Legais & Privacidade
              </h3>
              <p className={`text-xs mb-3 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Seus dados são protegidos conforme a LGPD e armazenados apenas localmente no seu dispositivo.
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <button
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                >
                  Aviso de Privacidade
                </button>
                <span className="text-gray-400">•</span>
                <button
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                >
                  Termos de Uso
                </button>
                <span className="text-gray-400">•</span>
                <button
                  onClick={() => onNavigate && onNavigate(PAGES.PRIVACY)}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                >
                  Política de Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          🚀 Ações Rápidas
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105 text-left ${
                darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white text-gray-800'
              }`}
              onClick={() => handleActionClick(action.action)}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold mb-1 text-sm">{action.title}</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
