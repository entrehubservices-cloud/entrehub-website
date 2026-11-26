"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Send, Check } from "lucide-react";
import { submitContactForm } from "@/lib/api/client";
import { contactInquiryTypes } from "@/lib/validations/contact";

interface MessageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInquiryType?: string;
}

export default function MessageFormModal({
  isOpen,
  onClose,
  initialInquiryType,
}: MessageFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: initialInquiryType || "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && initialInquiryType) {
      setFormData((prev) => ({
        ...prev,
        inquiryType: initialInquiryType,
      }));
    }
  }, [isOpen, initialInquiryType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      await submitContactForm(formData);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        inquiryType: "",
        message: "",
      });

      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
      }, 2000);
    } catch (error: unknown) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    if (submitStatus === "error") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-navy-deep/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[110] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl bg-white shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <Dialog.Close
            aria-label="Close"
            disabled={isSubmitting}
            className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Dialog.Close>

          <div className="grid md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative hidden bg-navy-deep p-7 md:flex md:flex-col md:justify-center">
              <div className="relative z-10">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                  ENTREHUB SERVICES LTD
                </p>
                <p className="text-2xl font-bold text-white mb-3">
                  Let&apos;s Connect
                </p>
                <p className="text-sm leading-6 text-slate-300 mb-5">
                  Share your project scope, RFP, or request our Corporate Profile &amp; Capability Statement.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-400" aria-hidden="true" />
                    Prompt executive response
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-400" aria-hidden="true" />
                    Clear SOW &amp; governance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-400" aria-hidden="true" />
                    Global remote &amp; on-site delivery
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <Dialog.Title className="text-xl font-bold text-slate-900 mb-1 pr-8">
                Send us a message
              </Dialog.Title>
              <p className="mb-4 text-xs text-slate-600">
                Fields marked <span aria-hidden="true">*</span>
                <span className="sr-only">with an asterisk</span> are required.
              </p>

              <div role="status" aria-live="polite">
                {submitStatus === "success" && (
                  <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-semibold">
                      Message sent successfully!
                    </p>
                    <p className="text-green-700 text-xs">
                      Our team at ENTREHUB SERVICES LTD will respond shortly.
                    </p>
                  </div>
                )}
              </div>
              <div role="alert">
                {submitStatus === "error" && (
                  <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="modal-name"
                      className="block text-xs font-medium text-slate-800 mb-1"
                    >
                      Name{" "}
                      <span className="text-red-700" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full min-h-11 px-3 py-2 text-base rounded-lg border border-slate-400 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-100"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-email"
                      className="block text-xs font-medium text-slate-800 mb-1"
                    >
                      Email{" "}
                      <span className="text-red-700" aria-hidden="true">*</span>
                    </label>
                    <input
                      type="email"
                      id="modal-email"
                      name="email"
                      autoComplete="email"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full min-h-11 px-3 py-2 text-base rounded-lg border border-slate-400 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-100"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="modal-company"
                      className="block text-xs font-medium text-slate-800 mb-1"
                    >
                      Company / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      id="modal-company"
                      name="company"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full min-h-11 px-3 py-2 text-base rounded-lg border border-slate-400 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-100"
                      placeholder="Organisation name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="modal-phone"
                      className="block text-xs font-medium text-slate-800 mb-1"
                    >
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      id="modal-phone"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full min-h-11 px-3 py-2 text-base rounded-lg border border-slate-400 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-100"
                      placeholder="+234..."
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-inquiryType"
                    className="block text-xs font-medium text-slate-800 mb-1"
                  >
                    Project / Inquiry Type (Optional)
                  </label>
                  <select
                    id="modal-inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full min-h-11 px-3 py-2 text-base rounded-lg border border-slate-400 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:bg-gray-100"
                  >
                    <option value="">Select an inquiry type…</option>
                    {contactInquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="modal-message"
                    className="block text-xs font-medium text-slate-800 mb-1"
                  >
                    Message{" "}
                    <span className="text-red-700" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="modal-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={3}
                    className="w-full px-3 py-2 text-base rounded-lg border border-slate-400 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy resize-y disabled:bg-gray-100"
                    placeholder="Tell us about your project, scope, or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-11 bg-navy text-white text-sm font-semibold py-2.5 px-6 rounded-lg hover:bg-navy-hover transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
