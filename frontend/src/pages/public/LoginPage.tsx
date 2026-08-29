import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Lock, Mail, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sarah.jenkins@capacita.ai');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'manager' | 'employee'>('manager');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password, role });
      if (role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (selectedRole: 'manager' | 'employee') => {
    setIsLoading(true);
    try {
      const demoEmail = selectedRole === 'manager' ? 'sarah.jenkins@capacita.ai' : 'alex.rivera@capacita.ai';
      await login({ email: demoEmail, password: 'password123', role: selectedRole });
      if (selectedRole === 'manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 flex justify-center items-center font-sans grid-bg">
      <div className="w-full max-w-md bg-white architectural-border p-8 shadow-lg relative">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl font-bold text-[#141a32] mb-2">
            Capacita.ai
          </div>
          <p className="text-xs uppercase tracking-widest text-[#76767e]">
            Operations & Capacity Control Portal
          </p>
        </div>

        {/* Quick 1-Click Demo Login Banner */}
        <div className="mb-6 p-4 bg-[#f6f3f2] border border-[#141a32]/15">
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#76767e] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#497cff]" />
            <span>Instant Demo Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleQuickDemoLogin('manager')}
              disabled={isLoading}
            >
              Sign In as Manager
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleQuickDemoLogin('employee')}
              disabled={isLoading}
            >
              Sign In as Employee
            </Button>
          </div>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#141a32]/10" />
          </div>
          <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-[#76767e]">
            Or Standard Credentials
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Portal Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole('manager');
                  setEmail('sarah.jenkins@capacita.ai');
                }}
                className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  role === 'manager'
                    ? 'bg-[#141a32] text-white border-[#141a32]'
                    : 'bg-white text-[#46464d] border-[#141a32]/20'
                }`}
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('employee');
                  setEmail('alex.rivera@capacita.ai');
                }}
                className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  role === 'employee'
                    ? 'bg-[#141a32] text-white border-[#141a32]'
                    : 'bg-white text-[#46464d] border-[#141a32]/20'
                }`}
              >
                Employee
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#76767e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#76767e] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="md"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Authenticate & Launch
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#141a32]/10 text-center text-xs text-[#76767e]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#497cff] font-semibold hover:underline">
            Register new pod
          </Link>
        </div>
      </div>
    </div>
  );
};
