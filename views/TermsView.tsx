
import React from 'react';
import { ChevronLeft, FileText, CheckCircle2, AlertCircle, Coins, CreditCard } from 'lucide-react';

interface TermsViewProps {
  onBack: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100 sticky top-0 z-20 bg-white">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-black ml-2 text-gray-900">Regulamin</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="flex flex-col items-center text-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-gray-400 border border-gray-100">
                <FileText size={32} />
            </div>
            <div>
                <h2 className="text-xl font-black text-gray-900">Zasady korzystania</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Ostatnia aktualizacja: 20.05.2024</p>
            </div>
        </div>

        {/* IMPORTANT: Payment Rules Section */}
        <section className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 text-primary">
                <Coins size={24} />
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Kluczowe: Płatności</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                DogGo jest platformą społecznościową ułatwiającą nawiązywanie kontaktów. 
                <span className="text-primary font-black ml-1">Nie pośredniczymy finansowo w transakcjach.</span>
            </p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    ZALECANE: PRZELEW BLIK NA TELEFON
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-900">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    DOZWOLONE: GOTÓWKA (PO USŁUDZE)
                </div>
            </div>
            <p className="text-[10px] text-gray-500 italic mt-2">
                * Kwota sugerowana w aplikacji jest bazą do porozumienia. Finalną kwotę ustalasz bezpośrednio z opiekunem na czacie.
            </p>
        </section>

        <section className="space-y-6">
            <div className="space-y-3">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-l-4 border-primary pl-3">§1. Postanowienia ogólne</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    1. Aplikacja DogGo służy do łączenia właścicieli psów z zaufanymi opiekunami (Patronami).<br/>
                    2. Korzystanie z aplikacji wymaga pełnej weryfikacji profilu oraz akceptacji śledzenia GPS na czas trwania usługi.
                </p>
            </div>

            <div className="space-y-3">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-l-4 border-secondary pl-3">§2. Obowiązki Właściciela</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    1. Właściciel zobowiązany jest do podania prawdziwych informacji o temperamencie i zdrowiu psa.<br/>
                    2. Pies przekazany pod opiekę musi posiadać aktualne szczepienia przeciwko wściekliźnie.
                </p>
            </div>

            <div className="space-y-3">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] border-l-4 border-accent pl-3">§3. Odpowiedzialność</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    1. Patron ponosi pełną odpowiedzialność za psa w trakcie trwania aktywnego spaceru zarejestrowanego w systemie.<br/>
                    2. Wszelkie incydenty muszą być niezwłocznie zgłaszane poprzez funkcję czatu lub przycisk alarmowy.
                </p>
            </div>
        </section>

        <div className="bg-gray-50 p-5 rounded-2xl flex items-start gap-3">
            <AlertCircle size={20} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-400 font-medium leading-tight italic">
                Pamiętaj: DogGo nie odpowiada za spory finansowe wynikające z braku terminowych płatności między użytkownikami. Zawsze sprawdzaj oceny i opinie przed wyborem opiekuna.
            </p>
        </div>

        <div className="py-8 text-center">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">© 2024 DogGo Technologies Sp. z o.o.</p>
        </div>
      </div>
    </div>
  );
};
