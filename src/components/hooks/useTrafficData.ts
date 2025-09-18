import { useEffect, useState } from "react";

interface Signal {
  id: string;
  status: string;
}

interface TrafficData {
  signals: Signal[];
  emergencyVehicles: number;
  trafficFlow: number;
}

export const useTrafficData = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [emergencyVehicles, setEmergencyVehicles] = useState<number>(0);
  const [trafficFlow, setTrafficFlow] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch traffic data from Flask API
  const fetchTrafficData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/traffic"); // Flask runs on port 5000
      const data: TrafficData = await response.json();

      setSignals(data.signals || []);
      setEmergencyVehicles(data.emergencyVehicles || 0);
      setTrafficFlow(data.trafficFlow || 0);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    // refresh every 5 seconds to simulate real-time
    const interval = setInterval(fetchTrafficData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Update a specific signal state (for UI interaction)
  const updateSignalState = (id: string, status: string) => {
    setSignals((prev) =>
      prev.map((signal) =>
        signal.id === id ? { ...signal, status } : signal
      )
    );
  };

  // Emergency override simulation
  const setEmergencyOverride = (id: string) => {
    setSignals((prev) =>
      prev.map((signal) =>
        signal.id === id ? { ...signal, status: "Emergency Override" } : signal
      )
    );
  };

  return {
    signals,
    emergencyVehicles,
    trafficFlow,
    loading,
    updateSignalState,
    setEmergencyOverride,
  };
};
