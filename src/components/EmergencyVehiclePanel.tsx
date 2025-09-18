import React from 'react';
import { EmergencyVehicle } from '../types/traffic';
import { Ambulance, Truck, Shield, Clock, Navigation } from 'lucide-react';

interface EmergencyVehiclePanelProps {
  vehicles: EmergencyVehicle[];
}

export const EmergencyVehiclePanel: React.FC<EmergencyVehiclePanelProps> = ({ vehicles }) => {
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'ambulance': return <Ambulance className="w-5 h-5" />;
      case 'fire': return <Truck className="w-5 h-5" />;
      case 'police': return <Shield className="w-5 h-5" />;
      default: return <Navigation className="w-5 h-5" />;
    }
  };

  const getVehicleColor = (type: string) => {
    switch (type) {
      case 'ambulance': return 'text-red-400 bg-red-500/20';
      case 'fire': return 'text-orange-400 bg-orange-500/20';
      case 'police': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const activeVehicles = vehicles.filter(v => v.active);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Emergency Vehicles</h2>
        <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
          {activeVehicles.length} Active
        </div>
      </div>

      <div className="space-y-4">
        {activeVehicles.map((vehicle) => (
          <div 
            key={vehicle.id}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getVehicleColor(vehicle.type)}`}>
                  {getVehicleIcon(vehicle.type)}
                </div>
                <div>
                  <h3 className="font-medium text-white capitalize">{vehicle.type}</h3>
                  <p className="text-sm text-gray-400">ID: {vehicle.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>ETA: {vehicle.eta.toFixed(1)}min</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Priority: {vehicle.priority}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Current Location:</span>
                <p className="text-white font-mono text-xs">
                  {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Destination:</span>
                <p className="text-white font-mono text-xs">
                  {vehicle.destination.lat.toFixed(4)}, {vehicle.destination.lng.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <span className="text-sm text-gray-400">Affected Signals:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {vehicle.affectedSignals.map((signalId) => (
                  <span 
                    key={signalId}
                    className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded"
                  >
                    {signalId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {activeVehicles.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Navigation className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active emergency vehicles</p>
          </div>
        )}
      </div>
    </div>
  );
};