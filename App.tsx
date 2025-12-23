
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { LiveTracking } from './views/LiveTracking';
import { ProfileView } from './views/ProfileView';
import { AddDog } from './views/AddDog';
import { PersonalDataView } from './views/PersonalDataView';
import { GPSSettingsView } from './views/GPSSettingsView';
import { DogListView } from './views/DogListView';
import { EditDogView } from './views/EditDogView';
import { AddressListView } from './views/AddressListView';
import { AddressEditView } from './views/AddressEditView';
import { BookingView } from './views/BookingView';
import { PublicProfileView } from './views/PublicProfileView';
import { ChatView } from './views/ChatView';
import { HistoryView } from './views/HistoryView';
import { NotificationsView } from './views/NotificationsView';
import { LocationsMapView } from './views/LocationsMapView';
import { SupportView } from './views/SupportView';
import { TermsView } from './views/TermsView';
import { AddRequestView } from './views/AddRequestView';
import { RequestListView } from './views/RequestListView';
import { MY_DOGS, MY_ADDRESSES, INITIAL_ORDERS, MOCK_NOTIFICATIONS, WALKERS, CURRENT_USER, MY_REQUESTS } from './services/mockData';
import { Dog, Address, DogWalkerProfile, Order, ServiceType, User, AppNotification, DogWalkRequest } from './types';

