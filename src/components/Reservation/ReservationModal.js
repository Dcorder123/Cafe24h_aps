import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import apiService from '../../services/ApiService';
import { formatPhone } from '../../utils/formatters';
import { CustomerService } from '../../services/CustomerService';

const ReservationModal = ({ isOpen, onClose, onReservationComplete, darkMode = false }) => {
  const [formData, setFormData] = useState(() => {
    let saved = null;
    try {
      const u = localStorage.getItem('cafe24h_user');
      if (u) saved = JSON.parse(u);
    } catch {}
    return {
      name: saved?.name || '',
      email: saved?.email || '',
      phone: saved?.phone || '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: ''
    };
  });
  const [processing, setProcessing] = useState(false);

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleInputChange = (field, value) => {
    let finalValue = value;
    if (field === 'phone') {
      finalValue = formatPhone(value);
      const digits = finalValue.replace(/\D/g, '');
      if (digits.length >= 10) {
        const existing = CustomerService.findByPhone(digits);
        if (existing && !formData.name) {
          setFormData(prev => ({
            ...prev,
            name: existing.name || prev.name,
            email: existing.email || prev.email,
            phone: finalValue
          }));
          return;
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: finalValue
    }));
  };

  const handleReservation = async () => {
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      alert('Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    setProcessing(true);

    try {
      const auth = getAuth();
      let userId = null;
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            const existingUser = await apiService.getUserByUid(currentUser.uid);
            userId = existingUser.id;
          } catch {
            const newUser = await apiService.createUser({
              uid: currentUser.uid,
              nome: formData.name,
              email: formData.email || 'cliente@caffe.com',
              telefone: formData.phone,
              endereco: ''
            });
            userId = newUser.id;
          }
        }
      } catch {}

      // Salva usuário localmente para próximas reservas
      CustomerService.saveUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      const reservationPayload = {
        usuario_id: userId || 1,
        nome: formData.name,
        email: formData.email || '',
        telefone: formData.phone,
        data_reserva: formData.date,
        hora_reserva: formData.time,
        numero_pessoas: formData.guests,
        observacoes: formData.specialRequests || null
      };

      let reservationResult = { id: Date.now(), tableAssigned: `Mesa ${Math.floor(Math.random() * 8) + 1}` };
      try {
        const res = await apiService.createReservation(reservationPayload);
        if (res && res.id) reservationResult = res;
      } catch (err) {
        console.warn('Backend offline, salvando reserva localmente:', err.message);
      }

      const reservationData = {
        ...formData,
        id: reservationResult.id || Date.now(),
        status: 'Confirmada',
        tableAssigned: reservationResult.tableAssigned || `Mesa ${Math.floor(Math.random() * 8) + 1}`,
        timestamp: new Date().toISOString()
      };

      onReservationComplete(reservationData);
      setProcessing(false);
      onClose();
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: ''
      });

    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      alert(`Erro ao criar reserva: ${error.message}`);
      setProcessing(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-800'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          darkMode ? 'border-gray-800 bg-gray-950 text-white' : 'border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100 text-gray-800'
        }`}>
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              🗓️ <span className="ml-2">Reservar Mesa</span>
            </h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
              Campos marcados com <span className="text-red-500 font-bold">*</span> são obrigatórios
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-white text-gray-600'
            }`}
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <span>👤</span> Informações Pessoais
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nome Completo <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="seu.email@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Telefone Celular / WhatsApp <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                  darkMode ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'
                }`}
                placeholder="(XX) XXXXX-XXXX"
              />
              <span className="text-[11px] text-gray-500 mt-1 block">
                Ao digitar seu celular, seus dados salvos são carregados automaticamente.
              </span>
            </div>
          </div>

          {/* Detalhes da Reserva */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <span>📅</span> Detalhes da Reserva
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={getMinDate()}
                  className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-950 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Horário <span className="text-red-500 font-bold">*</span>
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-950 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="">Selecione o horário</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Pessoas
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 ${
                    darkMode ? 'bg-gray-950 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  {guestOptions.map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'pessoa' : 'pessoas'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className={`block text-xs sm:text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Observações Especiais
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={3}
              className={`w-full p-2.5 sm:p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none ${
                darkMode ? 'bg-gray-950 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder="Ex: Aniversário, mesa próxima à janela, acessibilidade..."
            />
          </div>

          {/* Informações importantes */}
          <div className={`p-4 rounded-xl border ${
            darkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <h4 className="font-semibold text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
              <span>ℹ️</span> Informações Importantes
            </h4>
            <ul className="text-xs space-y-1 pl-4 list-disc opacity-90">
              <li>A mesa será reservada por até 15 minutos após o horário marcado.</li>
              <li>Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência.</li>
              <li>Sua reserva fica salva no seu histórico e associada ao seu celular.</li>
            </ul>
          </div>
        </div>

        {/* Footer com botões */}
        <div className={`border-t p-6 ${
          darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className={`flex-1 p-3.5 rounded-xl font-medium text-sm transition-colors ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleReservation}
              disabled={processing}
              className="flex-1 bg-amber-600 text-white p-3.5 rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processando...
                </div>
              ) : (
                '📅 Confirmar Reserva'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
