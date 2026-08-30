import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCapacity } from '../../context/CapacityContext';
import { agentService } from '../../services/agentService';
import { Button } from '../ui/Button';
import { 
  Menu, 
  X, 
  LogOut,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { bottlenecks } = useCapacity();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);

  const isManager = user?.role === 'manager';
  useEffect(() => {
    if (!isManager) {
      setAgentOnline(false);
      return;
    }

    let active = true;
    void agentService.getStatus()
      .then(({ online }) => { if (active) setAgentOnline(online); })
      .catch(() => { if (active) setAgentOnline(false); });

    return () => { active = false; };
  }, [isManager]);

  const managerLinks = [
    { name: 'Overview', path: '/manager' },
    { name: 'Team Capacity', path: '/manager/capacity' },
    { name: 'Tasks', path: '/manager/tasks' },
    { name: 'Overtime', path: '/manager/overtime' },
    { name: 'AI Agent', path: '/manager/agent', badge: 'AI' }
  ];

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee' },
    { name: 'My Tasks', path: '/employee/tasks' },
    { name: 'Overtime Request', path: '/employee/overtime' }
  ];

  const publicLinks = [
    { name: 'Solutions', path: '/#solutions' },
    { name: 'Architecture', path: '/#architecture' },
    { name: 'Insights', path: '/#insights' }
  ];

  return (
    <header className="bg-[#fcf9f8]/95 backdrop-blur-md sticky top-0 z-40 w-full border-b border-[#141a32]/15">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link 
            to={isAuthenticated ? (isManager ? '/manager' : '/employee') : '/'} 
            className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#141a32] hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span>Capacita.ai</span>
            <span className="text-[10px] font-sans font-semibold uppercase bg-[#141a32] text-white px-1.5 py-0.5 tracking-wider hidden sm:inline-block">
              OS
            </span>
          </Link>

          {/* Authenticated role indicator */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 border border-[#141a32]/20 px-3 py-1 bg-[#ffffff] text-xs font-sans uppercase tracking-wider font-semibold text-[#141a32]">
                <span className="w-2 h-2 rounded-full bg-[#497cff]" />
                <span>Role: {user?.role}</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-sans text-[13px] uppercase tracking-widest font-semibold">
          {isAuthenticated ? (
            isManager ? (
              managerLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'transition-colors py-1 relative flex items-center gap-1.5',
                      isActive 
                        ? 'text-[#141a32] border-b-2 border-[#141a32]' 
                        : 'text-[#46464d] hover:text-[#141a32]'
                    )}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="text-[9px] bg-[#497cff] text-white px-1.5 py-0.2 rounded-none tracking-wider font-bold">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })
            ) : (
              employeeLinks.map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      'transition-colors py-1 relative',
                      isActive 
                        ? 'text-[#141a32] border-b-2 border-[#141a32]' 
                        : 'text-[#46464d] hover:text-[#141a32]'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })
            )
          ) : (
            publicLinks.map(link => (
              <a
                key={link.name}
                href={link.path}
                className="text-[#46464d] hover:text-[#141a32] transition-colors py-1"
              >
                {link.name}
              </a>
            ))
          )}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isManager && bottlenecks.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(open => !open)}
                    title={`${bottlenecks.length} active bottleneck${bottlenecks.length === 1 ? '' : 's'}`}
                    aria-label={`${bottlenecks.length} active bottleneck${bottlenecks.length === 1 ? '' : 's'}`}
                    aria-expanded={notificationsOpen}
                    className="relative p-2 text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute -right-1 -top-1 min-w-4 h-4 px-1 rounded-full bg-[#ba1a1a] text-white text-[9px] font-bold leading-4 text-center">
                      {bottlenecks.length}
                    </span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#141a32]/15 shadow-xl z-50 p-3 font-sans">
                      <div className="flex items-center justify-between border-b border-[#141a32]/10 pb-2 mb-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-[#141a32]">Notifications</span>
                        <span className="text-[10px] text-[#ba1a1a] font-bold">{bottlenecks.length} ACTIVE</span>
                      </div>
                      <div className="space-y-2">
                        {bottlenecks.map(bottleneck => (
                          <button
                            key={bottleneck.id}
                            type="button"
                            onClick={() => { setNotificationsOpen(false); navigate('/manager/agent'); }}
                            className="w-full text-left p-2 bg-[#fff7f6] hover:bg-[#ffdad6]/50 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] mt-0.5 shrink-0" />
                              <span>
                                <span className="block text-xs font-bold text-[#141a32]">{bottleneck.title}</span>
                                <span className="block text-[10px] text-[#76767e] mt-0.5">{bottleneck.metric_impact}</span>
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => { setNotificationsOpen(false); navigate('/manager/agent'); }}
                        className="w-full mt-3 pt-2 border-t border-[#141a32]/10 text-[10px] uppercase tracking-wider font-bold text-[#497cff] text-left"
                      >
                        Review workload alerts →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isManager && (
                <Link
                  to="/manager/agent"
                  title={agentOnline ? 'AI agent online' : 'AI agent offline'}
                  className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#76767e] hover:text-[#141a32]"
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', agentOnline ? 'bg-green-500 animate-pulse' : 'bg-[#ba1a1a]')} />
                  <span>AGENT {agentOnline ? 'ONLINE' : 'OFFLINE'}</span>
                </Link>
              )}

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 text-[#76767e] hover:text-[#ba1a1a] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="font-sans text-[13px] uppercase tracking-widest font-semibold text-[#141a32] hover:text-[#497cff] transition-colors"
              >
                Sign In
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/login')}
              >
                Launch Workspace
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          {isAuthenticated && (
            <button
               onClick={() => navigate(isManager ? '/manager' : '/employee')}
              className="text-[11px] font-sans uppercase font-bold border border-[#141a32]/20 px-2.5 py-1 bg-white"
            >
              {isManager ? 'MGR' : 'EMP'}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#141a32]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#fcf9f8] architectural-border-b p-6 flex flex-col gap-4 font-sans uppercase text-sm font-semibold tracking-wider animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <>
              <div className="p-3 bg-[#ffffff] border border-[#141a32]/10 mb-2">
                <div className="text-[10px] text-[#76767e]">Signed in as:</div>
                <div className="font-bold text-[#141a32] lowercase">{user?.email}</div>
                <div className="mt-2 text-xs uppercase tracking-wider text-[#141a32]">Role: {user?.role}</div>
                {isManager && (
                  <Link
                    to="/manager/agent"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#76767e]"
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', agentOnline ? 'bg-green-500 animate-pulse' : 'bg-[#ba1a1a]')} />
                    <span>AGENT {agentOnline ? 'ONLINE' : 'OFFLINE'}</span>
                  </Link>
                )}
              </div>

              {isManager && bottlenecks.length > 0 && (
                <div className="border border-[#ba1a1a]/30 bg-[#fff7f6] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[#ba1a1a]">
                      <Bell className="w-4 h-4" />
                      <span className="text-[10px] tracking-widest">NOTIFICATIONS</span>
                    </div>
                    <span className="rounded-full bg-[#ba1a1a] text-white px-2 py-0.5 text-[10px]">
                      {bottlenecks.length} ACTIVE
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {bottlenecks.map(bottleneck => (
                      <button
                        key={bottleneck.id}
                        type="button"
                        onClick={() => { navigate('/manager/agent'); setMobileMenuOpen(false); }}
                        className="w-full text-left flex items-start gap-2 p-2 bg-white border border-[#ba1a1a]/15"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] mt-0.5 shrink-0" />
                        <span>
                          <span className="block text-xs font-bold text-[#141a32] normal-case tracking-normal">{bottleneck.title}</span>
                          <span className="block text-[10px] text-[#76767e] normal-case tracking-normal mt-0.5">{bottleneck.metric_impact}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(isManager ? managerLinks : employeeLinks).map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 border-b border-[#141a32]/10 text-[#141a32] flex items-center justify-between"
                >
                  <span>{link.name}</span>
                </Link>
              ))}

              <div className="pt-2 flex justify-end items-center">
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="text-xs text-[#ba1a1a] underline"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/#solutions" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#141a32]/10">Solutions</Link>
              <Link to="/#architecture" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#141a32]/10">Architecture</Link>
              <Link to="/#insights" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-[#141a32]/10">Insights</Link>
              <div className="pt-4 flex flex-col gap-2">
                 <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Sign In</Button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
