'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

export const COOKIE_CONSENT_KEY = 'entrehub_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'entrehub:cookie-consent-updated';

export type CookieConsentChoice = 'accepted' | 'essential';

export function getSavedCookieConsent(): CookieConsentChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    if (raw === 'accepted' || raw === 'essential') return raw;
  } catch {
    // Ignore storage access errors in restricted browsing modes
  }
  return null;
}

export function saveCookieConsent(choice: CookieConsentChoice) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: choice }));
  } catch {
    // Ignore storage write errors
  }
}

export function clearCookieConsent() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: null }));
  } catch {
    // Ignore storage errors
  }
}

export default function CookieConsentManager() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<CookieConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(getSavedCookieConsent());
    setHydrated(true);

    const onConsentChange = () => {
      setConsent(getSavedCookieConsent());
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
    window.addEventListener('storage', onConsentChange);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
      window.removeEventListener('storage', onConsentChange);
    };
  }, []);

  const isAdminRoute = pathname?.startsWith('/admin');
  const showBanner = hydrated && consent === null && !isAdminRoute;

  return (
    <>
      {consent === 'accepted' && !isAdminRoute && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-9C76MQETJS"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9C76MQETJS', { anonymize_ip: true });
            `}
          </Script>

          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '836073725799438');
              fbq('track', 'PageView');
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <aside
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-700 sm:text-sm">
              <strong>ENTREHUB SERVICES LTD</strong> uses essential cookies to operate this website and, with your consent, analytics cookies (Google Analytics and Meta Pixel) to measure site visits. Read our{' '}
              <Link href="/cookies" className="font-semibold text-navy underline underline-offset-2">
                Cookie Notice
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-semibold text-navy underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => saveCookieConsent('essential')}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 sm:text-sm"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => saveCookieConsent('accepted')}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-navy px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-navy-hover sm:text-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
