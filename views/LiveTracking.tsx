
import React, { useEffect, useState, useMemo } from 'react';
import { Phone, MessageCircle, MapPin, Navigation, ChevronLeft, Clock, Calendar, CheckCircle2, Stethoscope, Home as HomeIcon, Heart, Edit3, Save, AlertCircle, Play, Plus, Minus, Maximize2, Trash2, MoreHorizontal, Activity, Bell, Flag } from 'lucide-react';
import { Order, ServiceType, User, WalkActivity } from '../types';

interface LiveTrackingProps {
  order: Order;
  gpsInterval?: number;
  userPos: { lat: number, lng: number };
  onUpdateUserPos: (pos: { lat: number, lng: number }) => void;
  onBack: () => void;
  onOpenChat?: (user: User) => void;
  onStartService?: () => void;
}

export const LiveTracking: React.FC<LiveTrackingProps> = ({ 
  order: initialOrder, 
  gpsInterval = 10, 
  userPos, 
  onUpdateUserPos, 
  onBack, 
  onOpenChat, 
  onStartService 
}) => {
  const [order, setOrder] = useState(initialOrder);
  const [elapsedTime, setElapsedTime] = useState(order.elapsedTime || 0);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  
  const [activities, setActivities] = useState<WalkActivity[]>(initialOrder.activities || [
    { id: 1, type: 'start', timestamp: '12:30', label: 'Rozpoczęto spacer' }
  ]);

  // Centering tied to the shared userPos state
  const centerLat = userPos.lat;
  const centerLng = userPos.lng;

  const currentKm = useMemo(() => {
    return (order.currentDistance || 0 + (elapsedTime / 800)).toFixed(2);
  }, [order.currentDistance, elapsedTime]);

  const mapUrl = useMemo(() => {
    const offset = 0.05 / Math.pow(2, zoomLevel - 12);
    const bbox = `${centerLng - offset},${centerLat - offset},${centerLng + offset},${centerLat + offset}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat},${centerLng}`;
  }, [zoomLevel, centerLat, centerLng]);

  // Timer effect for elapsed time
  useEffect(() => {
    if (order.status !== 'InProgress') return;
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [order.status]);

  // Simulation: Location movement and Map Centering logic based strictly on GPS interval from settings
  useEffect(() => {
    if (order.status !== 'InProgress') return;
    
    const intervalMs = gpsInterval * 1000;
    
    const locTimer = setInterval(() => {
      onUpdateUserPos({
        lat: userPos.lat + (Math.random() - 0.45) * 0.0003,
        lng: userPos.lng + (Math.random() - 0.4) * 0.0003
      });
      // Updating userPos via props triggers mapUrl re-calculation and iframe re-render (centering)
    }, intervalMs);
    
    return () => clearInterval(locTimer);
  }, [order.status, gpsInterval, userPos.lat, userPos.lng]);

  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  const addActivity = (type: WalkActivity['type'], label: string) => {
    const newActivity: WalkActivity = {
      id: Date.now(),
      type,
      label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivities([newActivity, ...activities]);
    setShowActivityMenu(false);
    setIsSheetExpanded(true); 
  };

  const getActivityIcon = (type: WalkActivity['type']) => {
    switch (type) {
      case 'poop': return '💩';
      case 'play': return '🎾';
      case 'sniff': return '🐕';
      case 'start': return '🚀';
      default: return '📍';
    }
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return <MapPin size={24} />;
      case ServiceType.Stay: return <HomeIcon size={24} />;
      case ServiceType.VeterinaryCare: return <Stethoscope size={24} />;
      default: return <Heart size={24} />;
    }
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case ServiceType.Walk: return 'Spacer';
      case ServiceType.Stay: return 'Opieka stacjonarna';
      case ServiceType.VeterinaryCare: return 'Pomoc medyczna';
      default: return 'Usługa';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (order.status === 'InProgress') {
    return (
      <div className="flex flex-col h-[calc(100vh-80px)] relative bg-gray-100 animate-in fade-in duration-500 overflow-hidden">
        
        {/* Resized Frosted Glass Stats Pill */}
        <div className={`absolute top-6 right-6 w-[65%] z-40 transition-all duration-500 ${isSheetExpanded ? 'opacity-0 -translate-y-10 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
          <div className="bg-white/40 backdrop-blur-xl rounded-[24px] px-6 py-2.5 shadow-xl border border-white/40 flex items-center justify-between text-gray-900">
              <div className="flex-1 flex flex-col">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Czas trwania</p>
                  <div className="text-xl font-black tabular-nums tracking-tighter leading-tight">{formatTime(elapsedTime)}</div>
              </div>
              <div className="h-8 w-px bg-gray-900/10 mx-6"></div>
              <div className="flex-1 flex flex-col items-end">
                  <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Dystans</p>
                  <div className="text-xl font-black tabular-nums tracking-tighter leading-tight">
                      {currentKm} <span className="text-[10px] text-primary ml-0.5 uppercase">km</span>
                  </div>
              </div>
          </div>
        </div>

        {/* Live Map Layer */}
        <div className="absolute inset-0 z-0 bg-gray-200">
          <iframe 
            key={mapUrl}
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            src={mapUrl}
            style={{ filter: 'grayscale(0.1) brightness(1.05)', transition: 'all 0.5s ease' }}
          />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-full animate-ping scale-[2]"></div>
                  <div className="w-14 h-14 bg-white rounded-2xl border-[3px] border-secondary shadow-xl overflow-hidden p-0.5 relative z-10">
                      <img src={order.dog.image} className="w-full h-full rounded-xl object-cover" alt="dog" />
                  </div>
              </div>
          </div>
        </div>

        {/* SLIDE UP BOTTOM SHEET */}
        <div 
          className={`absolute bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-20px_100px_rgba(0,0,0,0.1)] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSheetExpanded ? 'h-[75vh] rounded-t-[50px]' : 'h-[145px] rounded-t-[40px]'}`}
        >
          <div 
            onClick={() => setIsSheetExpanded(!isSheetExpanded)}
            className="w-full pt-4 pb-5 flex justify-center cursor-pointer"
          >
            <div className="w-14 h-1.5 bg-gray-200 rounded-full"></div>
          </div>

          <div className="px-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="relative shrink-0" onClick={() => setIsSheetExpanded(!isSheetExpanded)}>
                    <img src={order.walker.user.image} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" alt="Walker" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent border-[2.5px] border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0" onClick={() => setIsSheetExpanded(!isSheetExpanded)}>
                    <h3 className="font-black text-gray-900 text-lg leading-none mb-1 truncate">{order.walker.user.firstName}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Activity size={10} className="text-primary" /> AKTYWNY: {getServiceLabel(order.serviceType).toUpperCase()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button 
                            onClick={() => setShowActivityMenu(!showActivityMenu)} 
                            className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all active:scale-90 shadow-sm ${showActivityMenu ? 'bg-orange-600' : 'bg-primary'} text-white`}
                        >
                            <Plus size={28} strokeWidth={2.5} />
                        </button>
                        {showActivityMenu && (
                            <div className="absolute bottom-full right-0 mb-5 flex flex-col gap-3 animate-in slide-in-from-bottom-4 zoom-in duration-300 z-[60]">
                                <ActivityButton icon="💩" label="Kupa" onClick={() => addActivity('poop', 'Zrobiono kupę')} color="bg-orange-50 text-orange-600" />
                                <ActivityButton icon="🎾" label="Zabawa" onClick={() => addActivity('play', 'Zabawa w miejscu')} color="bg-blue-50 text-blue-600" />
                                <ActivityButton icon="🐕" label="Obwąchiwanie" onClick={() => addActivity('sniff', 'Obwąchiwanie kolegów')} color="bg-emerald-50 text-emerald-600" />
                            </div>
                        )}
                    </div>
                    <button onClick={() => onOpenChat?.(order.walker.user)} className="w-14 h-14 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl text-gray-800 active:scale-90 transition-all">
                        <MessageCircle size={24} />
                    </button>
                    <a href="tel:500600700" className="w-14 h-14 flex items-center justify-center bg-secondary/10 border border-secondary/10 rounded-2xl text-secondary active:scale-90 transition-all">
                        <Phone size={24} />
                    </a>
                </div>
            </div>

            {isSheetExpanded && (
                <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Raport spaceru</h4>
                        <div className="bg-primary/10 px-4 py-1.5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">
                           {activities.length} aktywności
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar pb-32">
                        {activities.map((act, idx) => (
                            <div key={act.id} className="flex gap-5 items-start relative group">
                                {idx !== activities.length - 1 && (
                                    <div className="absolute left-[27px] top-12 bottom-[-32px] w-0.5 bg-gray-100"></div>
                                )}
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-inner border border-white shrink-0">
                                    {getActivityIcon(act.type)}
                                </div>
                                <div className="flex-1 pt-1.5 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <p className="font-black text-gray-900 text-sm truncate pr-2">{act.label}</p>
                                        <span className="text-[10px] font-black text-gray-300 tabular-nums uppercase tracking-widest shrink-0">{act.timestamp}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide truncate">Rzeszów, ul. Dąbrowskiego</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-8 left-6 right-6">
                        <button 
                            onClick={() => setShowFinishModal(true)}
                            className="w-full bg-[#1e2329] text-white font-black py-5 rounded-[28px] text-[11px] uppercase tracking-[0.25em] shadow-2xl active:scale-95 transition-all"
                        >
                            Zakończ i rozlicz usługę
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>

        {showFinishModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowFinishModal(false)}></div>
                <div className="bg-white w-full max-w-[340px] rounded-[48px] p-8 relative z-10 text-center shadow-2xl animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center text-emerald-500 mx-auto mb-6">
                        <Flag size={32} />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-2 leading-tight">Zakończyć spacer?</h2>
                    <p className="text-sm text-gray-500 mb-8 font-medium">Potwierdź zakończenie usługi i przejdź do rozliczenia z Patronem.</p>
                    <div className="bg-gray-50 rounded-[32px] p-5 mb-8 flex justify-between">
                        <div className="text-center flex-1 border-r border-gray-100">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Dystans</p>
                            <p className="font-black text-gray-900 text-lg">{currentKm} km</p>
                        </div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Czas</p>
                            <p className="font-black text-gray-900 text-lg">{formatTime(elapsedTime)}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button onClick={() => onBack()} className="w-full bg-primary text-white font-black py-4 rounded-[24px] shadow-lg text-xs uppercase tracking-widest active:scale-95 transition-all">
                            Potwierdź i Rozlicz
                        </button>
                        <button onClick={() => setShowFinishModal(false)} className="w-full bg-gray-100 text-gray-600 font-black py-4 rounded-[24px] text-xs uppercase tracking-widest active:scale-95 transition-all">
                            Wróć do spaceru
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-white sticky top-0 z-50">
            <div className="flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
                <div className="ml-2">
                    <h1 className="text-lg font-black text-gray-900 leading-tight">Zaplanowane spotkanie</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Status: Oczekiwanie</p>
                </div>
            </div>
            <button className="flex items-center gap-1.5 text-primary font-black text-[10px] uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 active:scale-95 transition-all">
                <Edit3 size={14} /> Edytuj
            </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-36">
            <div className="h-72 relative bg-gray-100 group">
                 <div className="absolute inset-0 opacity-90 transition-all group-hover:opacity-100">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        src={mapUrl}
                        style={{ filter: 'grayscale(0.4) opacity(0.8)' }}
                    ></iframe>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white"></div>
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-white rounded-[24px] shadow-2xl flex items-center justify-center text-gray-900 mb-6 animate-bounce ring-8 ring-white/50">
                        {getServiceIcon(order.serviceType)}
                    </div>
                    <div className="animate-in slide-in-from-bottom duration-500">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Zaczynamy za około</h2>
                        <div className="text-5xl font-black mb-6 text-gray-900 tracking-tighter tabular-nums">2h 15m</div>
                        <div className="inline-flex items-center gap-3 bg-gray-900 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                            <Calendar size={14} className="text-primary" />
                            {order.date}, {order.startTime}
                        </div>
                    </div>
                 </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="flex items-center gap-5">
                    <div className="flex -space-x-6">
                        <img src={order.dog.image} className="w-20 h-20 rounded-[28px] object-cover border-4 border-white shadow-2xl relative z-20" alt="Pies" />
                        <img src={order.walker.user.image} className="w-20 h-20 rounded-[28px] object-cover border-4 border-white shadow-2xl relative z-10" alt="Patron" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-black text-gray-900 text-xl leading-tight">{getServiceLabel(order.serviceType)}</h3>
                        <p className="text-sm text-gray-500 font-bold mt-1">{order.dog.name} & Patron {order.walker.user.firstName}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-gray-50 p-5 rounded-[32px] flex items-center gap-5 border border-gray-100">
                        <div className="bg-white p-4 rounded-[20px] text-primary shadow-lg border border-gray-50"><MapPin size={24} /></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Miejsce odbioru</p>
                            <p className="text-md font-black text-gray-800">ul. 3 Maja, Rzeszów</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">Trasa: Paderewskiego → Dąbrowskiego → Kmity</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex flex-col gap-3 max-w-md mx-auto w-full z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="space-y-4">
                <button 
                    onClick={onStartService}
                    className="w-full bg-primary text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl text-sm uppercase tracking-[0.2em]"
                >
                    <Play size={24} fill="currentColor" />
                    Zacznij już teraz
                </button>
                <div className="flex gap-3">
                    <button onClick={() => onOpenChat?.(order.walker.user)} className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs uppercase tracking-widest border-b-4 border-black">
                        <MessageCircle size={18} /> Czatuj
                    </button>
                    <a href="tel:500600700" className="p-4 bg-gray-50 text-gray-800 rounded-2xl active:scale-90 transition-all border border-gray-100 shadow-sm">
                        <Phone size={24} />
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

const ActivityButton = ({ icon, label, onClick, color }: { icon: string, label: string, onClick: () => void, color: string }) => (
    <button onClick={onClick} className="flex items-center gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-[22px] shadow-2xl border border-white/50 hover:bg-white active:scale-95 transition-all min-w-[160px] group">
        <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-[10px] font-black text-gray-800 uppercase tracking-[0.1em]">{label}</span>
    </button>
);
