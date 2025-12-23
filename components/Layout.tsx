
import React from 'react';
import { Home, Map, User, Search, Bell } from 'lucide-react';

interface LayoutProps {
  // Use React.ReactNode instead of React.Node for children type in TypeScript
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="bg-primary rounded-lg p-1.5 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/><path d="M4.42 11.247A4.335 4.335 0 0 1 6.944 6.77c3.21-.94 5.442.475 6.556 2.96 1.114-2.485 3.346-3.9 6.556-2.96a4.335 4.335 0 0 1 2.524 4.478l-.197 1.577c-.57 4.56-3.237 8.163-7.583 11.034a4.43 4.43 0 0 1-4.598 0c-4.346-2.87-7.013-6.474-7.583-11.034l-.197-1.577Z"/></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">DogGo</span>
          </div>
          <button 
            onClick={() => onTabChange('notifications')}
            className={`relative p-2 rounded-full transition-colors ${activeTab === 'notifications' ? 'bg-orange-50 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full pb-20 overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => onTabChange('home')} 
            icon={<Home size={22} />} 
            label="Start" 
          />
          <NavButton 
            active={activeTab === 'search'} 
            onClick={() => onTabChange('search')} 
            icon={<Search size={22} />} 
            label="Szukaj" 
          />
          <div className="relative -top-5">
            <button 
              onClick={() => onTabChange('live')}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 ${activeTab === 'live' ? 'bg-primary ring-4 ring-orange-100' : 'bg-gray-900'}`}
            >
              <Map size={24} />
            </button>
          </div>
          <NavButton 
            active={activeTab === 'profile'} 
            onClick={() => onTabChange('profile')} 
            icon={<User size={22} />} 
            label="Profil" 
          />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <div className="mb-1">{icon}</div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
