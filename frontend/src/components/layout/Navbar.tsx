import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCapacity } from '../../context/CapacityContext';
import { Button } from '../ui/Button';
import { 
  Bot, 
  Layers, 
  CheckSquare, 
  Clock, 
  Menu, 
  X, 
  RefreshCw, 
  UserCheck, 
  LogOut,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, switchRole, logout } = useAuth();
  const { resetToInitialDemoState } = useCapacity();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';
  const isPublicPage = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

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

  const handleRoleToggle = (targetRole: 'manager' | 'employee') => {
    switchRole(targetRole);
    setRoleMenuOpen(false);
    if (targetRole === 'manager') {
      navigate('/manager');
    } else {
      navigate('/employee');
    }
  };

  const handleResetDemo = () => {
    resetToInitialDemoState();
    setRoleMenuOpen(false);
  };

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

          {/* Role badge switcher in header for instant demo navigation */}
          {isAuthenticated && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 border border-[#141a32]/20 px-3 py-1 bg-[#ffffff] hover:bg-[#f6f3f2] transition-colors text-xs font-sans uppercase tracking-wider font-semibold text-[#141a32]"
              >
                <span className="w-2 h-2 rounded-full bg-[#497cff]" />
                <span>Role: {user?.role === 'manager' ? 'Manager (Sarah)' : 'Employee (Alex)'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#76767e]" />
              </button>

              {roleMenuOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-[#ffffff] architectural-border shadow-xl z-50 p-2 font-sans animate-in fade-in">
                  <div className="text-[10px] uppercase font-bold text-[#76767e] px-2 py-1 tracking-wider border-b border-[#141a32]/10 mb-1">
                    Demo Role Switcher
                  </div>
                  <button
                    onClick={() => handleRoleToggle('manager')}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#f0eded] transition-colors',
                      isManager ? 'font-bold text-[#141a32] bg-[#f6f3f2]' : 'text-[#46464d]'
                    )}
                  >
                    <span>Manager Portal (Sarah)</span>
                    {isManager && <UserCheck className="w-3.5 h-3.5 text-[#497cff]" />}
                  </button>
                  <button
                    onClick={() => handleRoleToggle('employee')}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#f0eded] transition-colors',
                      isEmployee ? 'font-bold text-[#141a32] bg-[#f6f3f2]' : 'text-[#46464d]'
                    )}
                  >
                    <span>Employee Portal (Alex)</span>
                    {isEmployee && <UserCheck className="w-3.5 h-3.5 text-[#497cff]" />}
                  </button>
                  <div className="border-t border-[#141a32]/10 my-1" />
                  <button
                    onClick={handleResetDemo}
                    className="w-full text-left px-3 py-2 text-xs text-[#46464d] hover:bg-[#ffdad6]/40 hover:text-[#ba1a1a] transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Demo Scenario (Overload)</span>
                  </button>
                </div>
              )}
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
              {isManager ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/manager/agent')}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  AI Rebalance
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/employee/tasks/new')}
                >
                  + Add Task
                </Button>
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
                Launch Demo
              </Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={() => handleRoleToggle(isManager ? 'employee' : 'manager')}
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
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant={isManager ? 'primary' : 'outline'}
                    onClick={() => { handleRoleToggle('manager'); setMobileMenuOpen(false); }}
                  >
                    Manager View
                  </Button>
                  <Button
                    size="sm"
                    variant={isEmployee ? 'primary' : 'outline'}
                    onClick={() => { handleRoleToggle('employee'); setMobileMenuOpen(false); }}
                  >
                    Employee View
                  </Button>
                </div>
              </div>

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

              <div className="pt-2 flex justify-between items-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { handleResetDemo(); setMobileMenuOpen(false); }}
                >
                  Reset Demo Scenario
                </Button>
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
                <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Sign In / Launch Demo</Button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
