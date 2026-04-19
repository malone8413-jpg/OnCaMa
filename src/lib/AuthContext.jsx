import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

const OWNER_EMAIL = 'malone8413@gmail.com';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState({ id: 'oncama', public_settings: {} });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    }, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
      }
    }).catch(() => {
      clearTimeout(timeout);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUser) => {
    try {
      setIsLoadingAuth(true);
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!existingProfile) {
        const isOwner = authUser.email === OWNER_EMAIL;
        const newProfile = {
          id: authUser.id,
          email: authUser.email,
          role: isOwner ? 'owner' : 'user',
          has_selected_club: false,
          last_seen: new Date().toISOString(),
          created_date: new Date().toISOString(),
        };
        await supabase.from('users').insert(newProfile);
        setUser({ ...authUser, ...newProfile });
        setIsAuthenticated(true);
        return;
      }

      const updates = { last_seen: new Date().toISOString() };
      if (authUser.email === OWNER_EMAIL && existingProfile.role !== 'owner') {
        updates.role = 'owner';
      }
      await supabase.from('users').update(updates).eq('id', authUser.id);
      setUser({ ...authUser, ...existingProfile, ...updates });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUser(authUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const checkAppState = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await loadUserProfile(session.user);
  };

  const logout = async (shouldRedirect = true) => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) window.location.href = '/';
  };

  const navigateToLogin = () => {
    window.location.href = '/#/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
