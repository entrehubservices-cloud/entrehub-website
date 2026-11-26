'use client';

import { useId, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { companyEmail } from '@/lib/seo';

let lastAnnouncedMessage = '';

interface CopyableEmailProps {
  email?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export default function CopyableEmail({
  email = companyEmail,
  variant = 'light',
  className = '',
}: CopyableEmailProps) {
  const targetId = useId();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [statusText, setStatusText] = useState('');

  const report = (ok: boolean) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    let message = ok ? 'Copied' : 'Copy failed';
    if (message === lastAnnouncedMessage) {
      message += '\u00A0';
    }
    lastAnnouncedMessage = message;

    setCopyState(ok ? 'copied' : 'failed');
    setStatusText('');
    requestAnimationFrame(() => setStatusText(message));

    timerRef.current = setTimeout(() => {
      setCopyState('idle');
      setStatusText('');
    }, 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      report(true);
    } catch {
      try {
        const previousFocus = document.activeElement as HTMLElement | null;
        const field = Object.assign(document.createElement('textarea'), { value: email });
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
        document.body.append(field);
        field.select();
        const ok = document.execCommand('copy');
        field.remove();
        previousFocus?.focus({ preventScroll: true });
        report(ok);
      } catch {
        report(false);
      }
    }
  };

  const linkStyles =
    variant === 'dark'
      ? 'text-slate-200 underline underline-offset-4 transition-colors hover:text-white'
      : 'font-semibold text-navy underline underline-offset-4 transition-colors hover:text-navy-hover';

  const buttonStyles =
    variant === 'dark'
      ? 'border-white/20 bg-white/10 text-slate-200 hover:border-amber-300/60 hover:bg-white/15 hover:text-amber-300'
      : 'border-slate-300 bg-slate-50 text-slate-700 hover:border-navy/40 hover:bg-navy-tint hover:text-navy';

  const statusStyles =
    variant === 'dark'
      ? 'text-amber-300'
      : copyState === 'failed'
        ? 'text-red-700'
        : 'text-emerald-700';

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 align-baseline ${className}`}>
      <a id={targetId} href={`mailto:${email}`} className={linkStyles}>
        {email}
      </a>
      <span className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy email address ${email}`}
          data-copied={copyState === 'copied' ? '' : undefined}
          data-failed={copyState === 'failed' ? '' : undefined}
          className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border px-1.5 py-1 text-xs transition ${buttonStyles}`}
        >
          {copyState === 'copied' ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
        <span
          role="status"
          className={`text-xs font-medium transition-opacity duration-150 ${statusStyles} ${
            statusText ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {statusText}
        </span>
      </span>
    </span>
  );
}
