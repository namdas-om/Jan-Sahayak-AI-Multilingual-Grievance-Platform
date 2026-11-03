import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, UserPlus, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleName } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoLogins, setShowDemoLogins] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/citizen/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: RoleName) => {
    loginWithDemo(role);
    if (role === 'system_admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'department_head' || role === 'department_officer') navigate('/department/dashboard', { replace: true });
    else navigate('/citizen/dashboard', { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-govblue-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            JS
          </div>
          <h1 className="text-2xl font-extrabold text-navy-800">Sign In to JanSahayak AI</h1>
          <p className="text-xs text-mutedtext">Access your public grievance services or officer workbench</p>
        </div>

        {/* Primary Citizen Action Callout: Create Account */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-navy-900 block">New Citizen?</span>
            <p className="text-[11px] text-slate-600">Create an account to lodge & track public grievances</p>
          </div>
          <Link
            to="/register"
            className="flex items-center gap-1.5 bg-saffron-500 hover:bg-saffron-600 text-navy-900 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-sm flex-shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </Link>
        </div>

        {/* Standard Sign In Form */}
        <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-govborder shadow-sm space-y-5">
          <div className="border-b border-govborder pb-3">
            <h2 className="text-sm font-bold text-navy-800">Citizen & Official Login</h2>
            <p className="text-xs text-mutedtext">Enter your registered email and password</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-navy-800">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-govborder focus:outline-none focus:ring-2 focus:ring-govblue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-navy-800">Password</label>
                <Link to="/forgot-password" className="text-govblue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-govborder focus:outline-none focus:ring-2 focus:ring-govblue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-govblue-600 hover:bg-govblue-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-mutedtext">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-govblue-600 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Secondary: Evaluator / Demo Role Testing Card (Placed at the bottom) */}
        <div className="bg-surface p-4 rounded-2xl border border-dashed border-slate-300 shadow-sm space-y-3">
          <button
            type="button"
            onClick={() => setShowDemoLogins(!showDemoLogins)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-navy-900 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-govblue-600" />
              <span>Hackathon Evaluator / Demo Quick Switch</span>
            </div>
            {showDemoLogins ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showDemoLogins && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] text-mutedtext">Click any role to test instant authenticated workflows:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleDemoLogin('citizen')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-govblue-500 text-slate-700 font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Citizen (Sample)</span>
                  <span className="text-[10px] text-govblue-600 font-bold">&rarr;</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('department_officer')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-govblue-500 text-slate-700 font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Field Officer</span>
                  <span className="text-[10px] text-govblue-600 font-bold">&rarr;</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('department_head')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-govblue-500 text-slate-700 font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>Dept Head</span>
                  <span className="text-[10px] text-govblue-600 font-bold">&rarr;</span>
                </button>
                <button
                  onClick={() => handleDemoLogin('system_admin')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-govblue-500 text-slate-700 font-semibold text-left transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>System Admin</span>
                  <span className="text-[10px] text-govblue-600 font-bold">&rarr;</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
