import React from 'react';
import { TrafficFlow } from '../types/traffic';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

interface TrafficFlowChartProps {
  trafficFlow: TrafficFlow[];
}

export const TrafficFlowChart: React.FC<TrafficFlowChartProps> = ({ trafficFlow }) => {
  const getFlowsByDirection = () => {
    const directions = ['north', 'south', 'east', 'west'];
    return directions.map(direction => {
      const flows = trafficFlow.filter(flow => flow.direction === direction);
      const totalVehicles = flows.reduce((sum, flow) => sum + flow.vehicleCount, 0);
      const avgSpeed = flows.reduce((sum, flow) => sum + flow.averageSpeed, 0) / flows.length || 0;
      const congestionLevels = flows.map(flow => flow.congestionLevel);
      const highCongestion = congestionLevels.filter(level => level === 'high').length;
      
      return {
        direction,
        totalVehicles,
        avgSpeed: avgSpeed.toFixed(1),
        congestionLevel: highCongestion > flows.length / 2 ? 'high' : 
                        highCongestion > 0 ? 'medium' : 'low'
      };
    });
  };

  const flowData = getFlowsByDirection();
  const maxVehicles = Math.max(...flowData.map(d => d.totalVehicles));

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSpeedTrend = (speed: number) => {
    if (speed > 25) return { icon: TrendingUp, color: 'text-green-400' };
    if (speed > 15) return { icon: Activity, color: 'text-yellow-400' };
    return { icon: TrendingDown, color: 'text-red-400' };
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Traffic Flow Analysis
        </h2>
        <div className="text-sm text-gray-400">
          Real-time data
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flowData.map((flow, index) => {
          const speedTrend = getSpeedTrend(parseFloat(flow.avgSpeed));
          const TrendIcon = speedTrend.icon;
          
          return (
            <div 
              key={flow.direction}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white capitalize">{flow.direction}bound</h3>
                <div className={`px-2 py-1 rounded text-xs font-medium ${getCongestionColor(flow.congestionLevel)}`}>
                  {flow.congestionLevel}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Vehicle Count</span>
                  <span className="text-white font-semibold">{flow.totalVehicles}</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${(flow.totalVehicles / maxVehicles) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Avg Speed</span>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-4 h-4 ${speedTrend.color}`} />
                    <span className="text-white font-semibold">{flow.avgSpeed} mph</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {trafficFlow.reduce((sum, flow) => sum + flow.vehicleCount, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Vehicles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {(trafficFlow.reduce((sum, flow) => sum + flow.averageSpeed, 0) / trafficFlow.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Avg Speed (mph)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {trafficFlow.filter(flow => flow.congestionLevel === 'high').length}
            </div>
            <div className="text-sm text-gray-400">High Congestion</div>
          </div>
        </div>
      </div>
    </div>
  );
};