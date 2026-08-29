import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';

export const SignupPage: React.FC = () => {
  const { signup, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('manager');
  const [team_name, setTeamName] = useState('Alpha Engineering');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'manager') {
        navigate('/manager', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signup({ name, email, role, team_name: team_name });
      if (role === 'manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="py-16 md:py-24 px-4 flex justify-center items-center font-sans grid-bg">
      <div className="w-full max-w-md bg-white architectural-border p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="font-serif text-3xl font-bold text-[#141a32] mb-2">
            Register Organization
          </div>
          <p className="text-xs uppercase tracking-widest text-[#76767e]">
            Deploy Capacita.ai Capacity Telemetry
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah.jenkins@company.com"
              className="w-full px-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Team / Pod Name
            </label>
            <input
              type="text"
              required
              value={team_name}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Alpha Engineering"
              className="w-full px-3 py-2 text-sm border border-[#141a32]/25 focus:outline-none focus:border-[#497cff]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-[#76767e] mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-sm border border-[#141a32]/25 bg-white focus:outline-none focus:border-[#497cff]"
            >
              <option value="manager">Engineering Manager / Lead</option>
              <option value="employee">Individual Contributor / Engineer</option>
            </select>
          </div>

          <Button
            type="submit"
            size="md"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Create Pod & Launch
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#141a32]/10 text-center text-xs text-[#76767e]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#497cff] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
