import React, { useState } from 'react';
import { TrafficSignal, EmergencyVehicle, TrafficFlow, User } from '../types/traffic';
import { Header } from './Header';
import { TrafficSignalCard } from './TrafficSignalCard';
import { EmergencyVehiclePanel } from './EmergencyVehiclePanel';
import { TrafficFlowChart } from './TrafficFlowChart';
import { SystemStatus } from './SystemStatus';
import { StreetSceneVisualization } from './StreetSceneVisualization';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Settings,
  Map,
  Eye
} from 'lucide-react';

interface DashboardProps {
  user: User;
  signals: TrafficSignal[];
  emergencyVehicles: EmergencyVehicle[];
  trafficFlow: TrafficFlow[];
  onLogout: () => void;
  onStateChange: (signalId: string, newState: 'red' | 'yellow' | 'green') => void;
  onEmergencyOverride: (signalId: string, override: boolean) => void;
}

type TabType = 'overview' | 'signals' | 'emergency' | 'analytics' | 'status' | 'streetview';

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  signals,
  emergencyVehicles,
  trafficFlow,
  onLogout,
  onStateChange,
  onEmergencyOverride
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedSignal, setSelectedSignal] = useState<TrafficSignal>(signals[0]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'signals', label: 'Traffic Signals', icon: Activity },
    { id: 'streetview', label: 'Street View', icon: Eye },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'status', label: 'System Status', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TrafficFlowChart trafficFlow={trafficFlow} />
              </div>
              <div>
                <SystemStatus signals={signals} emergencyVehicles={emergencyVehicles} />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Signals</h3>
                <div className="grid grid-cols-1 gap-4">
                  {signals.slice(0, 2).map(signal => (
                    <TrafficSignalCard
                      key={signal.id}
                      signal={signal}
                      onStateChange={onStateChange}
                      onEmergencyOverride={onEmergencyOverride}
                    />
                  ))}
                </div>
              </div>
              <div>
                <EmergencyVehiclePanel vehicles={emergencyVehicles} />
              </div>
            </div>
          </div>
        );
      case 'signals':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Traffic Signals</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Activity className="w-4 h-4" />
                <span>{signals.length} Active Signals</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {signals.map(signal => (
                <TrafficSignalCard
                  key={signal.id}
                  signal={signal}
                  onStateChange={onStateChange}
                  onEmergencyOverride={onEmergencyOverride}
                />
              ))}
            </div>
          </div>
        );
      case 'streetview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Street View Monitor</h2>
              <div className="flex items-center gap-4">
                <select 
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                  value={selectedSignal?.id || ''}
                  onChange={(e) => {
                    const signal = signals.find(s => s.id === e.target.value);
                    if (signal) setSelectedSignal(signal);
                  }}
                >
                  {signals.map(signal => (
                    <option key={signal.id} value={signal.id} className="bg-gray-800">
                      {signal.intersection}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>Live View</span>
                </div>
              </div>
            </div>
            
            {selectedSignal && (
              <StreetSceneVisualization 
                signal={selectedSignal}
                onSignalClick={() => {
                  const nextState = selectedSignal.currentState === 'red' ? 'green' : 
                                   selectedSignal.currentState === 'green' ? 'yellow' : 'red';
                  onStateChange(selectedSignal.id, nextState);
                }}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {signals.map(signal => (
                <div 
                  key={signal.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-lg border p-4 cursor-pointer transition-all ${
                    selectedSignal?.id === signal.id 
                      ? 'border-blue-400 bg-white/20' 
                      : 'border-white/20 hover:bg-white/15'
                  }`}
                  onClick={() => setSelectedSignal(signal)}
                >
                  <div className="text-sm font-medium text-white mb-2">{signal.intersection}</div>
                  <div className="flex items-center justify-between">
                    <div className={`w-3 h-3 rounded-full ${
                      signal.currentState === 'red' ? 'bg-red-500' :
                      signal.currentState === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="text-xs text-gray-400">{signal.trafficDensity}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'emergency':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Emergency Management</h2>
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span>{emergencyVehicles.filter(v => v.active).length} Active Vehicles</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmergencyVehiclePanel vehicles={emergencyVehicles} />
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Emergency Signals</h3>
                <div className="space-y-4">
                  {signals.filter(s => s.priority === 'emergency').map(signal => (
                    <TrafficSignalCard
                      key={signal.id}
                      signal={signal}
                      onStateChange={onStateChange}
                      onEmergencyOverride={onEmergencyOverride}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Traffic Analytics</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <BarChart3 className="w-4 h-4" />
                <span>Real-time Data</span>
              </div>
            </div>
            <TrafficFlowChart trafficFlow={trafficFlow} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Intersections', value: signals.length, color: 'text-blue-400' },
                { label: 'Emergency Alerts', value: signals.filter(s => s.priority === 'emergency').length, color: 'text-red-400' },
                { label: 'Avg Traffic Density', value: `${Math.round(signals.reduce((sum, s) => sum + s.trafficDensity, 0) / signals.length)}%`, color: 'text-green-400' },
                { label: 'System Uptime', value: '99.7%', color: 'text-green-400' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">System Status</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400">All Systems Operational</span>
              </div>
            </div>
            <SystemStatus signals={signals} emergencyVehicles={emergencyVehicles} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header user={user} onLogout={onLogout} />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};