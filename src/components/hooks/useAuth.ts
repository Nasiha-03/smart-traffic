import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // simulate loading

    if (username === 'admin' && password === 'admin123') {
      setUser({ name: 'Admin', role: 'Administrator' });
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return { user, loading, login, logout };
};
