export type ContactMethod = 'phone' | 'whatsapp';

type EnquiryEvent = 'generate_lead' | 'phone_click' | 'whatsapp_click';

declare global {
  interface Window {
    gtag?: (command: 'event', name: EnquiryEvent, parameters: Record<string, string>) => void;
  }
}

/** Send only fixed labels, never visitor details, form values or destination URLs. */
function sendEnquiryEvent(name: EnquiryEvent, method: string) {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return;
  try {
    window.gtag?.('event', name, {
      send_to: 'G-9C76MQETJS',
      contact_method: method,
      transport_type: 'beacon',
    });
  } catch {
    // Analytics must never interrupt an enquiry or navigation.
  }
}

export function trackConfirmedEnquiry() {
  sendEnquiryEvent('generate_lead', 'contact_form');
}

export function contactMethodFromHref(href: string): ContactMethod | null {
  if (/^tel:/i.test(href)) return 'phone';
  try {
    const url = new URL(href);
    if (url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com'].includes(url.hostname)) return 'whatsapp';
  } catch {
    // Relative links and ordinary buttons are not contact attempts.
  }
  return null;
}

export function trackContactClick(method: ContactMethod) {
  sendEnquiryEvent(method === 'phone' ? 'phone_click' : 'whatsapp_click', method);
}
