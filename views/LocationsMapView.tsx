
import React, { useState, useMemo } from 'react';
import { ChevronLeft, MapPin, Stethoscope, ShoppingBag, Home as HomeIcon, Search as SearchIcon, Phone, Globe, Navigation, ExternalLink, Info } from 'lucide-react';
import { DogPlace, PlaceType } from '../types';
import { DOG_PLACES } from '../services/locationData';

interface LocationsMapViewProps {
  onBack: () => void;
}

export const LocationsMapView: React.FC<LocationsMapViewProps> = ({ onBack }) => {
  const [filter, setFilter] = useState<PlaceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = useMemo(() => {
    return DOG_PLACES.filter(place => {
      const matchesFilter = filter === 'all' || place.type === filter;
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (place.street && place.street.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (place.city && place.city.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const getPlaceIcon = (type: PlaceType) => {
    switch (type) {
      case PlaceType.Veterinary: return <Stethoscope size={20} className="text-purple-500" />;
      case PlaceType.PetShop: return <ShoppingBag size={20} className="text-sky-500" />;
      case PlaceType.Shelter: return <HomeIcon size={20} className="text-orange-500" />;
      default: return <MapPin size={20} className="text-gray-400" />;
    }
  };

  const getPlaceLabel = (type: PlaceType) => {
    switch (type) {
      case PlaceType.Veterinary: return "Weterynarz";
      case PlaceType.PetShop: return "Sklep zoologiczny";
      case PlaceType.Shelter: return "Schronisko";
      default: return "Punkt";
    }
  };

  const openInExternalMaps = (place: DogPlace) => {
    const query = encodeURIComponent(`${place.name} ${place.street || ''} ${place.city || ''}`);
    // Universal Google Maps link for navigation
    const url = `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${place.id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center p-4">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
            </button>
            <div className="ml-2">
                <h1 className="text-lg font-black text-gray-900 leading-tight">Placówki i Weterynarze</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Twoja okolica (promień 100km)</p>
            </div>
        </div>
        
        <div className="px-4 pb-4 space-y-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-2xl">
                <SearchIcon size={18} className="text-gray-400 ml-1" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj po nazwie lub mieście..." 
                    className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400 font-medium"
                />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <FilterChip label="Wszystkie" active={filter === 'all'} onClick={() => setFilter('all')} />
                <FilterChip label="Weterynarze" active={filter === PlaceType.Veterinary} onClick={() => setFilter(PlaceType.Veterinary)} icon={<Stethoscope size={14} />} />
                <FilterChip label="Sklepy" active={filter === PlaceType.PetShop} onClick={() => setFilter(PlaceType.PetShop)} icon={<ShoppingBag size={14} />} />
                <FilterChip label="Schroniska" active={filter === PlaceType.Shelter} onClick={() => setFilter(PlaceType.Shelter)} icon={<HomeIcon size={14} />} />
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{filteredPlaces.length} znalezionych punktów</span>
        </div>
        
        {filteredPlaces.length > 0 ? (
            filteredPlaces.map(place => (
                <div 
                    key={place.id}
                    className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 flex flex-col gap-4 animate-in fade-in duration-300"
                >
                    <div className="flex gap-4">
                        <div className="shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                            {getPlaceIcon(place.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-md font-black text-gray-900 leading-tight mb-0.5">{place.name}</h3>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{getPlaceLabel(place.type)}</p>
                            
                            <button 
                                onClick={() => openInExternalMaps(place)}
                                className="flex items-start gap-1.5 text-left group"
                            >
                                <MapPin size={14} className="text-gray-300 shrink-0 mt-0.5 group-hover:text-secondary transition-colors" />
                                <span className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-secondary group-hover:underline">
                                    {place.city ? `${place.city}, ` : ''}{place.street || 'Adres na mapie'} {place.houseNumber || ''}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        {place.phone && (
                            <a 
                                href={`tel:${place.phone.replace(/\s/g, '')}`}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                                <Phone size={14} className="text-gray-400" /> Zadzwoń
                            </a>
                        )}
                        <button 
                            onClick={() => openInExternalMaps(place)}
                            className="flex-1 bg-gray-900 text-white py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-md"
                        >
                            <Navigation size={14} className="text-primary" /> Prowadź
                        </button>
                        {place.website && (
                             <a 
                                href={place.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 bg-sky-50 text-secondary rounded-2xl flex items-center justify-center hover:bg-sky-100 transition-colors"
                            >
                                <Globe size={18} />
                            </a>
                        )}
                    </div>
                </div>
            ))
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-300">
                <Info size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold">Brak wyników dla wybranych filtrów</p>
            </div>
        )}

        <div className="py-6 text-center">
          <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.3em]">DogGo • Twoje lokalne wsparcie</p>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon?: React.ReactNode }) => (
    <button 
      onClick={onClick}
      className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${active ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
    >
      {icon}
      {label}
    </button>
);
