import React, { useState } from 'react';
import ReservationModal from '../components/Reservation/ReservationModal';

const ReservationPage = ({ darkMode = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('cafe24h_reservations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const handleReservationComplete = (reservationData) => {
    setReservations(prev => {
      const updated = [reservationData, ...prev];
      try {
        localStorage.setItem('cafe24h_reservations', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    alert(`Reserva confirmada para ${reservationData.name} em ${reservationData.date} às ${reservationData.time}!`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          🗓️ Reservas de Mesa
        </h1>
        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Reserve sua mesa no Caffe e garanta o melhor lugar para você e seus amigos
        </p>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          📅 Nova Reserva
        </button>
      </div>

      {/* Informações sobre o restaurante */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className={`rounded-2xl shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white text-gray-700'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            🏪 <span className="ml-2">Sobre o Caffe</span>
          </h3>
          <div className="space-y-3">
            <p className="flex items-center">
              <span className="w-6">📍</span>
              <span className="ml-2">Rua do Café, 123 - Centro</span>
            </p>
            <p className="flex items-center">
              <span className="w-6">📞</span>
              <span className="ml-2">(11) 99999-9999</span>
            </p>
            <p className="flex items-center">
              <span className="w-6">⏰</span>
              <span className="ml-2">Seg-Dom: 12:00 às 22:00</span>
            </p>
            <p className="flex items-center">
              <span className="w-6">🪑</span>
              <span className="ml-2">Capacidade: 80 lugares</span>
            </p>
          </div>
        </div>

        <div className={`rounded-2xl shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-200' : 'bg-white text-gray-700'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            ✨ <span className="ml-2">Diferenciais</span>
          </h3>
          <div className="space-y-3">
            <p className="flex items-start">
              <span className="w-6 mt-1">☕</span>
              <span className="ml-2">Cafés especiais selecionados</span>
            </p>
            <p className="flex items-start">
              <span className="w-6 mt-1">🌐</span>
              <span className="ml-2">Wi-Fi gratuito</span>
            </p>
            <p className="flex items-start">
              <span className="w-6 mt-1">♿</span>
              <span className="ml-2">Espaço acessível</span>
            </p>
            <p className="flex items-start">
              <span className="w-6 mt-1">🅿️</span>
              <span className="ml-2">Estacionamento próprio</span>
            </p>
          </div>
        </div>
      </div>

      {/* Lista de reservas */}
      {reservations.length > 0 && (
        <div className={`rounded-2xl shadow-lg p-6 ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-100' : 'bg-white text-gray-800'
        }`}>
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            📋 <span className="ml-2">Suas Reservas</span>
          </h3>
          
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className={`border rounded-xl p-4 transition-shadow ${
                  darkMode ? 'border-gray-700 bg-gray-900/40 hover:border-gray-600' : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{reservation.name}</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{reservation.email}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    {reservation.status}
                  </span>
                </div>
                
                <div className={`grid md:grid-cols-4 gap-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className="w-5">📅</span>
                    <span className="ml-2">{formatDate(reservation.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5">⏰</span>
                    <span className="ml-2">{reservation.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5">👥</span>
                    <span className="ml-2">{reservation.guests} pessoas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-5">📞</span>
                    <span className="ml-2">{reservation.phone}</span>
                  </div>
                </div>
                
                {reservation.specialRequests && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <p>
                      <strong>Observações:</strong> {reservation.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de reserva */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReservationComplete={handleReservationComplete}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ReservationPage;
