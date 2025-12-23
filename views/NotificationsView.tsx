
import React from 'react';
import { ChevronLeft, Bell, Calendar, MapPin, Flag, Activity, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { AppNotification, NotificationType } from '../types';
import { PullToRefresh } from '../components/PullToRefresh';

interface NotificationsViewProps {
  notifications: AppNotification[];
  onMarkRead: (id: number) => void;
  onBack: () => void;
  onNavigateToOrder: (orderId: number) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ 
  notifications, 
  onMarkRead, 
  onBack,
  onNavigateToOrder
}) => {

  const handleRefresh = async () => {
    // Simulate data reload
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const getNotificationIcon = (type: NotificationType, activityType?: string) => {
    switch (type) {
      case 'booking_confirmed': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'walk_started': return <MapPin size={20} className="text-sky-500" />;
      case 'walk_finished': return <Flag size={20} className="text-gray-600" />;
      case 'dog_activity': 
        return <span className="text-lg">💩</span>;
      default: return <Info size={20} className="text-primary" />;
    }
  };

  const getNotificationBg = (type: NotificationType) => {
    switch (type) {
      case 'booking_confirmed': return 'bg-emerald-50 border-emerald-100';
      case 'walk_started': return 'bg-sky-50 border-sky-100';
      case 'dog_activity': return 'bg-orange-50 border-orange-100';
      default: return 'bg-white border-gray-100';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-black ml-2 text-gray-900">Powiadomienia</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    onMarkRead(notif.id);
                    if (notif.relatedOrderId) onNavigateToOrder(notif.relatedOrderId);
                  }}
                  className={`p-4 rounded-[24px] border transition-all cursor-pointer relative flex gap-4 ${getNotificationBg(notif.type)} ${!notif.isRead ? 'ring-1 ring-primary/20 shadow-md' : 'opacity-80'}`}
                >
                  {!notif.isRead && (
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                  
                  <div className="shrink-0 w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center">
                    {getNotificationIcon(notif.type, notif.activityType)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-black text-gray-900 pr-4">{notif.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {notif.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{notif.timestamp}</span>
                        {notif.relatedOrderId && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest">
                                Zobacz <ChevronRight size={12} />
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <Bell size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold">Wszystko jasne! Brak nowych powiadomień.</p>
              </div>
            )}

            <div className="pt-8 text-center">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">"Dbamy o Twój Komfort i Komfort Twojego Zwierzaka!"</p>
            </div>
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
};
