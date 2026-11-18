import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Toast() {
  const { toast, closeNotification } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-900/95 text-white border-emerald-500 shadow-emerald-950/20'
            : isError
            ? 'bg-rose-900/95 text-white border-rose-500 shadow-rose-950/20'
            : 'bg-slate-900/95 text-white border-slate-700'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
        </div>

        <div className="flex-1 pr-2">
          <p className="text-xs font-semibold tracking-wide uppercase text-emerald-300">
            {isSuccess ? 'Carbon Action Recorded' : isError ? 'Notification' : 'Notice'}
          </p>
          <p className="text-sm font-medium mt-0.5 leading-snug">{toast.message}</p>
        </div>

        <button
          onClick={closeNotification}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
