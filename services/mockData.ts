
import { Dog, DogWalkerProfile, Order, ServiceType, User, UserRole, DogWalkRequest, Address, AppNotification, WalkerTier } from '../types';

export const CURRENT_USER: User = {
  id: 1,
  firstName: "Anna",
  lastName: "Kowalska",
  email: "anna@example.com",
  image: "https://picsum.photos/200/200?random=1",
  roles: [UserRole.DogOwner, UserRole.DogWalker],
  walletBalance: 150.00,
  walkerTier: WalkerTier.Animator
};

export const MY_DOGS: Dog[] = [
  {
    id: 101,
    name: "Burek",
    breed: "Golden Retriever",
    age: 3,
    image: "https://picsum.photos/400/300?random=2",
    notes: "Lubi biegać za piłką, łagodny."
  },
  {
    id: 102,
    name: "Luna",
    breed: "Buldog Francuski",
    age: 2,
    image: "https://picsum.photos/400/300?random=3",
    notes: "Potrzebuje częstych przerw na picie."
  }
];

export const MY_ADDRESSES: Address[] = [
  {
    id: 1,
    label: "Dom",
    street: "ul. Marszałkowska 10/12",
    city: "Warszawa",
    postalCode: "00-001",
    isPrimary: true,
    notes: "Kod do domofonu 1234. Proszę dzwonić przed przyjściem."
  },
  {
    id: 2,
    label: "Biuro",
    street: "ul. Prosta 51",
    city: "Warszawa",
    postalCode: "00-838",
    isPrimary: false,
    notes: "Odbiór z recepcji."
  }
];

export const MY_REQUESTS: DogWalkRequest[] = [
  {
    id: 2001,
    dog: MY_DOGS[0],
    ownerId: 1,
    date: "25 Maj",
    timeSlot: "12:00",
    serviceTypes: [ServiceType.Walk],
    price: 35,
    addressId: 1,
    locationLabel: "Dom",
    status: 'Active'
  },
  {
    id: 2002,
    dog: MY_DOGS[1],
    ownerId: 1,
    date: "26 Maj",
    timeSlot: "10:30",
    serviceTypes: [ServiceType.VeterinaryCare],
    price: 120,
    addressId: 2,
    locationLabel: "Biuro",
    status: 'Active'
  }
];

export const WALKERS: DogWalkerProfile[] = [
  {
    id: 1,
    userId: 201,
    user: { id: 201, firstName: "Marek", lastName: "Nowak", email: "marek@walker.com", image: "https://picsum.photos/200/200?random=4", roles: [UserRole.DogWalker], walletBalance: 0, walkerTier: WalkerTier.Animator },
    bio: "Behawiorysta. Specjalizacja: psy trudne i lękowe.",
    experience: "5 lat",
    rating: 4.9,
    reviewsCount: 124,
    isVerified: true,
    availableServices: [ServiceType.Walk, ServiceType.Stay, ServiceType.Play, ServiceType.Feeding],
    tier: WalkerTier.Animator,
    hourlyRate: 50
  },
  {
    id: 2,
    userId: 202,
    user: { id: 202, firstName: "Julia", lastName: "Wiśniewska", email: "julia@walker.com", image: "https://picsum.photos/200/200?random=5", roles: [UserRole.DogWalker], walletBalance: 0, walkerTier: WalkerTier.Vet },
    bio: "Studentka weterynarii. Oferuję profesjonalną opiekę medyczną i domową.",
    experience: "IV rok Weterynarii",
    rating: 4.7,
    reviewsCount: 42,
    isVerified: true,
    availableServices: [ServiceType.Stay, ServiceType.VeterinaryCare, ServiceType.Walk, ServiceType.Feeding],
    tier: WalkerTier.Vet,
    hourlyRate: 80
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 5001,
    dog: MY_DOGS[0],
    walker: WALKERS[0],
    date: "Dzisiaj",
    startTime: "12:30",
    durationMinutes: 60,
    serviceType: ServiceType.Walk,
    status: 'InProgress',
    totalCost: 50,
    gpsTrack: [],
    currentDistance: 1.2,
    elapsedTime: 1800
  }
];

export const DOG_REQUESTS: DogWalkRequest[] = [
  {
    id: 1,
    dog: { id: 301, name: "Max", breed: "Owczarek Niemiecki", age: 4, image: "https://picsum.photos/400/300?random=31" },
    ownerId: 1001,
    date: "Dzisiaj",
    timeSlot: "12:00 - 14:00",
    serviceTypes: [ServiceType.VeterinaryCare],
    price: 110,
    addressId: 99,
    locationLabel: "Warszawa, Śródmieście",
    status: 'Active'
  },
  {
    id: 7,
    dog: { id: 307, name: "Bella", breed: "Yorkshire Terrier", age: 2, image: "https://picsum.photos/400/300?random=37" },
    ownerId: 1007,
    date: "Jutro",
    timeSlot: "08:00 - 09:00",
    serviceTypes: [ServiceType.Walk],
    price: 15,
    addressId: 98,
    locationLabel: "Warszawa, Mokotów",
    status: 'Active'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    type: 'dog_activity',
    title: 'Burek zrobił kupę! 💩',
    description: 'Patron Marek właśnie odnotował aktywność fizjologiczną podczas spaceru.',
    timestamp: '10 min temu',
    isRead: false,
    relatedOrderId: 5001,
    activityType: 'poop'
  }
];
