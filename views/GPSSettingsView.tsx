
import React, { useState } from 'react';
import { ChevronLeft, MapPin, Zap, Battery, RefreshCw, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { GPSSettings } from '../App';

interface GPSSettingsViewProps {
  settings: GPSSettings;
  onUpdate: (settings: GPSSettings) => void;
  onLocationUpdate: (pos: { lat: number, lng: number }) => void;
  onBack: () => void;
}

export const GPSSettingsView: React.FC<GPSSettingsViewProps> = ({ settings, onUpdate, onLocationUpdate, onBack }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [accuracyInfo, setAccuracyInfo] = useState<{ accuracy: number | null, status: 'idle' | 'searching' | 'ok' | 'error' }>({
    accuracy: null,
    status: 'idle'
  });

  // Native GPS Test using Browser Geolocation API
  const runGpsTest = () => {
    if (!navigator.geolocation) {
      alert("Twoja przeglądarka nie obsługuje geolokalizacji.");
      return;
    }

    setIsTesting(true);
    setAccuracyInfo({ accuracy: null, status: 'searching' });
    
    const options = {
      enableHighAccuracy: settings.highAccuracy,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const meters = Math.round(position.coords.accuracy);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Update global position state to move the user on the map
        onLocationUpdate({ lat, lng });
        
        setAccuracyInfo({ accuracy: meters, status: 'ok' });
        setIsTesting(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        setAccuracyInfo({ accuracy: null, status: 'error' });
        setIsTesting(false);
        
        let msg = "Wystąpił błąd podczas próby uzyskania lokalizacji.";
        if (error.code === 1) msg = "Brak uprawnień. Proszę zezwól aplikacji na dostęp do lokalizacji w ustawieniach przeglądarki/systemu.";
        alert(msg);
      },
      options
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2 text-gray-900">Ustawienia GPS</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Sygnał urządzenia
            </h2>
            <span className={`px-2 py-1 rounded-full text-[10px] font-black ${accuracyInfo.status === 'ok' ? 'bg-green-100 text-green-700' : accuracyInfo.status === 'searching' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
              {accuracyInfo.status === 'ok' ? 'GOTOWY' : accuracyInfo.status === 'searching' ? 'SZUKAM...' : 'NIEAKTYWNY'}
            </span>
          </div>

          {accuracyInfo.status === 'ok' ? (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={22} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-green-800">Lokalizacja zaktualizowana</p>
                <p className="text-xs text-green-600 mt-0.5">
                  Dokładność: <span className="font-black">~{accuracyInfo.accuracy}m</span>. 
                  Zmieniono pozycję na mapie śledzenia.
                </p>
                <button 
                   onClick={runGpsTest}
                   className="mt-3 text-[10px] font-black uppercase text-green-700 underline"
                >
                   Odśwież test
                </button>
              </div>
            </div>
          ) : accuracyInfo.status === 'error' ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in zoom-in duration-300">
                <AlertCircle size={22} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-red-800">Błąd lokalizacji</p>
                  <p className="text-xs text-red-600 mt-0.5">Aplikacja nie otrzymała dostępu do GPS. Sprawdź uprawnienia systemowe.</p>
                  <button 
                    onClick={runGpsTest}
                    className="mt-3 bg-red-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
            </div>
          ) : (
            <button 
              onClick={runGpsTest}
              disabled={isTesting}
              className="w-full bg-gray-900 text-white py-4 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Pobieranie danych...
                </>
              ) : (
                'Testuj natywny GPS'
              )}
            </button>
          )}
        </div>

        <section className="space-y-4">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Parametry Śledzenia</h2>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            <div className="p-5 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-orange-50 rounded-2xl text-primary"><Zap size={22} /></div>
                <div>
                  <p className="text-sm font-black text-gray-900">Wysoka precyzja</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Częstsze aktualizacje pozycji</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdate({...settings, highAccuracy: !settings.highAccuracy})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.highAccuracy ? 'bg-primary' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.highAccuracy ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-5 flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-50 rounded-2xl text-accent"><Battery size={22} /></div>
                <div>
                  <p className="text-sm font-black text-gray-900">Oszczędzanie energii</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Zmniejsza zużycie baterii</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdate({...settings, batterySaving: !settings.batterySaving})}
                className={`w-12 h-6 rounded-full transition-colors relative ${settings.batterySaving ? 'bg-accent' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.batterySaving ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-gray-900">Interwał odświeżania</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Częstotliwość centrowania mapy</p>
                </div>
                <span className="text-sm font-black text-primary bg-orange-50 px-3 py-1 rounded-xl border border-orange-100">{settings.interval}s</span>
              </div>
              <input 
                type="range"
                min="5"
                max="60"
                step="5"
                value={settings.interval}
                onChange={(e) => onUpdate({...settings, interval: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] font-black text-gray-300 uppercase tracking-widest px-1">
                <span>Ekstremalnie</span>
                <span>Oszczędnie</span>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-amber-50 rounded-[32px] p-5 border border-amber-100 space-y-3">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertTriangle size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Ważne informacje</h3>
          </div>
          <p className="text-[10px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
            Dla poprawnego śledzenia spaceru przez Patrona, aplikacja wymaga uprawnień do lokalizacji "Zawsze". 
            To pozwala na podgląd trasy na żywo nawet gdy telefon jest w kieszeni.
          </p>
        </div>

        <div className="flex items-start gap-3 p-2 text-gray-400 mb-8">
          <Info size={16} className="shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium leading-tight">
            Wszystkie dane GPS są udostępniane wyłącznie właścicielowi psa na czas trwania aktywnego zlecenia. 
            Twoja prywatność jest naszym priorytetem.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-20">
        <button onClick={onBack} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">
          Zapisz i powróć
        </button>
      </div>
    </div>
  );
};
