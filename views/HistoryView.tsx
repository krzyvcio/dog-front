import React from 'react';
// Add missing History import from lucide-react
import { ChevronLeft, Calendar, MapPin, Home as HomeIcon, Stethoscope, Heart, Star, Search, Filter, History } from 'lucide-react';
import { Order, ServiceType } from '../types';

interface HistoryViewProps {
  orders: Order[];
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ orders, onBack }) => {
  // Simulating some finished orders if they don't exist in the mock
  const finishedOrders = orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled').length > 0 
    ? orders.filter(o => o.status === 'Completed' || o.status === 'Cancelled')
    : [
        {
          id: 9001,
          dog: orders[0]?.dog || { name: 'Burek', breed: 'Golden', image: 'https://picsum.photos/200/200?random=10' },
          walker: orders[0]?.walker || { user: { firstName: 'Marek' } },
          date: '15 Paź 2023',
          startTime: '14:00',
          serviceType: ServiceType.Walk,
          status: 'Completed',
          totalCost: 50
        },
        {
          id: 9002,
          dog: orders[1]?.dog || { name: 'Luna', breed: 'Buldog', image: 'https://picsum.photos/200/200?random=11' },
          walker: orders[1]?.walker || { user: { firstName: 'Julia' } },
          date: '12 Paź 2023',
          startTime: '10:30',
          serviceType: ServiceType.VeterinaryCare,
          status: 'Completed',
          totalCost: 80
        }
      ];

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return <MapPin size={18} />;
      case ServiceType.Stay: return <HomeIcon size={18} />;
      case ServiceType.VeterinaryCare: return <Stethoscope size={18} />;
      default: return <Heart size={18} />;
    }
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return 'Spacer';
      case ServiceType.Stay: return 'Opieka';
      case ServiceType.VeterinaryCare: return 'Weterynarz';
      default: return 'Usługa';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-black ml-2 text-gray-900">Historia usług</h1>
        </div>
        <button className="p-2 text-gray-400">
          <Filter size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4 pb-10">
        {/* Search Bar */}
        <div className="relative">
            <input 
                type="text" 
                placeholder="Szukaj w historii..." 
                className="w-full bg-white border border-gray-100 px-10 py-3 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm"
            />
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>

        <div className="space-y-4">
          {finishedOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3 group active:scale-[0.99] transition-all">
                <div className="flex items-center gap-4">
                    <img src={order.dog.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt={order.dog.name} />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-black text-gray-900 leading-tight">{order.dog.name}</h3>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                {order.status === 'Completed' ? 'Zakończono' : 'Anulowano'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                            <Calendar size={12} />
                            <span className="text-[11px] font-bold">{order.date}, {order.startTime}</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-50" />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            {getServiceIcon(order.serviceType as ServiceType)}
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{getServiceLabel(order.serviceType as ServiceType)}</p>
                            <p className="text-xs font-black text-gray-700">Patron: {order.walker.user.firstName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Koszt</p>
                        <p className="font-black text-gray-900">{order.totalCost} zł</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={10} fill="currentColor" />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-300 font-medium">Ocena wystawiona</span>
                </div>
            </div>
          ))}
        </div>

        {/* Empty State Mock */}
        {finishedOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <History size={64} className="mb-4 text-gray-300" />
            <p className="text-sm font-bold text-gray-500">Brak historii usług</p>
          </div>
        )}
      </div>
    </div>
  );
};