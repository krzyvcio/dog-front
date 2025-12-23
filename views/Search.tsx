
import React, { useState, useMemo } from 'react';
import { Filter, Star, MapPin, Clock, Calendar, Users, Heart, ArrowRight, Search as SearchIcon, Info, ShieldCheck, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { WALKERS, DOG_REQUESTS } from '../services/mockData';
import { ServiceType, DogWalkerProfile, User, WalkerTier, DogWalkRequest } from '../types';

type SearchMode = 'find-walker' | 'find-dog';

interface SearchProps {
  onBookWalker: (walker: DogWalkerProfile) => void;
  onAcceptRequest: (request: DogWalkRequest) => void;
  user: User;
}

export const Search: React.FC<SearchProps> = ({ onBookWalker, onAcceptRequest, user }) => {
  const [mode, setMode] = useState<SearchMode>('find-walker');
  const [filterType, setFilterType] = useState<ServiceType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmingRequest, setConfirmingRequest] = useState<DogWalkRequest | null>(null);

  const filteredWalkers = WALKERS.filter(walker => {
    const matchesSearch = (walker.user.firstName + ' ' + walker.user.lastName + ' ' + walker.bio)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || walker.availableServices.includes(filterType as ServiceType);
    return matchesSearch && matchesType;
  });

  const filteredRequests = DOG_REQUESTS.filter(req => {
    // Fix: Using locationLabel instead of non-existent location
    const matchesSearch = (req.dog.name + ' ' + req.locationLabel)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // Fix: Using serviceTypes.includes instead of non-existent serviceType
    const matchesType = filterType === 'All' || req.serviceTypes.includes(filterType as ServiceType);
    return matchesSearch && matchesType;
  });

  const canAcceptRequest = (request: DogWalkRequest) => {
    const tier = user.walkerTier;
    if (tier === WalkerTier.Vet) return true;
    
    // Fix: Checking first service type in the list as primary for authorization check
    const primaryService = request.serviceTypes[0];
    if (tier === WalkerTier.Animator) {
      return [ServiceType.Walk, ServiceType.Play, ServiceType.Feeding, ServiceType.Stay].includes(primaryService);
    }
    if (tier === WalkerTier.Lover) {
      return [ServiceType.Walk, ServiceType.Play].includes(primaryService);
    }
    return false;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="sticky top-0 z-40 bg-white shadow-sm pt-4 pb-2">
        <div className="px-4 mb-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setMode('find-walker')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === 'find-walker' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              <Users size={16} /> Szukaj Patrona
            </button>
            <button onClick={() => setMode('find-dog')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${mode === 'find-dog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              <Heart size={16} /> Szukaj Psa
            </button>
          </div>
        </div>

        <div className="px-4 space-y-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
            <SearchIcon size={18} className="text-gray-400 ml-1" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={mode === 'find-walker' ? "Szukaj po imieniu..." : "Szukaj psów w okolicy..."} 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 font-medium"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterPill label="Wszystkie" active={filterType === 'All'} onClick={() => setFilterType('All')} />
            <FilterPill label="Spacer" active={filterType === ServiceType.Walk} onClick={() => setFilterType(ServiceType.Walk)} />
            <FilterPill label="Hotel" active={filterType === ServiceType.Stay} onClick={() => setFilterType(ServiceType.Stay)} />
            <FilterPill label="Weterynarz" active={filterType === ServiceType.VeterinaryCare} onClick={() => setFilterType(ServiceType.VeterinaryCare)} />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {mode === 'find-walker' ? (
          filteredWalkers.map(walker => (
            <div key={walker.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 group">
              <div className="flex gap-4">
                <div className="relative">
                  <img src={walker.user.image} alt={walker.user.firstName} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div className="absolute -bottom-1 -right-1 bg-secondary text-white p-1 rounded-full border-2 border-white">
                    <CheckCircle2 size={10} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900 leading-none mb-1">{walker.user.firstName} {walker.user.lastName}</h3>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{walker.tier}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">"{walker.bio}"</p>
                </div>
              </div>
              <div className="h-px bg-gray-50" />
              <button onClick={() => onBookWalker(walker)} className="w-full bg-gray-900 text-white text-xs font-bold py-3 rounded-xl shadow-sm">
                Szczegóły i Rezerwacja
              </button>
            </div>
          ))
        ) : (
          filteredRequests.map(request => {
            const allowed = canAcceptRequest(request);
            return (
              <div key={request.id} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 transition-opacity ${!allowed ? 'opacity-60' : ''}`}>
                <div className="flex gap-4">
                  <img src={request.dog.image} alt={request.dog.name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 leading-none mb-1">{request.dog.name}</h3>
                        <span className="text-[10px] font-bold text-primary bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">{request.dog.breed}</span>
                      </div>
                      <div className="text-right">
                          <span className="block font-black text-gray-900">{request.price} zł</span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700">
                        <Calendar size={14} className="text-primary" /> {request.date}, {request.timeSlot}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-gray-50" />
                {allowed ? (
                  <button onClick={() => setConfirmingRequest(request)} className="w-full bg-primary/10 text-primary py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-primary/20">
                    Chcę pomóc temu psu
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-2 text-[9px] font-black text-amber-600 bg-amber-50 rounded-xl uppercase tracking-tighter">
                    {/* Fix: Accessing first service in the array as the primary one for authorization check */}
                    <AlertTriangle size={12} /> Wymagana ranga: {request.serviceTypes[0] === ServiceType.VeterinaryCare ? 'Psi Zbawiciel' : 'Psi Animator'}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {confirmingRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setConfirmingRequest(null)}></div>
          <div className="bg-white w-full max-w-[340px] rounded-[48px] p-8 relative z-10 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-orange-50 rounded-[32px] flex items-center justify-center text-primary mx-auto mb-6">
              <Heart size={36} fill="currentColor" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Przyjmujesz zlecenie?</h2>
            <p className="text-sm text-gray-500 mb-8">Czy na pewno chcesz zaopiekować się psem <b>{confirmingRequest.dog.name}</b> w terminie {confirmingRequest.date}?</p>
            <div className="space-y-3">
              <button onClick={() => { onAcceptRequest(confirmingRequest); setConfirmingRequest(null); }} className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                <Send size={18} /> Tak, biorę to!
              </button>
              <button onClick={() => setConfirmingRequest(null)} className="w-full bg-gray-100 text-gray-600 font-black py-4 rounded-[24px] text-xs uppercase tracking-widest">Wróć</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterPill = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${active ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}>
    {label}
  </button>
);
