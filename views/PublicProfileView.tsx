import React, { useState } from 'react';
import { ChevronLeft, Mail, Phone, Smartphone, CheckCircle2, Star, MessageCircle, Copy, Check } from 'lucide-react';
import { DogWalkerProfile, User } from '../types';

interface PublicProfileViewProps {
  walker: DogWalkerProfile;
  onBack: () => void;
  onOpenChat?: (user: User) => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({ walker, onBack, onOpenChat }) => {
  const [copied, setCopied] = useState(false);
  
  // Mock phone number
  const phoneNumber = "500 600 700";

  const handleCopyBlik = () => {
    navigator.clipboard.writeText(phoneNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Dynamic Header Background */}
      <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-800 relative shrink-0">
        <button 
          onClick={onBack} 
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-10">
          <div className="relative">
            <img 
              src={walker.user.image} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-2xl" 
              alt={walker.user.firstName} 
            />
            {walker.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-accent text-white p-1.5 rounded-full border-4 border-white shadow-lg">
                <CheckCircle2 size={18} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 pt-20 px-4 pb-24 overflow-y-auto">
        {/* Identity Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900">{walker.user.firstName} {walker.user.lastName}</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Psie Patronat • {walker.experience}</p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={16} fill="currentColor" />
                <span>{walker.rating}</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Ocena</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-gray-900">{walker.reviewsCount}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Opinii</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-gray-900">{walker.hourlyRate} zł</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Stawka</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">O mnie</h2>
          <p className="text-sm text-gray-600 leading-relaxed italic">
            "{walker.bio}"
          </p>
        </section>

        {/* Contact & BLIK Card */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Kontakt i Rozliczenia</h2>
          
          <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Smartphone size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                  <Smartphone className="text-accent" size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Telefon do BLIK</p>
                  <p className="text-xl font-black tracking-widest">{phoneNumber}</p>
                </div>
                <button 
                  onClick={handleCopyBlik}
                  className="ml-auto p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  {copied ? <Check size={20} className="text-accent" /> : <Copy size={20} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="bg-white text-gray-900 py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
                >
                  <Phone size={14} />
                  Zadzwoń
                </a>
                <button 
                  onClick={() => onOpenChat?.(walker.user)}
                  className="bg-gray-800 text-white py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-700 transition-all active:scale-95"
                >
                  <MessageCircle size={14} />
                  Czat
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 p-2.5 rounded-xl text-primary">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Email</p>
              <p className="text-sm font-bold text-gray-800">{walker.user.email}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 max-w-md mx-auto z-30">
        <button 
          onClick={onBack}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all active:scale-[0.98]"
        >
          Powrót do konfiguracji
        </button>
      </div>
    </div>
  );
};