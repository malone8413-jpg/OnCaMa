import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Trophy,
  ArrowRightLeft,
  Shield,
  Users,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Crown,
  Swords,
  Bell,
  TicketIcon,
  Info,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ErrorBoundary from '@/components/ErrorBoundary';

const staffRoles = [
  'owner',
  'admin',
  'staff_mercato',
  'staff_annonces',
  'staff_championnat',
  'staff_developpement',
  'staff_formation',
];

const navItems = [
  { name: 'Accueil', page: 'Home', icon: Home },
  { name: 'Classement', page: 'League', icon: Trophy },
  { name: 'Mercato', page: 'TransferMarket', icon: ArrowRightLeft },
  { name: 'Communauté', page: 'Community', icon: Users },
  { name: 'Mon Club', page: 'ClubSpace', icon: Shield, clubOnly: true },
  { name: 'Tactiques', page: 'Tactics', icon: Swords, clubOnly: true },
  { name: 'Staff', page: 'StaffRoom', icon: Crown, staffOnly: true },
  { name: 'Informations', page: 'Informations', icon: Info },
  { name: 'Notifications', page: 'Notifications', icon: Bell, authOnly: true },
  { name: 'Support', page: 'Support', icon: TicketIcon, authOnly: true },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthBox, setShowAuthBox] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

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
  }, [currentPageName]);

  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      const { data, error } = await base44.auth.signIn(email, password);

      if (error) {
        alert(error.message);
        return;
      }

      setUser(data?.user ?? null);
      setShowAuthBox(false);
      setEmail('');
      setPassword('');
    } catch (e) {
      alert("Erreur lors de la connexion");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setAuthLoading(true);
      const { data, error } = await base44.auth.signUp(email, password);

      if (error) {
        alert(error.message);
        return;
      }

      alert("Compte créé avec succès");
      setUser(data?.user ?? null);
      setShowAuthBox(false);
      setEmail('');
      setPassword('');
    } catch (e) {
      alert("Erreur lors de la création du compte");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await base44.auth.signOut();
    } catch (e) {
      console.error(e);
    }

    setUser(null);
    setShowAuthBox(false);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img
                  src="https://media.base44.com/images/public/69790b43349a3dc5b9facd93/23515486b_IMG_3759.jpeg"
                  alt="OCM"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">
                OCM
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems
                .filter((item) => {
                  if (item.staffOnly) return staffRoles.includes(user?.role);
                  if (item.clubOnly) return !!(user?.has_selected_club || user?.club_id);
                  if (item.authOnly) return !!user;
                  return true;
                })
                .map((item) => {
                  const isActive = currentPageName === item.page;

                  return (
                    <Link key={item.page} to={createPageUrl(item.page)}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-4 h-4 mr-1" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <NotificationBell userId={user.id} />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-slate-400">
                        <User className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">
                          {user.full_name || user.email || 'Mon compte'}
                        </span>
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                      <DropdownMenuItem className="text-slate-400 focus:bg-slate-700">
                        <User className="w-4 h-4 mr-2" />
                        {user.email}
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="bg-slate-700" />

                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthBox(!showAuthBox)}
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Connexion
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAuthBox && !user && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border-t border-slate-800 bg-slate-900"
            >
              <div className="max-w-md mx-auto p-4 space-y-3">
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2 outline-none"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 text-white px-3 py-2 outline-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleLogin}
                    disabled={authLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    {authLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                  <Button
                    onClick={handleSignup}
                    disabled={authLoading}
                    variant="outline"
                    className="border-slate-600 text-white"
                  >
                    Créer un compte
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-800 bg-slate-900"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems
                  .filter((item) => {
                    if (item.staffOnly) return staffRoles.includes(user?.role);
                    if (item.clubOnly) return !!(user?.has_selected_club || user?.club_id);
                    if (item.authOnly) return !!user;
                    return true;
                  })
                  .map((item) => {
                    const isActive = currentPageName === item.page;

                    return (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.name}
                        </Button>
                      </Link>
                    );
                  })}

                {!user && (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowAuthBox(!showAuthBox);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Connexion
                  </Button>
                )}

                {user && (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        <ErrorBoundary key={currentPageName}>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}