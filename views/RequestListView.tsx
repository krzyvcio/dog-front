
import React from 'react';
import { ChevronLeft, Trash2, Calendar, MapPin, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { DogWalkRequest, ServiceType } from '../types';
import { PullToRefresh } from '../components/PullToRefresh';

interface RequestListViewProps {
  requests: DogWalkRequest[];
  onBack: () => void;
  onDelete: (id: number) => void;
  onAddNew: () => void;
}

export const RequestListView: React.FC<RequestListViewProps> = ({ requests, onBack, onDelete, onAddNew }) => {
  const handleRefresh = async () => {
    // Simulate data reload
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <h1 className="text-lg font-bold ml-2 text-gray-900">Moje Ogłoszenia</h1>
        </div>
        <button onClick={onAddNew} className="p-2 bg-sky-50 text-secondary rounded-full hover:bg-sky-100"><Plus size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-4 pb-20">
            {requests.length > 0 ? (
              requests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3 group animate-in slide-in-from-right duration-300">
                   <div className="flex gap-4">
                      <img src={req.dog.image} className="w-16 h-16 rounded-2xl object-cover" alt={req.dog.name} />
                      <div className="flex-1">
                         <div className="flex justify-between items-start">
                            <h3 className="font-black text-gray-900 leading-tight">{req.dog.name}</h3>
                            <span className="font-black text-primary">{req.price} zł</span>
                         </div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            {req.serviceTypes.join(' & ')}
                         </p>
                      </div>
                   </div>
                   
                   <div className="h-px bg-gray-50" />
                   
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                            <Calendar size={14} className="text-primary" /> {req.date}, {req.timeSlot}
                         </div>
                         <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                            <MapPin size={14} className="text-secondary" /> {req.locationLabel}
                         </div>
                      </div>
                      <button 
                        onClick={() => { if(confirm("Usunąć to ogłoszenie?")) onDelete(req.id); }}
                        className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-all"
                      >
                         <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <FileText size={64} className="text-gray-300 mb-4" />
                <p className="text-sm font-bold text-gray-500">Brak aktywnych ogłoszeń</p>
                <button onClick={onAddNew} className="mt-4 text-xs font-black text-secondary uppercase tracking-widest border-b-2 border-secondary pb-1">Dodaj pierwsze ogłoszenie</button>
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
};
