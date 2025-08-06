import React, { useState } from 'react';

const AccountPage = () => {
  const [user, setUser] = useState({
    name: 'Usuário Anônimo',
    email: 'usuario@anonimo.com',
    phone: '',
    address: '',
    preferences: {
      notifications: true,
      newsletter: false,
      darkMode: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference, value) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    console.log('Perfil atualizado:', editForm);
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const accountStats = [
    { label: 'Pedidos Realizados', value: '12', icon: '📦' },
    { label: 'Total Gasto', value: 'R$ 324,50', icon: '💰' },
    { label: 'Pontos de Fidelidade', value: '150', icon: '⭐' },
    { label: 'Membro desde', value: 'Janeiro 2024', icon: '📅' }
  ];

  const quickActions = [
    { title: 'Meus Pedidos', description: 'Acompanhe seus pedidos', icon: '📋', action: 'orders' },
    { title: 'Favoritos', description: 'Seus itens preferidos', icon: '❤️', action: 'favorites' },
    { title: 'Endereços', description: 'Gerencie endereços de entrega', icon: '📍', action: 'addresses' },
    { title: 'Cupons', description: 'Veja seus cupons disponíveis', icon: '🎫', action: 'coupons' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-8 rounded-2xl shadow-md mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Informações do usuário */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Olá, {user.name}! 👋
            </h1>
            <p className="text-gray-600 mb-4">
              Gerencie seu perfil e acompanhe seus pedidos
            </p>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200 flex items-center gap-2"
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {accountStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Informações do Perfil */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            👤 <span className="ml-2">Informações Pessoais</span>
          </h2>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, bairro, cidade..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                >
                  ✅ Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Nome:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Telefone:</span>
                <span className="font-medium">{user.phone || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Endereço:</span>
                <span className="font-medium text-right max-w-xs">
                  {user.address || 'Não informado'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Preferências */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            ⚙️ <span className="ml-2">Preferências</span>
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Notificações</h3>
                <p className="text-sm text-gray-600">Receber notificações sobre pedidos</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditing ? editForm.preferences.notifications : user.preferences.notifications}
                  onChange={(e) => isEditing && handlePreferenceChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Newsletter</h3>
                <p className="text-sm text-gray-600">Receber ofertas e novidades</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditing ? editForm.preferences.newsletter : user.preferences.newsletter}
                  onChange={(e) => isEditing && handlePreferenceChange('newsletter', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Modo Escuro</h3>
                <p className="text-sm text-gray-600">Interface com tema escuro</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditing ? editForm.preferences.darkMode : user.preferences.darkMode}
                  onChange={(e) => isEditing && handlePreferenceChange('darkMode', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">🚀 Ações Rápidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105 text-left"
              onClick={() => console.log(`Ação: ${action.action}`)}
            >
              <div className="text-3xl mb-3">{action.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
