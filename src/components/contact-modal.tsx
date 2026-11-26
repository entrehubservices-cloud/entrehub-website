'use client';

import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import MessageFormModal from './message-form-modal';
import CopyableEmail from './copyable-email';
import { companyEmail, companyPhoneDisplay } from '@/lib/seo';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInquiryType?: string;
}

const whatsappNumber = '+2348129721560';
const whatsappMessage =
  "Hello ENTREHUB! I'd like to discuss a project or enquiry with ENTREHUB SERVICES LTD.";
const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

export default function ContactModal({
  isOpen,
  onClose,
  initialInquiryType,
}: ContactModalProps) {
  const [showMessageForm, setShowMessageForm] = useState(false);

  useEffect(() => {
    if (isOpen && initialInquiryType) {
      setShowMessageForm(true);
    } else if (!isOpen) {
      setShowMessageForm(false);
    }
  }, [isOpen, initialInquiryType]);

  const closeAll = () => {
    setShowMessageForm(false);
    onClose();
  };

  return (
    <>
      <Dialog.Root open={isOpen && !showMessageForm} onOpenChange={(open) => !open && closeAll()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-navy-deep/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
            <Dialog.Close
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>

            <div className="p-5 pb-3 sm:px-6 sm:pt-5 sm:pb-3">
              <div className="mb-2.5 flex items-center gap-3 pr-8">
                <span className="h-9 w-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200">
                  <Image src="/images/logo.jpeg" alt="" width={36} height={36} className="h-full w-full object-cover" />
                </span>
                <div>
                  <Dialog.Title className="text-lg font-bold leading-tight text-slate-900">
                    Contact ENTREHUB
                  </Dialog.Title>
                  <p className="text-xs text-slate-500">ENTREHUB SERVICES LTD · RC 10030133</p>
                </div>
              </div>
              <Dialog.Description className="text-sm leading-relaxed text-slate-600">
                Discuss enterprise ICT, custom software, digital growth, or request our Corporate Profile.
              </Dialog.Description>
            </div>

            <ul className="space-y-2.5 px-5 sm:px-6">
              <li>
                <a
                  href="tel:+2348129721560"
                  className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3 transition-colors hover:border-navy/25 hover:bg-navy-tint/60"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-tint text-navy" aria-hidden="true">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="text-sm">
                    <span className="block text-xs font-medium text-slate-500">Phone</span>
                    <span className="block font-semibold text-slate-900">{companyPhoneDisplay}</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-tint text-navy" aria-hidden="true">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <span className="block text-xs font-medium text-slate-500">Email</span>
                  <CopyableEmail email={companyEmail} />
                </div>
              </li>
              <li className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-tint text-navy" aria-hidden="true">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="text-sm">
                  <span className="block text-xs font-medium text-slate-500">Global Digital Delivery</span>
                  <span className="block font-semibold text-slate-900">
                    Nigeria Office: M4 Tonjos Plaza, Kachia Road, Kaduna
                  </span>
                </span>
              </li>
            </ul>

            <div className="space-y-2.5 p-5 pt-4 sm:px-6 sm:pb-5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-800"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Chat on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setShowMessageForm(true)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-navy-hover"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Send a message
                </button>
              </div>

              <p className="pt-0.5 text-center text-xs text-slate-600">
                Business hours: Monday–Friday, 9am–5pm (WAT).
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <MessageFormModal
        isOpen={isOpen && showMessageForm}
        onClose={closeAll}
        initialInquiryType={initialInquiryType}
      />
    </>
  );
}
