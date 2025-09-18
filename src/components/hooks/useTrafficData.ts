import { useState, useEffect } from 'react';
import { TrafficSignal, EmergencyVehicle, TrafficFlow } from '../types/traffic';

export const useTrafficData = () => {
  const [signals, setSignals] = useState<TrafficSignal[]>([]);
  const [emergencyVehicles, setEmergencyVehicles] = useState<EmergencyVehicle[]>([]);
  const [trafficFlow, setTrafficFlow] = useState<TrafficFlow[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate mock traffic signals
  const generateMockSignals = (): TrafficSignal[] => {
    const intersections = [
      { name: 'Main St & 1st Ave', lat: 40.7128, lng: -74.0060 },
      { name: 'Broadway & 42nd St', lat: 40.7589, lng: -73.9851 },
      { name: 'Park Ave & 59th St', lat: 40.7614, lng: -73.9776 },
      { name: '5th Ave & 14th St', lat: 40.7353, lng: -73.9923 },
      { name: 'Madison Ave & 23rd St', lat: 40.7420, lng: -73.9876 }
    ];

    return intersections.map((intersection, index) => ({
      id: `signal-${index + 1}`,
      intersection: intersection.name,
      location: intersection,
      currentState: ['red', 'yellow', 'green'][Math.floor(Math.random() * 3)] as 'red' | 'yellow' | 'green',
      nextState: ['red', 'yellow', 'green'][Math.floor(Math.random() * 3)] as 'red' | 'yellow' | 'green',
      timeRemaining: Math.floor(Math.random() * 60) + 10,
      cycleTime: 120,
      priority: Math.random() > 0.8 ? 'emergency' : 'normal',
      trafficDensity: Math.floor(Math.random() * 100),
      lastUpdated: new Date()
    }));
  };

  // Generate mock emergency vehicles
  const generateMockEmergencyVehicles = (): EmergencyVehicle[] => {
    const vehicles = [
      { type: 'ambulance', lat: 40.7580, lng: -73.9855 },
      { type: 'fire', lat: 40.7505, lng: -73.9934 },
      { type: 'police', lat: 40.7411, lng: -73.9897 }
    ];

    return vehicles.map((vehicle, index) => ({
      id: `emergency-${index + 1}`,
      type: vehicle.type as 'ambulance' | 'fire' | 'police',
      location: { lat: vehicle.lat, lng: vehicle.lng },
      destination: { lat: vehicle.lat + 0.01, lng: vehicle.lng + 0.01 },
      priority: Math.floor(Math.random() * 3) + 1,
      eta: Math.floor(Math.random() * 10) + 2,
      affectedSignals: [`signal-${index + 1}`, `signal-${index + 2}`],
      active: Math.random() > 0.5
    }));
  };

  // Generate mock traffic flow data
  const generateMockTrafficFlow = (signals: TrafficSignal[]): TrafficFlow[] => {
    const flows: TrafficFlow[] = [];
    const directions = ['north', 'south', 'east', 'west'] as const;

    signals.forEach(signal => {
      directions.forEach(direction => {
        flows.push({
          signalId: signal.id,
          direction,
          vehicleCount: Math.floor(Math.random() * 50) + 5,
          averageSpeed: Math.floor(Math.random() * 30) + 15,
          congestionLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          timestamp: new Date()
        });
      });
    });

    return flows;
  };

  useEffect(() => {
    // Initialize mock data
    const mockSignals = generateMockSignals();
    const mockEmergencyVehicles = generateMockEmergencyVehicles();
    const mockTrafficFlow = generateMockTrafficFlow(mockSignals);

    setSignals(mockSignals);
    setEmergencyVehicles(mockEmergencyVehicles);
    setTrafficFlow(mockTrafficFlow);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSignals(prev => prev.map(signal => ({
        ...signal,
        timeRemaining: Math.max(0, signal.timeRemaining - 1),
        currentState: signal.timeRemaining <= 0 ? signal.nextState : signal.currentState,
        nextState: signal.timeRemaining <= 0 ? 
          (signal.nextState === 'red' ? 'green' : 
           signal.nextState === 'green' ? 'yellow' : 'red') : signal.nextState,
        timeRemaining: signal.timeRemaining <= 0 ? Math.floor(Math.random() * 60) + 10 : signal.timeRemaining,
        trafficDensity: Math.max(0, Math.min(100, signal.trafficDensity + (Math.random() - 0.5) * 10)),
        lastUpdated: new Date()
      })));

      setEmergencyVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        eta: Math.max(0, vehicle.eta - 0.1),
        active: vehicle.eta > 0
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateSignalState = (signalId: string, newState: 'red' | 'yellow' | 'green') => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, currentState: newState, lastUpdated: new Date() }
        : signal
    ));
  };

  const setEmergencyOverride = (signalId: string, override: boolean) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, priority: override ? 'emergency' : 'normal' }
        : signal
    ));
  };

  return {
    signals,
    emergencyVehicles,
    trafficFlow,
    loading,
    updateSignalState,
    setEmergencyOverride
  };
};