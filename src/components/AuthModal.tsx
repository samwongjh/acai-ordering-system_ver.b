import { useEffect, useState, type FormEvent } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { MemberAccount } from '../types.ts';
import { signIn as ptSignIn, signUp as ptSignUp, track } from '../pt.ts';
import {
  findOrCreateMemberByEmail,
  loginDemoMember,
  upsertMemberProfile,
} from '../data/localStore.ts';

interface AuthModalProps {
  open: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (member: MemberAccount, token: string) => void;
}

export function AuthModal({
  open,
  initialTab = 'login',
  onClose,
  onAuthSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setError('');
    }
  }, [open, initialTab]);

  if (!open) return null;

  const handleDemo = () => {
    setError('');
    const demoMember = loginDemoMember();
    onAuthSuccess(demoMember, 'local_demo');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (tab === 'login') {
        const cleanId = identifier.trim();
        if (
          cleanId.toLowerCase() === 'tessa.tan@bellytribe.sg' ||
          cleanId.replace(/\s+/g, '') === '+6591234567'
        ) {
          const demoMember = loginDemoMember();
          onAuthSuccess(demoMember, 'local_demo');
          onClose();
          return;
        }
        const user = await ptSignIn(cleanId, password);
        const profile = findOrCreateMemberByEmail(user.email, user.id);
        onAuthSuccess(profile, user.id);
        onClose();
      } else {
        const user = await ptSignUp(email.trim(), password);
        const profile = upsertMemberProfile({
          id: user.id,
          name: name.trim(),
          email: user.email,
          phone: phone.trim(),
        });
        track('goal_complete', { source: 'auth_modal_register' });
        onAuthSuccess(profile, user.id);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Member sign in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5B2378]">Belly Tribe</p>
            <h2 className="font-display text-xl font-bold text-[#1C1523]">
              {tab === 'login' ? 'Member Sign In' : 'Join Belly Tribe'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#1C1523] hover:bg-[#F3EFEA] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleDemo}
          className="w-full h-11 rounded-xl bg-[#5B2378]/10 hover:bg-[#5B2378]/15 border border-[#5B2378]/25 text-xs font-semibold text-[#5B2378] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>1-Tap Demo Member (Tessa Tan · 420 pts)</span>
        </button>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#FAF9F7] border border-[#1C1523]/8">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`h-9 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'login' ? 'bg-white text-[#1C1523] shadow-sm' : 'text-[#665E6E]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`h-9 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'register' ? 'bg-white text-[#1C1523] shadow-sm' : 'text-[#665E6E]'
            }`}
          >
            Register (+150 pts)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full h-11 px-3.5 rounded-xl border border-[#1C1523]/12 text-sm focus:outline-none focus:border-[#5B2378]"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile (+65 9XXX XXXX)"
                className="w-full h-11 px-3.5 rounded-xl border border-[#1C1523]/12 text-sm focus:outline-none focus:border-[#5B2378]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full h-11 px-3.5 rounded-xl border border-[#1C1523]/12 text-sm focus:outline-none focus:border-[#5B2378]"
              />
            </>
          )}
          {tab === 'login' && (
            <input
              type="email"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email address"
              className="w-full h-11 px-3.5 rounded-xl border border-[#1C1523]/12 text-sm focus:outline-none focus:border-[#5B2378]"
            />
          )}
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="w-full h-11 px-3.5 rounded-xl border border-[#1C1523]/12 text-sm focus:outline-none focus:border-[#5B2378]"
          />

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#1C1523] hover:bg-[#5B2378] text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
