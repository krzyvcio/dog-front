import React from 'react';
import { CreditCard, Plus, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { CURRENT_USER } from '../services/mockData';

export const WalletView: React.FC = () => {
  return (
    <div className="p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Portfel</h1>
      
      {/* Balance Card */}
      <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-700 rounded-full opacity-50 blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-gray-400 text-sm font-medium mb-1">Dostępne środki</p>
          <div className="text-4xl font-bold mb-6">{CURRENT_USER.walletBalance.toFixed(2)} zł</div>
          
          <div className="flex gap-3">
            <button className="flex-1 bg-white text-gray-900 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100">
              <Plus size={16} />
              Doładuj
            </button>
            <button className="flex-1 bg-gray-800 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-gray-700 hover:bg-gray-700">
              <CreditCard size={16} />
              Karty
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <History size={20} className="text-gray-400" />
                Ostatnie transakcje
            </h2>
            <button className="text-xs text-secondary font-medium">Zobacz wszystkie</button>
        </div>

        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                            <ArrowUpRight size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Spacer z Markiem</p>
                            <p className="text-xs text-gray-400">12 Paź, 14:30 • BLIK</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-900">-50.00 zł</span>
                </div>
            ))}
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <ArrowDownLeft size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">Doładowanie</p>
                        <p className="text-xs text-gray-400">10 Paź, 09:15 • Karta *4242</p>
                    </div>
                </div>
                <span className="font-bold text-green-600">+200.00 zł</span>
            </div>
        </div>
      </div>
    </div>
  );
};