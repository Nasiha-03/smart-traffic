import React, { useEffect, useState } from "react";

type TrafficData = {
  junction_1: string;
  junction_2: string;
  junction_3: string;
};

const TrafficDashboard: React.FC = () => {
  const [traffic, setTraffic] = useState<TrafficData | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/traffic")
      .then((res) => res.json())
      .then((data: TrafficData) => setTraffic(data))
      .catch((err) => console.error("Error fetching traffic data:", err));
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🚦 Traffic Dashboard
      </h2>
      {traffic ? (
        <ul className="space-y-2">
          {Object.entries(traffic).map(([junction, status]) => (
            <li
              key={junction}
              className="flex justify-between items-center border-b last:border-none py-2"
            >
              <span className="font-medium text-gray-700">
                {junction.replace("_", " ").toUpperCase()}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  status === "High"
                    ? "bg-red-100 text-red-600"
                    : status === "Moderate"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Loading traffic data...</p>
      )}
    </div>
  );
};

export default TrafficDashboard;
