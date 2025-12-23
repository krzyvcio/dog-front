
import React from 'react';
import { ChevronLeft, Plus, Edit2, PawPrint, ChevronRight } from 'lucide-react';
import { Dog } from '../types';
import { PullToRefresh } from '../components/PullToRefresh';

interface DogListViewProps {
  dogs: Dog[];
  onBack: () => void;
  onEditDog: (dog: Dog) => void;
  onAddNew: () => void;
}

export const DogListView: React.FC<DogListViewProps> = ({ dogs, onBack, onEditDog, onAddNew }) => {
  const handleRefresh = async () => {
    // Simulate data reload
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold ml-2 text-gray-900">Profile moich psów</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="p-4 space-y-4">
            {dogs.length > 0 ? (
              dogs.map(dog => (
                <div 
                  key={dog.id} 
                  onClick={() => onEditDog(dog)}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-100 shrink-0">
                    <img src={dog.image} alt={dog.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{dog.name}</h3>
                    <p className="text-xs text-gray-500">{dog.breed}</p>
                    <div className="flex items-center gap-1 mt-1">
                       <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                        {dog.age} {dog.age === 1 ? 'rok' : (dog.age < 5 ? 'lata' : 'lat')}
                       </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-orange-50 group-hover:text-primary transition-colors">
                    <Edit2 size={18} />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-300">
                  <PawPrint size={48} />
                </div>
                <h3 className="font-bold text-gray-900">Brak dodanych psów</h3>
                <p className="text-sm text-gray-500 mt-1 px-10">Dodaj swojego pierwszego pupila, aby móc korzystać z usług opiekunów.</p>
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>

      {/* Footer Add Button */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button 
          onClick={onAddNew}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Dodaj kolejnego psa
        </button>
      </div>
    </div>
  );
};
