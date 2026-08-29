import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Lock, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (isAuthenticated && user) navigate(user.role === 'manager' ? '/manager' : '/employee', { replace: true }); }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setIsLoading(true); setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.');
    } finally { setIsLoading(false); }
  };

  return <div className="py-16 md:py-24 px-4 flex justify-center items-center font-sans grid-bg"><div className="w-full max-w-md bg-white architectural-border p-8 shadow-lg"><div className="text-center mb-8"><div className="font-serif text-3xl font-bold text-[#141a32] mb-2">Capacita.ai</div><p className="text-xs uppercase tracking-widest text-[#76767e]">Operations & Capacity Control Portal</p></div>{error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">{error}</div>}<form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">Work Email</label><div className="relative"><Mail className="w-4 h-4 text-[#76767e] absolute left-3 top-1/2 -translate-y-1/2" /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]" /></div></div><div><label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">Password</label><div className="relative"><Lock className="w-4 h-4 text-[#76767e] absolute left-3 top-1/2 -translate-y-1/2" /><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]" /></div></div><Button type="submit" size="md" variant="primary" className="w-full mt-2" isLoading={isLoading}>Sign In</Button></form><div className="mt-6 pt-4 border-t border-[#141a32]/10 text-center text-xs text-[#76767e]">Don't have an account? <Link to="/signup" className="text-[#497cff] font-semibold hover:underline">Create an account</Link></div></div></div>;
};
