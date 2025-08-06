import React, { useState } from 'react';
import ReservationModal from '../components/Reservation/ReservationModal';

const ReservationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState([]);

  const handleReservationComplete = (reservationData) => {
    setReservations(prev => [...prev, reservationData]);
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🗓️ Reservas de Mesa
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Reserve sua mesa no Caffe e garante o melhor lugar para você e seus amigos
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            🏪 <span className="ml-2">Sobre o Caffe</span>
          </h3>
          <div className="space-y-3 text-gray-600">
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

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            ✨ <span className="ml-2">Diferenciais</span>
          </h3>
          <div className="space-y-3 text-gray-600">
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            📋 <span className="ml-2">Suas Reservas</span>
          </h3>
          
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{reservation.name}</h4>
                    <p className="text-sm text-gray-600">{reservation.email}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {reservation.status}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
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
      />
    </div>
  );
};

export default ReservationPage;
