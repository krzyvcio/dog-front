
import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, User, Shield, Briefcase, Heart, AlertCircle, CheckCircle2, X, Mail, Coins, Medal } from 'lucide-react';
import { CURRENT_USER } from '../services/mockData';
import { WalkerTier } from '../types';

interface PersonalDataViewProps {
  onBack: () => void;
  initialRole?: 'owner' | 'walker';
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const PersonalDataView: React.FC<PersonalDataViewProps> = ({ onBack, initialRole = 'owner' }) => {
  const [activeRole, setActiveRole] = useState<'owner' | 'walker'>(initialRole);
  const [image, setImage] = useState<string | null>(CURRENT_USER.image || null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [basicInfo, setBasicInfo] = useState({
    firstName: CURRENT_USER.firstName,
    lastName: CURRENT_USER.lastName,
    phone: '500 600 700',
  });

  const [ownerProfile, setOwnerProfile] = useState({
    bio: 'Szukam kogoś, kto kocha duże psy i ma doświadczenie z retrieverami.'
  });

  const [walkerProfile, setWalkerProfile] = useState({
    bio: 'Pasjonat psów od dzieciństwa. Chętnie zaopiekuję się Twoim pupilem.',
    experience: 'Expert',
    tier: CURRENT_USER.walkerTier || WalkerTier.Lover
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setImageError('Plik za duży.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full"><ChevronLeft size={24} /></button>
        <h1 className="text-lg font-bold ml-2 text-gray-900">Dane osobowe</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="bg-white p-6 flex flex-col items-center border-b border-gray-100">
          <div className="relative">
            <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-md overflow-hidden bg-gray-100 cursor-pointer">
              {image ? <img src={image} className="w-full h-full object-cover" /> : <User size={40} className="text-gray-400 m-auto h-full" />}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
          <h3 className="mt-3 font-semibold text-gray-900">{basicInfo.firstName} {basicInfo.lastName}</h3>
        </div>

        <div className="p-4 space-y-6">
          <section className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Podstawowe informacje</h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={basicInfo.firstName} onChange={e => setBasicInfo({...basicInfo, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="Imię" />
                <input type="text" value={basicInfo.lastName} onChange={e => setBasicInfo({...basicInfo, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="Nazwisko" />
              </div>
              <input type="tel" value={basicInfo.phone} onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold" placeholder="Telefon" />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moje Profile</h2>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setActiveRole('owner')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeRole === 'owner' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Właściciel</button>
                <button onClick={() => setActiveRole('walker')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeRole === 'walker' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}>Patron</button>
              </div>
            </div>

            {activeRole === 'walker' ? (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-100 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 text-secondary">
                  <Medal size={24} />
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Twoja Ranga Patrona</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <TierCard active={walkerProfile.tier === WalkerTier.Lover} onClick={() => setWalkerProfile({...walkerProfile, tier: WalkerTier.Lover})} label={WalkerTier.Lover} desc="Tylko spacery i zabawa" />
                  <TierCard active={walkerProfile.tier === WalkerTier.Animator} onClick={() => setWalkerProfile({...walkerProfile, tier: WalkerTier.Animator})} label={WalkerTier.Animator} desc="+ Karmienie i Hotel" />
                  <TierCard active={walkerProfile.tier === WalkerTier.Vet} onClick={() => setWalkerProfile({...walkerProfile, tier: WalkerTier.Vet})} label={WalkerTier.Vet} desc="+ Usługi Medyczne" />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Opisz swoje doświadczenie</label>
                  <textarea rows={4} value={walkerProfile.bio} onChange={e => setWalkerProfile({...walkerProfile, bio: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium resize-none focus:ring-2 focus:ring-secondary/20 outline-none" />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 text-primary">
                  <Heart size={24} />
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Twoja biografia właściciela</h3>
                </div>
                <textarea rows={4} value={ownerProfile.bio} onChange={e => setOwnerProfile({bio: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium resize-none focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 max-w-md mx-auto">
        <button onClick={handleSave} className={`w-full py-5 rounded-2xl font-black text-white text-xs uppercase tracking-widest transition-all ${saveStatus === 'success' ? 'bg-accent' : 'bg-gray-900'}`}>
          {saveStatus === 'success' ? 'Profil zaktualizowany' : 'Zapisz zmiany'}
        </button>
      </div>
    </div>
  );
};

const TierCard = ({ active, onClick, label, desc }: { active: boolean, onClick: () => void, label: string, desc: string }) => (
  <button onClick={onClick} className={`w-full p-4 rounded-2xl border text-left transition-all ${active ? 'bg-secondary/5 border-secondary ring-1 ring-secondary/20 shadow-sm' : 'bg-white border-gray-100'}`}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{label}</p>
      {active && <CheckCircle2 size={16} className="text-secondary" />}
    </div>
    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{desc}</p>
  </button>
);
