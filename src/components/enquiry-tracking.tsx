"use client";

import { useEffect } from 'react';
import { contactMethodFromHref, trackContactClick } from '@/lib/analytics';

export default function EnquiryTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;
      const method = contactMethodFromHref(link.href);
      if (method) trackContactClick(method);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
