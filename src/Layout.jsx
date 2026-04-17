import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Layout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await base44.auth.getUser();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await base44.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="font-bold text-lg">
            OCM
          </Link>

          <div className="flex items-center gap-3">
            <Link to={createPageUrl('Home')}>
              <Button variant="ghost">Accueil</Button>
            </Link>
            <Link to={createPageUrl('League')}>
              <Button variant="ghost">Classement</Button>
            </Link>
            <Link to={createPageUrl('TransferMarket')}>
              <Button variant="ghost">Mercato</Button>
            </Link>
            <Link to={createPageUrl('Community')}>
              <Button variant="ghost">Communauté</Button>
            </Link>
            <Link to={createPageUrl('Informations')}>
              <Button variant="ghost">Informations</Button>
            </Link>

            {user ? (
              <Button onClick={handleLogout} variant="outline">
                Déconnexion
              </Button>
            ) : null}
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}
