import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import apiService from '../../services/ApiService';

const ReservationModal = ({ isOpen, onClose, onReservationComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });
  const [processing, setProcessing] = useState(false);

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReservation = async () => {
    // Validação básica
    if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setProcessing(true);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      let userId = null;
      
      if (currentUser) {
        try {
          const existingUser = await apiService.getUserByUid(currentUser.uid);
          userId = existingUser.id;
        } catch (error) {
          // Usuário não existe, criar novo
          const newUser = await apiService.createUser({
            uid: currentUser.uid,
            nome: formData.name,
            email: formData.email,
            telefone: formData.phone,
            endereco: ''
          });
          userId = newUser.id;
        }
      }

      // Criar reserva na API
      const reservationPayload = {
        usuario_id: userId,
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        data_reserva: formData.date,
        hora_reserva: formData.time,
        numero_pessoas: formData.guests,
        observacoes: formData.specialRequests || null
      };

      const reservationResult = await apiService.createReservation(reservationPayload);

      const reservationData = {
        ...formData,
        id: reservationResult.id,
        status: 'Confirmada',
        tableAssigned: reservationResult.tableAssigned,
        timestamp: new Date().toISOString()
      };

      onReservationComplete(reservationData);
      setProcessing(false);
      onClose();
      
      // Reset form
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-amber-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            🗓️ <span className="ml-2">Reservar Mesa</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
          >
            <span className="text-xl">❌</span>
          </button>
        </div>

        {/* Formulário */}
        <div className="p-6 space-y-6">
          {/* Informações Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">👤 Informações Pessoais</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="seu.email@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Detalhes da Reserva */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Detalhes da Reserva</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={getMinDate()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Selecione</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pessoas
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações Especiais
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Aniversário, acessibilidade, preferências alimentares, etc."
            />
          </div>

          {/* Informações importantes */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">ℹ️ Informações Importantes</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• A mesa será reservada por até 15 minutos após o horário marcado</li>
              <li>• Para grupos acima de 8 pessoas, entre em contato conosco</li>
              <li>• Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência</li>
              <li>• Você receberá uma confirmação por email</li>
            </ul>
          </div>
        </div>

        {/* Footer com botões */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white p-4 rounded-xl font-medium hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleReservation}
              disabled={processing}
              className="flex-1 bg-amber-600 text-white p-4 rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
