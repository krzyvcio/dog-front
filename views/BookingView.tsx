import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, MapPin, Heart, Info, CheckCircle2, Smartphone, Stethoscope, Home as HomeIcon, X, Send, Plus } from 'lucide-react';
import { DogWalkerProfile, Dog, Address, ServiceType } from '../types';

interface BookingViewProps {
  walker: DogWalkerProfile;
  dogs: Dog[];
  addresses: Address[];
  onBack: () => void;
  onViewProfile: (walker: DogWalkerProfile) => void;
  onConfirm: (data: { dogId: number, serviceType: ServiceType, date: string, time: string, price: number, combinedWithVet?: boolean }) => void;
}

export const BookingView: React.FC<BookingViewProps> = ({ walker, dogs, addresses, onBack, onViewProfile, onConfirm }) => {
  const [selectedDogId, setSelectedDogId] = useState<number>(dogs[0]?.id);
  const [selectedService, setSelectedService] = useState<ServiceType>(walker.availableServices[0]);
  const [addMedicalCare, setAddMedicalCare] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(addresses.find(a => a.isPrimary)?.id || addresses[0]?.id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [suggestedPrice, setSuggestedPrice] = useState<string>(walker.hourlyRate.toString());
  const [showModal, setShowModal] = useState(false);

  const selectedDog = dogs.find(d => d.id === selectedDogId);
  const walkerOffersVet = walker.availableServices.includes(ServiceType.VeterinaryCare);

  useEffect(() => {
    let basePrice = walker.hourlyRate;
    let multiplier = 1;

    if (selectedService === ServiceType.Stay) multiplier = 1.5; 
    if (selectedService === ServiceType.VeterinaryCare) multiplier = 2.0; 
    
    let total = basePrice * multiplier;
    
    // Additional 40% for combined medical care if Stay is selected
    if (selectedService === ServiceType.Stay && addMedicalCare) {
        total += (basePrice * 0.8);
    }

    setSuggestedPrice(total.toFixed(0));
  }, [selectedService, addMedicalCare, walker.hourlyRate]);

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return <MapPin size={24} />;
      case ServiceType.Stay: return <HomeIcon size={24} />;
      case ServiceType.VeterinaryCare: return <Stethoscope size={24} />;
      default: return <Heart size={24} />;
    }
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return 'Spacer';
      case ServiceType.Stay: return 'Opieka stacjonarna';
      case ServiceType.VeterinaryCare: return 'Opieka medyczna';
      default: return 'Usługa';
    }
  };

  const handleFinalConfirm = () => {
    onConfirm({
      dogId: selectedDogId,
      serviceType: selectedService,
      date,
      time,
      price: parseFloat(suggestedPrice),
      combinedWithVet: addMedicalCare
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="ml-2">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Konfiguracja Spotkania</h1>
              <p className="text-[10px] text-gray-400 font-medium">Ustal szczegóły z Patronem</p>
          </div>
        </div>
        
        <button onClick={() => onViewProfile(walker)} className="flex items-center gap-2 group active:scale-95 transition-transform">
          <img src={walker.user.image} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary ring-offset-2" alt={walker.user.firstName} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-44">
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">1. Wybierz psa</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dogs.map(dog => (
              <button key={dog.id} onClick={() => setSelectedDogId(dog.id)} className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${selectedDogId === dog.id ? 'bg-orange-50 border-primary ring-1 ring-primary/20 shadow-sm' : 'bg-white border-gray-100'}`}>
                <img src={dog.image} className="w-14 h-14 rounded-full object-cover" alt={dog.name} />
                <span className="text-xs font-bold text-gray-700">{dog.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">2. Rodzaj usługi</h2>
          <div className="space-y-3">
            {walker.availableServices.map(service => (
              <button 
                key={service}
                onClick={() => { setSelectedService(service); if(service !== ServiceType.Stay) setAddMedicalCare(false); }}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${selectedService === service ? 'bg-gray-900 border-gray-900 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500'}`}
              >
                <div className={`p-3 rounded-xl ${selectedService === service ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-400'}`}>
                    {getServiceIcon(service)}
                </div>
                <div className="flex-1">
                    <span className="block text-sm font-bold">{getServiceLabel(service)}</span>
                    <span className={`block text-[10px] ${selectedService === service ? 'text-gray-300' : 'text-gray-400'}`}>
                        {service === ServiceType.Stay ? 'Pełna opieka domowa' : 'Profesjonalne wsparcie'}
                    </span>
                </div>
                {selectedService === service && <CheckCircle2 size={20} className="text-primary" />}
              </button>
            ))}
          </div>

          {selectedService === ServiceType.Stay && walkerOffersVet && (
            <div className="mt-4 p-4 rounded-2xl border-2 border-dashed border-purple-100 bg-purple-50/30 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Stethoscope size={18} /></div>
                    <div>
                        <p className="text-xs font-bold text-purple-900">Dodaj opiekę medyczną</p>
                        <p className="text-[10px] text-purple-600">Patron poda leki lub zmieni opatrunki</p>
                    </div>
                </div>
                <button 
                    onClick={() => setAddMedicalCare(!addMedicalCare)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${addMedicalCare ? 'bg-purple-600' : 'bg-gray-200'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${addMedicalCare ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">3. Kiedy?</h2>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-4 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full pl-4 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none" />
          </div>
        </section>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex gap-3 shadow-sm">
            <Smartphone className="text-accent shrink-0" size={20} />
            <div>
                <p className="text-xs font-bold text-emerald-900">Rozliczenie bezpośrednie</p>
                <p className="text-[10px] text-emerald-700 leading-tight mt-1">Sugerowany datek: <span className="font-bold">{suggestedPrice} zł</span> (płacisz BLIKiem po usłudze).</p>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-2xl z-30 max-w-md mx-auto">
        <button onClick={() => setShowModal(true)} className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95">
          Poproś o opiekę ({suggestedPrice} zł)
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="bg-white w-full max-w-[320px] rounded-[32px] p-8 relative z-10 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                    {getServiceIcon(selectedService)}
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Potwierdź prośbę</h2>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                    Wyślesz prośbę o <b>{getServiceLabel(selectedService)}</b> {addMedicalCare && 'z wsparciem medycznym'} dla psa <b>{selectedDog?.name}</b>.
                </p>
                <button onClick={handleFinalConfirm} className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
                    <Send size={18} /> Wyślij prośbę
                </button>
            </div>
        </div>
      )}
    </div>
  );
};