
import React from 'react';
import { ArrowRight, Star, ShieldCheck, Heart, Briefcase, PawPrint, Calendar, MapPin, Clock, Home as HomeIcon, Stethoscope, ChevronRight, Play, FileText, Plus } from 'lucide-react';
import { Dog, Order, ServiceType, DogWalkRequest } from '../types';

interface HomeProps {
  onNavigate: (tab: string) => void;
  onViewOrder: (id: number) => void;
  onStartOrder?: (id: number) => void;
  dogs: Dog[];
  orders?: Order[];
  requests?: DogWalkRequest[];
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onViewOrder, onStartOrder, dogs, orders = [], requests = [] }) => {
  const plannedOrders = orders.filter(o => o.status === 'Pending' || o.status === 'InProgress');

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return <MapPin size={14} />;
      case ServiceType.Stay: return <HomeIcon size={14} />;
      case ServiceType.VeterinaryCare: return <Stethoscope size={14} />;
      default: return <Heart size={14} />;
    }
  };

  const getServiceColor = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return 'text-orange-500';
      case ServiceType.Stay: return 'text-sky-500';
      case ServiceType.VeterinaryCare: return 'text-purple-500';
      default: return 'text-primary';
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
    <div className="flex flex-col gap-6 p-4 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">Znajdź pomoc dla swojego psa!</h1>
          <p className="text-orange-100 mb-6 text-sm">Zaufani opiekunowie i profesjonalna pomoc medyczna w Twojej okolicy.</p>
          <button 
            onClick={() => onNavigate('search')}
            className="bg-white text-primary font-bold py-2.5 px-5 rounded-full text-sm inline-flex items-center gap-2 hover:bg-orange-50 transition-colors shadow-sm"
          >
            Szukaj ogłoszeń
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Planned Services Section */}
      {plannedOrders.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              Zaplanowane spotkania
            </h2>
            <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                {plannedOrders.length}
                </span>
                <ChevronRight size={14} className="text-gray-300" />
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
            {plannedOrders.map(order => (
              <div 
                key={order.id} 
                className={`flex-shrink-0 w-[280px] snap-center p-4 rounded-3xl border transition-all shadow-sm relative group ${order.status === 'InProgress' ? 'bg-orange-50 border-primary ring-1 ring-primary/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
              >
                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => onViewOrder(order.id)}>
                  <div className="relative">
                    <img src={order.dog.image} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm" alt={order.dog.name} />
                    <div className={`absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md ${getServiceColor(order.serviceType)}`}>
                      {getServiceIcon(order.serviceType)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-gray-900 leading-tight">{order.dog.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-tight">Patron: {order.walker.user.firstName}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-gray-600 bg-gray-50/80 p-3 rounded-2xl mb-3" onClick={() => onViewOrder(order.id)}>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-[11px] font-bold text-gray-700">
                        {order.date === "Dzisiaj" ? <span className="text-primary font-black uppercase mr-1">Dzisiaj</span> : order.date}
                        {order.startTime}
                    </span>
                  </div>
                </div>

                {order.status === 'Pending' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onStartOrder?.(order.id); }}
                        className="w-full bg-gray-900 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-gray-200"
                    >
                        <Play size={12} fill="currentColor" />
                        Zacznij już
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW: My Requests Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-secondary" />
            Moje Ogłoszenia
          </h2>
          <button onClick={() => onNavigate('request-list')} className="text-[10px] font-black text-secondary uppercase tracking-wider hover:underline">Zarządzaj</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {requests.map(req => (
            <div key={req.id} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-sky-100 shadow-sm p-0.5 relative">
                <img src={req.dog.image} alt={req.dog.name} className="w-full h-full rounded-2xl object-cover" />
                <div className="absolute top-1 right-1 bg-white p-0.5 rounded-md shadow-xs">
                  {getServiceIcon(req.serviceTypes[0])}
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-700">{req.date}</span>
            </div>
          ))}
          <div 
            onClick={() => onNavigate('add-request')}
            className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-sky-50 group-hover:border-secondary group-hover:text-secondary transition-all">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-medium text-gray-500 group-hover:text-secondary transition-colors uppercase tracking-widest">Dodaj</span>
          </div>
        </div>
      </div>

      {/* My Dogs Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <PawPrint size={18} className="text-primary" />
            Moje Psy
          </h2>
          <button onClick={() => onNavigate('dog-list')} className="text-[10px] font-black text-secondary uppercase tracking-wider hover:underline">Zarządzaj</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {dogs.map(dog => (
            <div key={dog.id} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-sm p-0.5">
                <img src={dog.image} alt={dog.name} className="w-full h-full rounded-2xl object-cover" />
              </div>
              <span className="text-xs font-bold text-gray-700">{dog.name}</span>
            </div>
          ))}
          <div 
            onClick={() => onNavigate('add-dog')}
            className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:border-primary group-hover:text-primary transition-all">
              <span className="text-2xl font-light">+</span>
            </div>
            <span className="text-xs font-medium text-gray-500 group-hover:text-primary transition-colors">Dodaj</span>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex flex-col items-start gap-2">
          <div className="bg-white p-2 rounded-xl text-sky-600 shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Weryfikacja</h3>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium leading-tight">100% sprawdzonych opiekunów w Twojej okolicy</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex flex-col items-start gap-2">
          <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm">
            <Heart size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Bezpieczeństwo</h3>
            <p className="text-[10px] text-gray-500 mt-0.5 font-medium leading-tight">Śledzenie GPS na żywo dla każdego spaceru</p>
          </div>
        </div>
      </div>
    </div>
  );
};
