export interface TrafficSignal {
  id: string;
  intersection: string;
  location: {
    lat: number;
    lng: number;
  };
  currentState: 'red' | 'yellow' | 'green';
  nextState: 'red' | 'yellow' | 'green';
  timeRemaining: number;
  cycleTime: number;
  priority: 'normal' | 'emergency' | 'high';
  trafficDensity: number;
  lastUpdated: Date;
}

export interface EmergencyVehicle {
  id: string;
  type: 'ambulance' | 'fire' | 'police';
  location: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
  };
  priority: number;
  eta: number;
  affectedSignals: string[];
  active: boolean;
}

export interface TrafficFlow {
  signalId: string;
  direction: 'north' | 'south' | 'east' | 'west';
  vehicleCount: number;
  averageSpeed: number;
  congestionLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  lastLogin: Date;
}