export interface GPSSettings {
  highAccuracy: boolean;
  backgroundTracking: boolean;
  interval: number;
  batterySaving: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchInitialMode, setSearchInitialMode] = useState<'find-walker' | 'find-dog'>('find-walker');
  const [personalDataInitialRole, setPersonalDataInitialRole] = useState<'owner' | 'walker'>('owner');
  
  const [dogs, setDogs] = useState<Dog[]>(MY_DOGS);
  const [addresses, setAddresses] = useState<Address[]>(MY_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [requests, setRequests] = useState<DogWalkRequest[]>(MY_REQUESTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(INITIAL_ORDERS[0].id);
  
  const [gpsSettings, setGpsSettings] = useState<GPSSettings>({
    highAccuracy: true,
    backgroundTracking: true,
    interval: 10,
    batterySaving: false
  });

  const [userPos, setUserPos] = useState({ lat: 50.0411, lng: 21.9991 });
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [bookingWalker, setBookingWalker] = useState<DogWalkerProfile | null>(null);
  const [viewingProfile, setViewingProfile] = useState<DogWalkerProfile | null>(null);
  const [chatPartner, setChatPartner] = useState<User | null>(null);

  const handleAddDog = (newDogData: Omit<Dog, 'id'>) => {
    const newDog: Dog = { ...newDogData, id: Date.now() };
    setDogs([...dogs, newDog]);
    setActiveTab('dog-list');
  };

  const handleUpdateDog = (updatedDog: Dog) => {
    setDogs(dogs.map(d => d.id === updatedDog.id ? updatedDog : d));
    setActiveTab('dog-list');
    setSelectedDog(null);
  };

  const handleDeleteDog = (id: number) => {
    setDogs(dogs.filter(d => d.id !== id));
    setActiveTab('dog-list');
    setSelectedDog(null);
  };

  const handleAddRequest = (newRequestData: Omit<DogWalkRequest, 'id' | 'status'>) => {
    const newRequest: DogWalkRequest = { ...newRequestData, id: Date.now(), status: 'Active' };
    setRequests([newRequest, ...requests]);
    setActiveTab('home');
  };

  const handleDeleteRequest = (id: number) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  const handleAcceptDogRequest = (request: DogWalkRequest) => {
    const myProfileAsWalker: DogWalkerProfile = WALKERS[0];
    const newOrder: Order = {
      id: Date.now(),
      dog: request.dog,
      walker: myProfileAsWalker,
      date: request.date,
      startTime: request.timeSlot.split(' - ')[0],
      durationMinutes: 60,
      serviceType: request.serviceTypes[0],
      status: 'Pending',
      totalCost: request.price,
      gpsTrack: []
    };
    setOrders([newOrder, ...orders]);
    setActiveTab('home');
  };

  const handleSaveAddress = (addressData: Omit<Address, 'id'> & { id?: number }) => {
    let updatedAddresses: Address[];
    if (addressData.isPrimary) {
      updatedAddresses = addresses.map(a => ({ ...a, isPrimary: false }));
    } else {
      updatedAddresses = [...addresses];
    }
    if (addressData.id) {
      updatedAddresses = updatedAddresses.map(a => a.id === addressData.id ? { ...a, ...addressData } : a) as Address[];
    } else {
      const newAddress: Address = { ...addressData, id: Date.now() } as Address;
      updatedAddresses.push(newAddress);
    }
    setAddresses(updatedAddresses);
    setActiveTab('address-list');
    setSelectedAddress(null);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    setActiveTab('address-list');
    setSelectedAddress(null);
  };

  const handleSetPrimaryAddress = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isPrimary: a.id === id })));
  };

  const handleCreateBooking = (bookingData: { dogId: number, serviceType: ServiceType, date: string, time: string, price: number }) => {
    const dog = dogs.find(d => d.id === bookingData.dogId) || dogs[0];
    const newOrder: Order = {
      id: Date.now(),
      dog: dog,
      walker: bookingWalker!,
      date: bookingData.date,
      startTime: bookingData.time,
      durationMinutes: 60,
      serviceType: bookingData.serviceType,
      status: 'Pending',
      totalCost: bookingData.price,
      gpsTrack: []
    };
    setOrders([newOrder, ...orders]);
    setActiveTab('home');
    setBookingWalker(null);
  };

  const handleViewOrder = (orderId: number) => {
    setActiveOrderId(orderId);
    setActiveTab('live');
  };

  const handleStartOrder = (orderId: number) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'InProgress', elapsedTime: 0, currentDistance: 0 } : o));
    setActiveOrderId(orderId);
    setActiveTab('live');
  };

  const handleOpenChat = (user: User) => {
    setChatPartner(user);
    setActiveTab('chat');
  };

  const handleNavigation = (tab: string) => {
    if (tab === 'search:find-dog') {
      setSearchInitialMode('find-dog');
      setActiveTab('search');
    } else if (tab === 'search') {
      setSearchInitialMode('find-walker');
      setActiveTab('search');
    } else if (tab === 'personal-data-walker') {
      setPersonalDataInitialRole('walker');
      setActiveTab('personal-data');
    } else if (tab === 'personal-data') {
      setPersonalDataInitialRole('owner');
      setActiveTab('personal-data');
    } else if (tab === 'live' && !activeOrderId) {
        const relevantOrder = orders.find(o => o.status === 'InProgress') || orders.find(o => o.status === 'Pending');
        if (relevantOrder) {
            setActiveOrderId(relevantOrder.id);
        }
        setActiveTab('live');
    } else {
      setActiveTab(tab);
    }
  };

  const markNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={handleNavigation} onViewOrder={handleViewOrder} onStartOrder={handleStartOrder} dogs={dogs} orders={orders} requests={requests} />;
      case 'search':
        return <Search onBookWalker={(walker) => { setBookingWalker(walker); setActiveTab('booking'); }} onAcceptRequest={handleAcceptDogRequest} user={CURRENT_USER} initialMode={searchInitialMode} />;
      case 'live':
        const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0];
        return (
          <LiveTracking 
            order={activeOrder} 
            gpsInterval={gpsSettings.interval} 
            userPos={userPos}
            onUpdateUserPos={setUserPos}
            onBack={() => setActiveTab('home')} 
            onOpenChat={handleOpenChat} 
            onStartService={() => handleStartOrder(activeOrder.id)} 
          />
        );
      case 'profile':
        return <ProfileView dogsCount={dogs.length} onNavigate={handleNavigation} />;
      case 'locations-map':
        return <LocationsMapView onBack={() => setActiveTab('profile')} />;
      case 'support':
        return <SupportView onBack={() => setActiveTab('profile')} onNavigateTerms={() => setActiveTab('terms')} />;
      case 'terms':
        return <TermsView onBack={() => setActiveTab('support')} />;
      case 'notifications':
        return (
          <NotificationsView 
            notifications={notifications} 
            onMarkRead={markNotificationRead} 
            onBack={() => setActiveTab('home')}
            onNavigateToOrder={handleViewOrder}
          />
        );
      case 'history':
        return <HistoryView orders={orders} onBack={() => setActiveTab('profile')} />;
      case 'personal-data':
        return <PersonalDataView initialRole={personalDataInitialRole} onBack={() => setActiveTab('profile')} />;
      case 'gps-settings':
        return (
          <GPSSettingsView 
            settings={gpsSettings} 
            onUpdate={setGpsSettings} 
            onLocationUpdate={setUserPos}
            onBack={() => setActiveTab('profile')} 
          />
        );
      case 'dog-list':
        return (
          <DogListView 
            dogs={dogs} 
            onBack={() => setActiveTab('profile')} 
            onEditDog={(dog) => { setSelectedDog(dog); setActiveTab('edit-dog'); }} 
            onAddNew={() => setActiveTab('add-dog')}
          />
        );
      case 'add-dog':
        return <AddDog onSave={handleAddDog} onCancel={() => setActiveTab('home')} />;
      case 'edit-dog':
        return selectedDog ? (
          <EditDogView 
            dog={selectedDog} 
            onSave={handleUpdateDog} 
            onDelete={handleDeleteDog}
            onCancel={() => setActiveTab('dog-list')} 
            orders={orders}
          />
        ) : null;
      case 'add-request':
        return <AddRequestView dogs={dogs} addresses={addresses} onSave={handleAddRequest} onCancel={() => setActiveTab('home')} />;
      case 'request-list':
        return <RequestListView requests={requests} onBack={() => setActiveTab('home')} onDelete={handleDeleteRequest} onAddNew={() => setActiveTab('add-request')} />;
      case 'address-list':
        return (
          <AddressListView 
            addresses={addresses}
            onBack={() => setActiveTab('profile')}
            onAddNew={() => { setSelectedAddress(null); setActiveTab('edit-address'); }}
            onEdit={(addr) => { setSelectedAddress(addr); setActiveTab('edit-address'); }}
            onSetPrimary={handleSetPrimaryAddress}
          />
        );
      case 'edit-address':
        return (
          <AddressEditView 
            address={selectedAddress || undefined}
            onSave={handleSaveAddress}
            onDelete={handleDeleteAddress}
            onCancel={() => setActiveTab('address-list')}
          />
        );
      case 'booking':
        return bookingWalker ? (
          <BookingView 
            walker={bookingWalker} 
            dogs={dogs}
            addresses={addresses}
            onBack={() => setActiveTab('search')}
            onViewProfile={(walker) => { setViewingProfile(walker); setActiveTab('public-profile'); }}
            onConfirm={handleCreateBooking}
          />
        ) : null;
      case 'public-profile':
        return viewingProfile ? (
          <PublicProfileView 
            walker={viewingProfile} 
            onBack={() => setActiveTab('booking')} 
            onOpenChat={handleOpenChat}
          />
        ) : null;
      case 'chat':
        return chatPartner ? (
          <ChatView partner={chatPartner} onBack={() => setActiveTab('home')} />
        ) : null;
      default:
        return <Home onNavigate={handleNavigation} onViewOrder={handleViewOrder} onStartOrder={handleStartOrder} dogs={dogs} orders={orders} requests={requests} />;
    }
  };

  const fullScreenTabs = [
    'add-dog', 'personal-data', 'gps-settings', 
    'dog-list', 'edit-dog', 'address-list', 'edit-address', 'booking', 'public-profile', 'chat', 'history', 'notifications', 'locations-map', 'support', 'terms', 'add-request', 'request-list'
  ];
  if (fullScreenTabs.includes(activeTab)) {
     return renderContent();
  }

  return (
    <Layout activeTab={activeTab} onTabChange={handleNavigation}>
      {renderContent()}
    </Layout>
  );
};

export default App;
