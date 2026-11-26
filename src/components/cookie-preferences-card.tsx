'use client';

import { useEffect, useState } from 'react';
import {
  COOKIE_CONSENT_EVENT,
  clearCookieConsent,
  getSavedCookieConsent,
  saveCookieConsent,
  type CookieConsentChoice,
} from './cookie-consent';

export default function CookiePreferencesCard() {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);

  useEffect(() => {
    setChoice(getSavedCookieConsent());
    const sync = () => setChoice(getSavedCookieConsent());
    window.addEventListener(COOKIE_CONSENT_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const currentLabel =
    choice === 'accepted'
      ? 'All cookies accepted (Essential + Analytics)'
      : choice === 'essential'
        ? 'Essential cookies only (Analytics disabled)'
        : 'No selection saved yet (Analytics currently disabled)';

  return (
    <div className="not-prose my-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-lg font-bold text-slate-900">Manage Your Cookie Preferences</h2>
      <p className="mt-1 text-sm text-slate-600">
        Current setting: <strong className="text-slate-900">{currentLabel}</strong>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => saveCookieConsent('essential')}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Use Essential Only
        </button>
        <button
          type="button"
          onClick={() => saveCookieConsent('accepted')}
          className="inline-flex min-h-10 items-center justify-center rounded-xl bg-navy px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-hover"
        >
          Accept Analytics Cookies
        </button>
        {choice !== null && (
          <button
            type="button"
            onClick={() => clearCookieConsent()}
            className="inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-sm font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            Reset banner prompt
          </button>
        )}
      </div>
    </div>
  );
}
