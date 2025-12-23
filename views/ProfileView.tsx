
import React from 'react';
import { LogOut, Dog, Award, Settings, History, ChevronRight, HelpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CURRENT_USER } from '../services/mockData';

const data = [
  { name: 'Pon', km: 2.5 },
  { name: 'Wt', km: 3.2 },
  { name: 'Śr', km: 1.8 },
  { name: 'Czw', km: 4.5 },
  { name: 'Pt', km: 3.0 },
  { name: 'Sob', km: 6.2 },
  { name: 'Nd', km: 5.1 },
];

interface ProfileViewProps {
  dogsCount: number;
  onNavigate: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ dogsCount, onNavigate }) => {
  return (
    <div className="p-4 flex flex-col gap-6 pb-32">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mój Profil</h1>
        <button 
          onClick={() => onNavigate('gps-settings')}
          className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Ustawienia GPS"
        >
          <Settings size={22} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <img src={CURRENT_USER.image} className="w-20 h-20 rounded-full border-4 border-white shadow-md" alt="Profile" />
        <div>
            <h2 className="text-xl font-bold text-gray-900">{CURRENT_USER.firstName} {CURRENT_USER.lastName}</h2>
            <p className="text-sm text-gray-500">{CURRENT_USER.email}</p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                <Award size={12} />
                <span>Właściciel VIP</span>
            </div>
        </div>
      </div>

      {/* Activity Chart Section */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Dog size={18} className="text-primary" />
                Aktywność
            </h3>
            <button 
                onClick={() => onNavigate('history')}
                className="flex items-center gap-1.5 text-[10px] font-black text-secondary uppercase tracking-widest bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 active:scale-95 transition-all"
            >
                <History size={14} />
                Historia usług
                <ChevronRight size={12} />
            </button>
        </div>
        
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#9ca3af', fontSize: 12}} 
                        dy={10}
                    />
                    <Tooltip 
                        cursor={{fill: '#f3f4f6'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="km" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 5 ? '#f59e0b' : '#cbd5e1'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-6 text-sm">
            <div className="text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Suma km</p>
                <p className="font-black text-gray-900 text-lg">26.3</p>
            </div>
            <div className="text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Spacery</p>
                <p className="font-black text-gray-900 text-lg">7</p>
            </div>
            <div className="text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Śr. ocena</p>
                <p className="font-black text-gray-900 text-lg">5.0</p>
            </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
        <MenuOption label="Dane osobowe" onClick={() => onNavigate('personal-data')} />
        <MenuOption label="Profile psów" count={dogsCount} onClick={() => onNavigate('dog-list')} />
        <MenuOption label="Adresy" onClick={() => onNavigate('address-list')} />
        <MenuOption 
            label="Placówki i Weterynarze" 
            onClick={() => onNavigate('locations-map')} 
        />
        <MenuOption label="Powiadomienia" onClick={() => onNavigate('notifications')} />
        <MenuOption 
          label="Pomoc i Wsparcie" 
          icon={<HelpCircle size={18} className="text-primary" />}
          onClick={() => onNavigate('support')} 
        />
      </div>

      <button className="flex items-center justify-center gap-2 text-red-500 font-bold py-4 hover:bg-red-50 rounded-2xl transition-colors border-2 border-dashed border-red-100 mt-2">
        <LogOut size={18} />
        Wyloguj się
      </button>

    </div>
  );
};

const MenuOption = ({ label, count, icon, onClick }: { label: string, count?: number, icon?: React.ReactNode, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
    >
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {count !== undefined && (
                <span className="bg-orange-50 text-primary text-[10px] font-black px-2 py-0.5 rounded-lg border border-orange-100">{count}</span>
            )}
            <ChevronRight size={16} className="text-gray-300" />
        </div>
    </button>
);
