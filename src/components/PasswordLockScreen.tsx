import React, { useState } from 'react';
import { Lock, KeyRound, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PasswordLockScreenProps {
  onUnlock: () => void;
}

export const PasswordLockScreen: React.FC<PasswordLockScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = password.trim().toLowerCase();
    // Required password by user request: "sir thawa"
    if (cleanInput === 'sir thawa' || cleanInput === 'sirthawa') {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-amber-950 via-stone-900 to-amber-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className={`relative w-full max-w-md bg-amber-50 dark:bg-stone-900 rounded-3xl shadow-2xl border-2 border-amber-400 dark:border-stone-700 p-6 sm:p-8 space-y-6 text-center transition-all ${shake ? 'animate-bounce' : ''}`}>
        {/* Top Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-800 text-amber-300 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 dark:bg-stone-800 text-amber-950 dark:text-amber-300 text-xs font-bold font-arabic shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>بوابة الحماية والدخول الآمن</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-amber-950 dark:text-stone-100 font-arabic">
            المرجو إدخال كلمة المرور للولوج للمنصة
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-arabic">
            المنصة التعليمية الخاصة بمقرر الأولى باكالوريا (علبة العجائب وأنتيجون)
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-right">
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-arabic text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>كلمة المرور السرية:</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="اكتب كلمة المرور هنا..."
              autoFocus
              className="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-stone-800 border-2 border-amber-300 dark:border-stone-700 text-stone-900 dark:text-white font-arabic focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all text-center tracking-wider"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-arabic text-center font-bold animate-shake">
              ❌ كلمة المرور غير صحيحة! (تلميح: sir thawa)
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold font-arabic shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>دخول للمنصة</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </form>

        <div className="pt-2 border-t border-amber-200 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 font-serif">
          Programme Officiel 1ère Bac Maroc · Accès Sécurisé
        </div>
      </div>
    </div>
  );
};
