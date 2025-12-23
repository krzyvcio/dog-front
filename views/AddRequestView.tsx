
import React, { useState } from 'react';
import { ChevronLeft, MapPin, Calendar, Clock, Stethoscope, Home as HomeIcon, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { Dog, Address, ServiceType, DogWalkRequest } from '../types';

interface AddRequestViewProps {
  dogs: Dog[];
  addresses: Address[];
  onSave: (request: Omit<DogWalkRequest, 'id' | 'status'>) => void;
  onCancel: () => void;
}

export const AddRequestView: React.FC<AddRequestViewProps> = ({ dogs, addresses, onSave, onCancel }) => {
  const [selectedDogId, setSelectedDogId] = useState<number>(dogs[0]?.id || 0);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(addresses.find(a => a.isPrimary)?.id || addresses[0]?.id || 0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [budget, setBudget] = useState('30');

  const toggleService = (type: ServiceType) => {
    if (selectedServices.includes(type)) {
      setSelectedServices(selectedServices.filter(s => s !== type));
    } else {
      setSelectedServices([...selectedServices, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) { alert("Wybierz przynajmniej jedną usługę!"); return; }
    const dog = dogs.find(d => d.id === selectedDogId)!;
    const addr = addresses.find(a => a.id === selectedAddressId)!;

    onSave({
      dog,
      ownerId: 1, // Current user simulation
      date: date,
      timeSlot: time,
      serviceTypes: selectedServices,
      price: parseInt(budget) || 0,
      addressId: selectedAddressId,
      locationLabel: addr.label
    });
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return <MapPin size={20} />;
      case ServiceType.Stay: return <HomeIcon size={20} />;
      case ServiceType.VeterinaryCare: return <Stethoscope size={20} />;
      default: return <Heart size={20} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold ml-2 text-gray-900">Nowe Ogłoszenie</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Step 1: Dog Selection */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-secondary pl-2">1. Wybierz psa</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {dogs.map(dog => (
              <button key={dog.id} type="button" onClick={() => setSelectedDogId(dog.id)} className={`flex-shrink-0 w-24 flex flex-col items-center gap-2 p-3 rounded-[32px] border-2 transition-all ${selectedDogId === dog.id ? 'bg-sky-50 border-secondary shadow-lg shadow-sky-100' : 'bg-white border-gray-100 opacity-60'}`}>
                <img src={dog.image} className="w-14 h-14 rounded-full object-cover border-2 border-white" alt={dog.name} />
                <span className="text-[10px] font-black uppercase text-gray-700">{dog.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Service Selection */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-primary pl-2">2. Czego potrzebujesz?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[ServiceType.Walk, ServiceType.Stay, ServiceType.VeterinaryCare, ServiceType.Play].map(type => (
              <button 
                key={type} 
                type="button" 
                onClick={() => toggleService(type)}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${selectedServices.includes(type) ? 'bg-orange-50 border-primary text-primary' : 'bg-white border-gray-100 text-gray-400'}`}
              >
                {getServiceIcon(type)}
                <span className="text-xs font-black uppercase tracking-tight">{type === ServiceType.Walk ? 'Spacer' : type === ServiceType.Stay ? 'Hotel' : type === ServiceType.VeterinaryCare ? 'Weterynarz' : 'Zabawa'}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Date & Time */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-accent pl-2">3. Kiedy?</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none" />
            </div>
            <div className="relative">
              <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold outline-none" />
            </div>
          </div>
        </section>

        {/* Step 4: Location & Budget */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-gray-900 pl-2">4. Gdzie i za ile?</h2>
          <div className="space-y-3">
             <select value={selectedAddressId} onChange={e => setSelectedAddressId(parseInt(e.target.value))} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none appearance-none">
                {addresses.map(a => <option key={a.id} value={a.id}>{a.label}: {a.street}</option>)}
             </select>
             <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400">zł</span>
                <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="Budżet" className="w-full pl-12 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-md font-black outline-none" />
             </div>
          </div>
        </section>
      </form>

      <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0">
        <button onClick={handleSubmit} className="w-full bg-gray-900 text-white font-black py-5 rounded-[24px] text-xs uppercase tracking-[0.2em] shadow-xl">Opublikuj Ogłoszenie</button>
      </div>
    </div>
  );
};
