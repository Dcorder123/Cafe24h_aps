import React, { useState } from 'react';
import { CATEGORIES, ADMIN_PASSWORDS } from '../../utils/constants';
import { ProductService } from '../../services/ProductService';
import { onlyDecimals } from '../../utils/formatters';

const AdminModal = ({ isOpen, onClose, isAdmin, onLoginSuccess, onLogout, darkMode = false }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: CATEGORIES.COFFEE,
    imageUrl: '/images/placeholder.svg'
  });
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    // Senha simples de admin para apresentação/APS
    if (ADMIN_PASSWORDS.includes(password)) {
      onLoginSuccess();
      setPassword('');
      setError('');
    } else {
      setError('Senha incorreta! Dica: use "admin" ou "1234"');
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError('Nome e preço são obrigatórios');
      return;
    }

    ProductService.getInstance().addProduct({
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      category: form.category,
      imageUrl: form.imageUrl.trim() || '/images/placeholder.svg'
    });

    setSuccessMsg(`"${form.name}" adicionado com sucesso ao cardápio!`);
    setForm({
      name: '',
      description: '',
      price: '',
      category: CATEGORIES.COFFEE,
      imageUrl: '/images/placeholder.svg'
    });
    setError('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const handleResetCatalog = () => {
    if (window.confirm('Deseja restaurar todos os produtos originais do cardápio?')) {
      localStorage.removeItem('cafe24h_custom_products');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all ${darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-500/10 to-amber-600/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h2 className="text-xl font-bold">
              {isAdmin ? 'Painel de Administração' : 'Acesso Restrito (Admin)'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAdmin ? (
            /* Formulário de Login */
            <form onSubmit={handleLogin} className="space-y-4">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Digite a senha de administrador para gerenciar os produtos do cardápio.
              </p>

              <div>
                <label className="block text-sm font-medium mb-1">Senha de Acesso</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Dica: admin"
                  autoFocus
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-amber-500 outline-none ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                    }`}
                />
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-xl shadow-md transition-all"
              >
                Entrar como Admin
              </button>
            </form>
          ) : (
            /* Painel de Cadastro e Ações */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 p-3 rounded-xl">
                <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                  ✅ Modo Administrador Ativo
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold"
                >
                  Sair do Admin
                </button>
              </div>

              {successMsg && (
                <div className="bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-300 p-3 rounded-xl text-sm font-medium">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-3">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>➕</span> Cadastrar Novo Produto
                </h3>

                <div>
                  <label className="block text-xs font-medium mb-1">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Torta Holandesa Especial"
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Categoria</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                        }`}
                    >
                      <option value={CATEGORIES.COFFEE}>Café</option>
                      <option value={CATEGORIES.TEA}>Chá</option>
                      <option value={CATEGORIES.SNACKS}>Salgado</option>
                      <option value={CATEGORIES.SWEETS}>Doce</option>
                      <option value={CATEGORIES.DRINKS}>Bebida</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Preço (R$) <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: onlyDecimals(e.target.value) })}
                      placeholder="Ex: 14.50 (somente números)"
                      className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Descrição</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Breve descrição dos ingredientes e sabor"
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Caminho da Imagem</label>
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="/images/placeholder.svg ou URL web"
                    className={`w-full p-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300'
                      }`}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium py-3 rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                  Salvar Produto no Cardápio
                </button>
              </form>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-xs">
                <span className="text-gray-500">
                  💡 Para excluir, clique no botão vermelho do card.
                </span>
                <button
                  onClick={handleResetCatalog}
                  className="text-gray-400 hover:text-red-500 transition-colors underline"
                >
                  Restaurar Padrão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;

