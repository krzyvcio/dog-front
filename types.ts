
export enum UserRole {
  RegisteredUser = 'RegisteredUser',
  DogWalker = 'DogWalker',
  DogOwner = 'DogOwner',
  Admin = 'Admin'
}

export enum WalkerTier {
  Lover = 'Psi miłośnik',
  Animator = 'Psi Animator',
  Vet = 'Psi Zbawiciel - Weterynarz'
}

export enum ServiceType {
  Walk = 'Walk',
  Feeding = 'Feeding',
  Play = 'Play',
  Stay = 'Stay',
  Carry = 'Carry',
  VeterinaryCare = 'VeterinaryCare'
}

export interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
  roles: UserRole[];
  walletBalance: number;
  walkerTier?: WalkerTier;
}

export interface Dog {
  id: number;
  name: string;
  breed: string;
  age: number;
  image: string;
  notes?: string;
}

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  isPrimary: boolean;
  notes?: string;
}

export interface DogWalkerProfile {
  id: number;
  userId: number;
  user: User;
  bio: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  availableServices: ServiceType[];
  tier: WalkerTier;
  hourlyRate: number;
}

export interface DogWalkRequest {
  id: number;
  dog: Dog;
  ownerId: number;
  date: string;
  timeSlot: string;
  serviceTypes: ServiceType[];
  price: number;
  addressId: number;
  locationLabel: string;
  status: 'Active' | 'Filled' | 'Expired';
}

export interface GPS {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface WalkActivity {
  id: number;
  type: 'poop' | 'play' | 'sniff' | 'start';
  timestamp: string;
  label: string;
}

export interface Order {
  id: number;
  dog: Dog;
  walker: DogWalkerProfile;
  date: string;
  startTime: string;
  durationMinutes: number;
  serviceType: ServiceType;
  status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
  totalCost: number;
  gpsTrack: GPS[];
  currentDistance?: number;
  elapsedTime?: number;
  activities?: WalkActivity[];
}

export type NotificationType = 'booking_confirmed' | 'walk_started' | 'walk_finished' | 'dog_activity' | 'system';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  relatedOrderId?: number;
  activityType?: 'poop' | 'play' | 'sniff';
}

export enum PlaceType {
  Veterinary = 'veterinary',
  PetShop = 'pet_shop',
  Shelter = 'animal_shelter'
}

export interface DogPlace {
  id: number;
  lat: number;
  lon: number;
  type: PlaceType;
  name: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  phone?: string;
  website?: string;
}
