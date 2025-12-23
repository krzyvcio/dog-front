import React, { useState } from 'react';
import { ChevronLeft, MapPin, Trash2, CheckCircle2 } from 'lucide-react';
import { Address } from '../types';

interface AddressEditViewProps {
  address?: Address;
  onSave: (address: Omit<Address, 'id'> & { id?: number }) => void;
  onDelete?: (id: number) => void;
  onCancel: () => void;
}

export const AddressEditView: React.FC<AddressEditViewProps> = ({ 
  address, 
  onSave, 
  onDelete, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    label: address?.label || '',
    street: address?.street || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    notes: address?.notes || '',
    isPrimary: address?.isPrimary || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: address?.id
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center">
          <button onClick={onCancel} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold ml-2 text-gray-900">
            {address ? 'Edytuj Adres' : 'Nowy Adres'}
          </h1>
        </div>
        {address && !address.isPrimary && onDelete && (
          <button 
            onClick={() => { if(confirm('Usunąć ten adres?')) onDelete(address.id); }}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Etykieta (np. Dom, Biuro)</label>
            <input 
              required
              type="text" 
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              placeholder="np. Dom"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Ulica i numer</label>
            <div className="relative">
              <input 
                required
                type="text" 
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                placeholder="ul. Piękna 1"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
              />
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Kod pocztowy</label>
              <input 
                required
                type="text" 
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                placeholder="00-000"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Miasto</label>
              <input 
                required
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Warszawa"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Wskazówki dla opiekuna</label>
            <textarea 
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="np. Domofon 15, wejście od podwórka..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button 
              type="button"
              onClick={() => setFormData({...formData, isPrimary: !formData.isPrimary})}
              className={`flex items-center gap-3 w-full p-4 rounded-xl border transition-all ${formData.isPrimary ? 'bg-orange-50 border-primary text-primary' : 'bg-white border-gray-100 text-gray-500'}`}
            >
              <CheckCircle2 size={20} className={formData.isPrimary ? 'text-primary' : 'text-gray-200'} />
              <div className="text-left">
                <p className="text-sm font-bold">Adres główny</p>
                <p className="text-[10px] opacity-70">Ustaw jako domyślny adres odbioru psa</p>
              </div>
            </button>
          </div>
        </div>
      </form>

      <div className="p-4 border-t border-gray-100 pb-safe">
        <button 
          onClick={handleSubmit}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-orange-600 transition-colors active:scale-[0.98]"
        >
          Zapisz Adres
        </button>
      </div>
    </div>
  );
};