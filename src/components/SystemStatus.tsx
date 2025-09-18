import React from 'react';
import { TrafficSignal, EmergencyVehicle } from '../types/traffic';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Wifi, 
  Server,
  Database,
  Shield
} from 'lucide-react';

interface SystemStatusProps {
  signals: TrafficSignal[];
  emergencyVehicles: EmergencyVehicle[];
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ signals, emergencyVehicles }) => {
  const systemHealth = {
    online: signals.length,
    emergency: signals.filter(s => s.priority === 'emergency').length,
    activeVehicles: emergencyVehicles.filter(v => v.active).length,
    avgResponseTime: '1.2s',
    uptime: '99.7%',
    lastUpdate: new Date().toLocaleTimeString()
  };

  const statusItems = [
    {
      icon: Activity,
      label: 'System Status',
      value: 'Operational',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Wifi,
      label: 'Network',
      value: 'Connected',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Database,
      label: 'Database',
      value: 'Online',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Server,
      label: 'API Server',
      value: 'Running',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          System Status
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: {systemHealth.lastUpdate}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{item.label}</h3>
                    <p className={`text-sm ${item.color}`}>{item.value}</p>
                  </div>
                </div>
                <CheckCircle className={`w-5 h-5 ${item.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Active Signals</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemHealth.online}</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Emergency Mode</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemHealth.emergency}</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemHealth.avgResponseTime}</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Uptime</span>
          </div>
          <div className="text-2xl font-bold text-white">{systemHealth.uptime}</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            System operating normally • All services connected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};