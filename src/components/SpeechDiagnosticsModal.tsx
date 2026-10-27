import React, { useState, useEffect } from 'react';
import { Volume2, X, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface SpeechDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeechDiagnosticsModal: React.FC<SpeechDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Check browser support
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      // Check voices
      const voices = window.speechSynthesis.getVoices();
      setVoicesLoaded(voices.length > 0);

      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoicesLoaded(window.speechSynthesis.getVoices().length > 0);
        };
      }
    } else {
      setErrorMessage('Browser does not support Speech Synthesis API.');
    }
  }, [isOpen]);

  const runPingTest = () => {
    if (!isSupported) return;
    setTestStatus('testing');
    setErrorMessage(null);

    const utterance = new SpeechSynthesisUtterance('ping');
    utterance.volume = 0.1; // Very quiet ping

    utterance.onend = () => {
      setTestStatus('success');
    };

    utterance.onerror = (event) => {
      setTestStatus('error');
      setErrorMessage(`Test failed: ${event.error || 'Unknown error'}`);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setTestStatus('error');
      setErrorMessage('Could not initialize speech synthesis.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col" dir="ltr">
        <div className="bg-stone-100 dark:bg-stone-800 p-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-600" />
            Speech Diagnostics
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm">
            {isSupported ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
            <span>Browser Support: {isSupported ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {voicesLoaded ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />}
            <span>Voices Loaded: {voicesLoaded ? 'Yes' : 'Loading...'}</span>
          </div>

          {errorMessage && (
            <div className="p-2 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs rounded-lg border border-red-200 dark:border-red-900">
              {errorMessage}
            </div>
          )}

          <button
            onClick={runPingTest}
            disabled={testStatus === 'testing' || !voicesLoaded}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
          >
            {testStatus === 'testing' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {testStatus === 'idle' ? 'Run Audio Ping Test' : testStatus === 'testing' ? 'Testing...' : 'Test Again'}
          </button>
          
          {testStatus === 'success' && (
            <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              Audio test successful.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
