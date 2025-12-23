
import React from 'react';
import { ChevronLeft, Mail, Phone, ExternalLink, HelpCircle, ShieldCheck, ChevronRight, MessageSquare, Info } from 'lucide-react';

interface SupportViewProps {
  onBack: () => void;
  onNavigateTerms: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onBack, onNavigateTerms }) => {
  const faqs = [
    {
      q: "Jak działają płatności?",
      a: "DogGo to platforma łącząca miłośników psów. Rozliczenia odbywają się bezpośrednio między właścicielem a opiekunem. Rekomendujemy bezpieczne płatności BLIK na telefon lub gotówkę po zakończeniu spaceru."
    },
    {
      q: "Czy moi psi patroni są zweryfikowani?",
      a: "Tak, każdy opiekun przechodzi proces weryfikacji tożsamości. Szukaj profilów z zieloną ikoną tarczy, aby mieć pewność najwyższego standardu bezpieczeństwa."
    },
    {
      q: "Co jeśli pies ucieknie?",
      a: "Dzięki funkcji Live Tracking GPS w DogGo, widzisz pozycję swojego psa na mapie w czasie rzeczywistym. W razie problemów opiekun ma przycisk alarmowy do kontaktu z Tobą."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-black ml-2 text-gray-900">Pomoc i Wsparcie</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Contact Cards */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 bg-orange-50 text-primary rounded-xl flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Napisz do nas</p>
              <p className="text-xs font-bold text-gray-900 mt-1">pomoc@doggo.pl</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="w-10 h-10 bg-sky-50 text-secondary rounded-xl flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zadzwoń</p>
              <p className="text-xs font-bold text-gray-900 mt-1">+48 500 600 700</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Częste pytania</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 mb-2 flex items-start gap-2">
                    <MessageSquare size={16} className="text-primary mt-0.5 shrink-0" />
                    {faq.q}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Banner */}
        <div className="bg-gray-900 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={100} />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Gwarancja DogGo</span>
                </div>
                <h3 className="text-lg font-black leading-tight">Zawsze bezpieczne spacery</h3>
                <p className="text-xs text-gray-400 font-medium">Każde zlecenie jest ubezpieczone, a trasa monitorowana przez nasz zespół wsparcia.</p>
            </div>
        </div>

        {/* Terms Link */}
        <button 
          onClick={onNavigateTerms}
          className="w-full bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center justify-between group active:scale-98 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Info size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-gray-900">Regulamin aplikacji</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Zasady korzystania z DogGo</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>

        <div className="py-6 text-center">
            <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.3em]">Wersja aplikacji 1.2.4 (beta)</p>
        </div>
      </div>
    </div>
  );
};
