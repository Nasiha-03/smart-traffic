
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './components/hooks/useAuth';
import { useTrafficData } from './components/hooks/useTrafficData';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { 
    signals, 
    emergencyVehicles, 
    trafficFlow, 
    loading: dataLoading, 
    updateSignalState, 
    setEmergencyOverride 
  } = useTrafficData();

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading Smart Traffic Management System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={login} loading={authLoading} />;
  }

  return (
    <Dashboard
      user={user}
      signals={signals}
      emergencyVehicles={emergencyVehicles}
      trafficFlow={trafficFlow}
      onLogout={logout}
      onStateChange={updateSignalState}
      onEmergencyOverride={setEmergencyOverride}
    />
  );
}

export default App;