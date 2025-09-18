import React, { useState, useEffect } from 'react';
import { TrafficSignal } from '../types/traffic';
import { Car, Truck, Bus, Users, Clock, MapPin } from 'lucide-react';

interface Vehicle {
  id: string;
  type: 'car' | 'bus' | 'truck';
  color: string;
  lane: number;
  position: number;
  speed: number;
}

interface Pedestrian {
  id: string;
  position: number;
  waiting: boolean;
  type: 'adult' | 'child';
}

interface StreetSceneProps {
  signal: TrafficSignal;
  onSignalClick?: () => void;
}

export const StreetSceneVisualization: React.FC<StreetSceneProps> = ({ signal, onSignalClick }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pedestrians, setPedestrians] = useState<Pedestrian[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize vehicles and pedestrians
  useEffect(() => {
    const initialVehicles: Vehicle[] = [
      { id: 'car1', type: 'car', color: '#3B82F6', lane: 1, position: 20, speed: 2 },
      { id: 'car2', type: 'car', color: '#EF4444', lane: 2, position: 45, speed: 1.5 },
      { id: 'bus1', type: 'bus', color: '#F59E0B', lane: 1, position: 70, speed: 1 },
      { id: 'truck1', type: 'truck', color: '#10B981', lane: 3, position: 15, speed: 1.2 },
      { id: 'car3', type: 'car', color: '#8B5CF6', lane: 2, position: 85, speed: 2.2 },
      { id: 'car4', type: 'car', color: '#F97316', lane: 3, position: 60, speed: 1.8 }
    ];

    const initialPedestrians: Pedestrian[] = [
      { id: 'ped1', position: 10, waiting: true, type: 'adult' },
      { id: 'ped2', position: 15, waiting: true, type: 'child' },
      { id: 'ped3', position: 20, waiting: true, type: 'adult' },
      { id: 'ped4', position: 25, waiting: true, type: 'adult' },
      { id: 'ped5', position: 30, waiting: true, type: 'child' }
    ];

    setVehicles(initialVehicles);
    setPedestrians(initialPedestrians);
  }, []);

  // Animate vehicles and update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      setVehicles(prev => prev.map(vehicle => {
        let newPosition = vehicle.position;
        let newSpeed = vehicle.speed;

        // Stop vehicles at red light
        if (signal.currentState === 'red' && vehicle.position < 50 && vehicle.position > 40) {
          newSpeed = 0;
        } else if (signal.currentState === 'green') {
          newSpeed = vehicle.speed;
          newPosition = (vehicle.position + newSpeed) % 100;
        } else if (signal.currentState === 'yellow') {
          newSpeed = vehicle.speed * 0.5;
          newPosition = (vehicle.position + newSpeed) % 100;
        } else {
          newPosition = (vehicle.position + newSpeed) % 100;
        }

        return {
          ...vehicle,
          position: newPosition,
          speed: newSpeed
        };
      }));

      // Update pedestrian crossing behavior
      setPedestrians(prev => prev.map(ped => ({
        ...ped,
        waiting: signal.currentState !== 'red'
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [signal.currentState]);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'bus': return <Bus className="w-6 h-6" />;
      case 'truck': return <Truck className="w-6 h-6" />;
      default: return <Car className="w-5 h-5" />;
    }
  };

  const getSignalColor = (state: string) => {
    switch (state) {
      case 'red': return '#EF4444';
      case 'yellow': return '#F59E0B';
      case 'green': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Street View: {signal.intersection}
          </h2>
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Traffic Density</div>
          <div className="text-lg font-semibold text-white">{signal.trafficDensity}%</div>
        </div>
      </div>

      {/* Street Scene Container */}
      <div className="relative bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg overflow-hidden" style={{ height: '400px' }}>
        
        {/* Sky and Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 via-blue-300 to-gray-300 opacity-30" />
        
        {/* Buildings Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-700 to-gray-600 opacity-80">
          <div className="flex justify-around items-end h-full">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="bg-gray-800 opacity-60"
                style={{ 
                  width: '60px', 
                  height: `${80 + Math.random() * 40}px`,
                  marginBottom: '10px'
                }}
              />
            ))}
          </div>
        </div>

        {/* Road Surface */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gray-700">
          
          {/* Lane Markings */}
          <div className="absolute inset-0">
            {/* Horizontal lanes */}
            {[1, 2, 3].map(lane => (
              <div 
                key={lane}
                className="absolute border-t-2 border-dashed border-white opacity-60"
                style={{ 
                  top: `${120 + lane * 40}px`,
                  left: '0',
                  right: '0'
                }}
              />
            ))}
            
            {/* Center divider */}
            <div className="absolute top-32 left-0 right-0 h-1 bg-yellow-400" />
            
            {/* Zebra Crossing */}
            <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-20">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="bg-white h-3 mb-1 rounded"
                  style={{ width: '100%' }}
                />
              ))}
            </div>
          </div>

          {/* Sidewalks */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gray-500" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-500" />

          {/* Curbs */}
          <div className="absolute top-16 left-0 right-0 h-2 bg-gray-400" />
          <div className="absolute bottom-16 left-0 right-0 h-2 bg-gray-400" />
        </div>

        {/* Traffic Signal */}
        <div 
          className="absolute top-20 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={onSignalClick}
        >
          <div className="bg-gray-900 rounded-lg p-2 shadow-lg">
            <div className="space-y-1">
              <div 
                className={`w-4 h-4 rounded-full ${signal.currentState === 'red' ? 'bg-red-500 shadow-red-500/50 shadow-lg' : 'bg-red-900'}`}
              />
              <div 
                className={`w-4 h-4 rounded-full ${signal.currentState === 'yellow' ? 'bg-yellow-500 shadow-yellow-500/50 shadow-lg' : 'bg-yellow-900'}`}
              />
              <div 
                className={`w-4 h-4 rounded-full ${signal.currentState === 'green' ? 'bg-green-500 shadow-green-500/50 shadow-lg' : 'bg-green-900'}`}
              />
            </div>
          </div>
          <div className="text-xs text-white text-center mt-1 bg-black/50 rounded px-1">
            {signal.timeRemaining}s
          </div>
        </div>

        {/* Street Signs */}
        <div className="absolute top-24 right-8">
          <div className="bg-green-600 text-white text-xs px-2 py-1 rounded mb-2">
            Main Street
          </div>
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded mb-2">
            Speed Limit 25
          </div>
          <div className="bg-red-600 text-white text-xs px-2 py-1 rounded">
            No Turn on Red
          </div>
        </div>

        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="absolute transition-all duration-100 ease-linear flex items-center justify-center rounded"
            style={{
              left: `${vehicle.position}%`,
              top: `${140 + vehicle.lane * 40}px`,
              width: vehicle.type === 'bus' ? '40px' : vehicle.type === 'truck' ? '35px' : '25px',
              height: vehicle.type === 'bus' ? '20px' : '15px',
              backgroundColor: vehicle.color,
              transform: 'translateX(-50%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            <div className="text-white text-xs">
              {getVehicleIcon(vehicle.type)}
            </div>
          </div>
        ))}

        {/* Pedestrians */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          {pedestrians.map(pedestrian => (
            <div
              key={pedestrian.id}
              className={`flex flex-col items-center transition-all duration-300 ${
                pedestrian.waiting ? 'text-red-400' : 'text-green-400'
              }`}
            >
              <Users className={`w-4 h-4 ${pedestrian.type === 'child' ? 'scale-75' : ''}`} />
              <div className="w-1 h-1 bg-current rounded-full mt-1" />
            </div>
          ))}
        </div>

        {/* Pedestrian Signal */}
        <div className="absolute top-8 right-1/4">
          <div className="bg-gray-900 rounded p-1">
            <div className={`w-3 h-3 rounded-full mb-1 ${
              signal.currentState === 'red' ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <div className="text-xs text-white text-center">
              {signal.currentState === 'red' ? 'WALK' : 'STOP'}
            </div>
          </div>
        </div>

        {/* Emergency Vehicle Indicator */}
        {signal.priority === 'emergency' && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
            🚨 EMERGENCY OVERRIDE
          </div>
        )}

        {/* Weather/Time Indicator */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
          ☀️ Clear • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Scene Controls */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Car className="w-4 h-4" />
            <span>{vehicles.length} vehicles</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{pedestrians.length} pedestrians</span>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          Signal State: <span className="text-white font-medium capitalize">{signal.currentState}</span>
        </div>
      </div>
    </div>
  );
};