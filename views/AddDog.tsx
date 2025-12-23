
import React, { useState, useRef } from 'react';
import { Camera, ChevronLeft, PawPrint, Search as SearchIcon, X, AlertCircle } from 'lucide-react';
import { Dog } from '../types';
import { DOG_BREEDS, Breed } from '../services/breeds';

interface AddDogProps {
  onSave: (dog: Omit<Dog, 'id'>) => void;
  onCancel: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const AddDog: React.FC<AddDogProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    notes: ''
  });

  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [breedSearch, setBreedSearch] = useState('');
  const [filteredBreeds, setFilteredBreeds] = useState<Breed[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBreedChange = (val: string) => {
    setFormData({ ...formData, breed: val });
    setBreedSearch(val);
    if (val.trim().length > 1) {
      const search = val.toLowerCase();
      const filtered = DOG_BREEDS.filter(b => b.polish.toLowerCase().includes(search)).slice(0, 10);
      setFilteredBreeds(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) { setImageError('Zdjęcie jest wymagane.'); return; }
    onSave({
      name: formData.name,
      breed: formData.breed,
      age: parseInt(formData.age) || 1,
      image: image,
      notes: formData.notes
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold ml-2 text-gray-900">Dodaj Psa</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        <div className="flex flex-col items-center justify-center gap-3">
          <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 rounded-[40px] border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden relative">
            {image ? <img src={image} className="w-full h-full object-cover" /> : <Camera size={32} className="text-gray-300" />}
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); } }} accept="image/*" className="hidden" />
          {imageError && <p className="text-red-500 text-[10px] font-bold uppercase">{imageError}</p>}
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-primary pl-2">Informacje podstawowe</h2>
          <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Imię psa" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
          <div className="grid grid-cols-2 gap-4">
             <div className="relative">
                <input required type="text" value={breedSearch} onChange={(e) => handleBreedChange(e.target.value)} placeholder="Rasa" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
                {showSuggestions && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-56 overflow-y-auto">
                    {filteredBreeds.map((b, i) => (
                      <button key={i} type="button" onClick={() => { setFormData({...formData, breed: b.polish}); setBreedSearch(b.polish); setShowSuggestions(false); }} className="w-full text-left p-4 hover:bg-orange-50 text-xs font-bold border-b border-gray-50 last:border-0">{b.polish}</button>
                    ))}
                  </div>
                )}
             </div>
             <input required type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="Wiek" className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 font-bold" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Opisz swojego psa</label>
          <textarea rows={4} value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Np. Boi się dużych psów, uwielbia aportować..." className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 outline-none resize-none font-medium text-gray-600" />
        </div>
      </form>

      <div className="p-4 border-t border-gray-100 bg-white">
        <button onClick={handleSubmit} className="w-full bg-gray-900 text-white font-black py-5 rounded-[20px] text-xs uppercase tracking-widest">Utwórz profil psa</button>
      </div>
    </div>
  );
};
