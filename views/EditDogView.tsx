
import React, { useState, useRef } from 'react';
import { Camera, ChevronLeft, Trash2, AlertTriangle } from 'lucide-react';
import { Dog, Order, Address } from '../types';
import { DOG_BREEDS, Breed } from '../services/breeds';

interface EditDogViewProps {
  dog: Dog;
  onSave: (dog: Dog) => void;
  onDelete: (id: number) => void;
  onCancel: () => void;
  orders: Order[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const EditDogView: React.FC<EditDogViewProps> = ({ dog, onSave, onDelete, onCancel, orders }) => {
  const [formData, setFormData] = useState({
    name: dog.name,
    breed: dog.breed,
    age: dog.age.toString(),
    notes: dog.notes || ''
  });

  const [image, setImage] = useState<string | null>(dog.image);
  const [breedSearch, setBreedSearch] = useState(dog.breed);
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasScheduledServices = orders.some(order => 
    order.dog.id === dog.id && 
    (order.status === 'Pending' || order.status === 'InProgress')
  );

  const handleBreedChange = (val: string) => {
    setFormData({ ...formData, breed: val });
    setBreedSearch(val);
    if (val.trim().length > 1) {
      const search = val.toLowerCase();
      const filtered = DOG_BREEDS.filter(b => b.polish.toLowerCase().includes(search)).slice(0, 5);
      setFilteredBreeds(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...dog,
      name: formData.name,
      breed: formData.breed,
      age: parseInt(formData.age) || 0,
      image: image || dog.image,
      notes: formData.notes
    });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <button onClick={onCancel} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold ml-2 text-gray-900">Edytuj profil: {dog.name}</h1>
        </div>
        <button onClick={() => setShowDeleteModal(true)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-[40px] border-2 border-primary overflow-hidden cursor-pointer shadow-lg shadow-orange-100">
            <img src={image || ''} alt="Profil psa" className="w-full h-full object-cover" />
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); } }} accept="image/*" className="hidden" />
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Zmień zdjęcie</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-4 border-primary pl-2">Informacje podstawowe</h2>
          <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input required type="text" value={breedSearch} onChange={(e) => handleBreedChange(e.target.value)} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
              {showSuggestions && (
                <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-56 overflow-y-auto">
                  {filteredBreeds.map((b, i) => (
                    <button key={i} type="button" onClick={() => { setFormData({...formData, breed: b.polish}); setBreedSearch(b.polish); setShowSuggestions(false); }} className="w-full text-left p-4 hover:bg-orange-50 text-xs font-bold border-b border-gray-50 last:border-0">{b.polish}</button>
                  ))}
                </div>
              )}
            </div>
            <input required type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Notatki behawioralne</label>
          <textarea rows={4} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none resize-none font-medium text-gray-600" />
        </div>
      </form>

      <div className="p-4 border-t border-gray-100 bg-white">
        <button onClick={handleSubmit} className="w-full bg-gray-900 text-white font-black py-5 rounded-[20px] text-xs uppercase tracking-[0.2em] shadow-xl">Zapisz zmiany</button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowDeleteModal(false)}></div>
            <div className="bg-white w-full max-w-[340px] rounded-[48px] p-8 relative z-10 text-center shadow-2xl animate-in zoom-in duration-300">
                {hasScheduledServices ? (
                    <>
                        <div className="w-20 h-20 bg-amber-50 rounded-[32px] flex items-center justify-center text-amber-500 mx-auto mb-6"><AlertTriangle size={36} /></div>
                        <h2 className="text-xl font-black text-gray-900 mb-4">Nie można usunąć</h2>
                        <p className="text-xs text-amber-800 font-bold mb-8">Pies ma aktywne zlecenia.</p>
                        <button onClick={() => setShowDeleteModal(false)} className="w-full bg-gray-900 text-white font-black py-5 rounded-[24px] text-xs uppercase tracking-widest">Rozumiem</button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-black text-gray-900 mb-2">Usuwasz profil?</h2>
                        <div className="space-y-3 mt-8">
                            <button onClick={() => { onDelete(dog.id); setShowDeleteModal(false); }} className="w-full bg-red-500 text-white font-black py-4 rounded-[24px] shadow-lg text-xs uppercase tracking-widest">Usuń</button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full bg-gray-100 text-gray-600 font-black py-4 rounded-[24px] text-xs uppercase tracking-widest">Anuluj</button>
                        </div>
                    </>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

const ServiceToggle = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button type="button" onClick={onClick} className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-[10px] font-black uppercase tracking-tight ${active ? 'bg-orange-50 border-primary text-primary shadow-sm' : 'bg-white border-gray-100 text-gray-400'}`}>
    {label}
  </button>
);
