
import React from 'react';
import { ChevronLeft, Plus, MapPin, Edit2, Star, Home, Briefcase, Map as MapIcon } from 'lucide-react';
import { Address } from '../types';
import { PullToRefresh } from '../components/PullToRefresh';

interface AddressListViewProps {
  addresses: Address[];
  onBack: () => void;
  onEdit: (address: Address) => void;
  onAddNew: () => void;
  onSetPrimary: (id: number) => void;
}

export const AddressListView: React.FC<AddressListViewProps> = ({ 
  addresses, 
  onBack, 
  onEdit, 
  onAddNew,
  onSetPrimary
}) => {
  const handleRefresh = async () => {
    // Simulate data reload
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2 text-gray-900">Moje Adresy</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-4">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                className={`bg-white p-4 rounded-2xl shadow-sm border transition-all relative ${address.isPrimary ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${address.isPrimary ? 'bg-orange-50 text-primary' : 'bg-gray-50 text-gray-400'}`}>
                    {address.label.toLowerCase() === 'dom' ? <Home size={22} /> : 
                     address.label.toLowerCase() === 'biuro' ? <Briefcase size={22} /> : 
                     <MapIcon size={22} />}
                  </div>
                  
                  <div className="flex-1 pr-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{address.label}</h3>
                      {address.isPrimary && (
                        <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Główny
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-tight">
                      {address.street}<br />
                      {address.postalCode} {address.city}
                    </p>
                    {address.notes && (
                      <p className="text-[10px] text-gray-400 mt-2 italic line-clamp-1">
                        "{address.notes}"
                      </p>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button 
                      onClick={() => onEdit(address)}
                      className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>

                {!address.isPrimary && (
                  <button 
                    onClick={() => onSetPrimary(address.id)}
                    className="mt-4 w-full text-center py-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors border-t border-gray-50"
                  >
                    Ustaw jako adres główny
                  </button>
                )}
              </div>
            ))}

            {addresses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <MapPin size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Brak zapisanych adresów</p>
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>

      {/* Footer Add Button */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <button 
          onClick={onAddNew}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Dodaj nowy adres
        </button>
      </div>
    </div>
  );
};
