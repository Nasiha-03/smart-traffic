import React from 'react';
import { TrafficSignal } from '../types/traffic';
import { Circle, Clock, AlertTriangle, Settings } from 'lucide-react';

interface TrafficSignalCardProps {
  signal: TrafficSignal;
  onStateChange: (signalId: string, newState: 'red' | 'yellow' | 'green') => void;
  onEmergencyOverride: (signalId: string, override: boolean) => void;
}

export const TrafficSignalCard: React.FC<TrafficSignalCardProps> = ({ 
  signal, 
  onStateChange, 
  onEmergencyOverride 
}) => {
  const getStateColor = (state: string) => {
    switch (state) {
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      case 'green': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getDensityColor = (density: number) => {
    if (density > 70) return 'text-red-500';
    if (density > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getDensityBg = (density: number) => {
    if (density > 70) return 'bg-red-500/20';
    if (density > 40) return 'bg-yellow-500/20';
    return 'bg-green-500/20';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{signal.intersection}</h3>
          <p className="text-sm text-gray-400">ID: {signal.id}</p>
        </div>
        {signal.priority === 'emergency' && (
          <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Emergency
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Circle className={`w-8 h-8 ${getStateColor(signal.currentState)} fill-current`} />
          </div>
          <p className="text-sm text-gray-300">Current</p>
          <p className="text-lg font-semibold text-white capitalize">{signal.currentState}</p>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm text-gray-300">Time Left</p>
          <p className="text-lg font-semibold text-white">{signal.timeRemaining}s</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">Traffic Density</span>
          <span className={`text-sm font-medium ${getDensityColor(signal.trafficDensity)}`}>
            {signal.trafficDensity}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getDensityBg(signal.trafficDensity)}`}
            style={{ width: `${signal.trafficDensity}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onStateChange(signal.id, 'red')}
          className="flex-1 bg-red-500/20 text-red-400 py-2 px-3 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
        >
          Red
        </button>
        <button
          onClick={() => onStateChange(signal.id, 'yellow')}
          className="flex-1 bg-yellow-500/20 text-yellow-400 py-2 px-3 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm font-medium"
        >
          Yellow
        </button>
        <button
          onClick={() => onStateChange(signal.id, 'green')}
          className="flex-1 bg-green-500/20 text-green-400 py-2 px-3 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
        >
          Green
        </button>
      </div>

      <button
        onClick={() => onEmergencyOverride(signal.id, signal.priority !== 'emergency')}
        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
          signal.priority === 'emergency' 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
            : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
        }`}
      >
        <Settings className="w-4 h-4" />
        {signal.priority === 'emergency' ? 'Clear Emergency' : 'Emergency Override'}
      </button>
    </div>
  );
};