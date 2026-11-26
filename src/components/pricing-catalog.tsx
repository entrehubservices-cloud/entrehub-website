'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { pricingCategories, type PricingItem } from "@/lib/pricing";

const ALLOWED_FIAT_CURRENCIES = [
  { iso_code: "USD", name: "US Dollar" },
  { iso_code: "NGN", name: "Nigerian Naira" },
  { iso_code: "GBP", name: "British Pound" },
  { iso_code: "EUR", name: "Euro" },
] as const;

type AllowedCurrencyCode = (typeof ALLOWED_FIAT_CURRENCIES)[number]["iso_code"];

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function displayPrice(item: PricingItem, currency: string, rates: Record<string, number>) {
  const multiplier = rates[currency] ?? 1;
  const format = (value: number) => formatMoney(value * multiplier, currency);
  if (item.range) return `${format(item.range[0])} – ${format(item.range[1])}`;
  return format(item.amount ?? 0);
}

export default function PricingCatalog() {
  const [currency, setCurrency] = useState<AllowedCurrencyCode>("USD");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rateError, setRateError] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRates() {
      setLoading(true);
      setRateError(false);
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Primary rate service unavailable");
        const data = (await res.json()) as {
          time_last_update_utc?: string;
          rates?: Record<string, number>;
        };
        const nextRates: Record<string, number> = { USD: 1 };
        for (const { iso_code } of ALLOWED_FIAT_CURRENCIES) {
          const r = data.rates?.[iso_code];
          if (typeof r === "number" && Number.isFinite(r) && r > 0) {
            nextRates[iso_code] = r;
          }
        }
        setRates(nextRates);
        if (data.time_last_update_utc) {
          const parsed = new Date(data.time_last_update_utc);
          setRateDate(
            Number.isNaN(parsed.getTime())
              ? null
              : parsed.toISOString().slice(0, 10)
          );
        }
      } catch {
        if (!controller.signal.aborted) setRateError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadRates();
    return () => controller.abort();
  }, [refreshCount]);

  const availableCurrencies = useMemo(
    () =>
      ALLOWED_FIAT_CURRENCIES.filter(
        (c) => c.iso_code === "USD" || typeof rates[c.iso_code] === "number"
      ),
    [rates]
  );

  const selectedCurrencyName = useMemo(
    () =>
      ALLOWED_FIAT_CURRENCIES.find((item) => item.iso_code === currency)?.name ??
      currency,
    [currency]
  );

  return (
    <>
      <section className="border-y border-slate-200 bg-blue-50/60 py-7" aria-label="Currency conversion">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="text-sm font-semibold text-navy">Prices are set in US dollars</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Choose a business display currency (USD, NGN, GBP, or EUR). Amounts update using the latest published reference rate.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="pricing-currency" className="text-sm font-semibold text-slate-800">
              Display currency
            </label>
            <select
              id="pricing-currency"
              name="pricing-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as AllowedCurrencyCode)}
              disabled={loading && availableCurrencies.length <= 1}
              className="min-h-11 min-w-56 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {availableCurrencies.map((item) => (
                <option key={item.iso_code} value={item.iso_code}>
                  {item.iso_code} · {item.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setRefreshCount((n) => n + 1)}
              aria-label="Refresh exchange rates"
              title="Refresh exchange rates"
              disabled={loading}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center gap-x-2 px-5 text-xs leading-5 text-slate-600 sm:px-8 lg:px-10">
          {loading ? (
            <span role="status">Loading exchange rates…</span>
          ) : rateError ? (
            <span role="status">Exchange rates are temporarily unavailable. USD baseline prices remain visible.</span>
          ) : (
            <>
              <span>Showing {selectedCurrencyName} ({currency}) indicative conversions</span>
              {rateDate && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>reference rate dated {rateDate}</span>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <nav aria-label="Pricing categories" className="mb-9 flex flex-wrap gap-2">
          {pricingCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="inline-flex min-h-10 items-center rounded-full border border-blue-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-navy hover:text-navy"
            >
              {category.title}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {pricingCategories.map((category) => (
            <section key={category.id} id={category.id} aria-labelledby={`${category.id}-heading`} className="scroll-mt-24">
              <div className="mb-5 max-w-3xl">
                <h2 id={`${category.id}-heading`} className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {category.title}
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-600">{category.intro}</p>
              </div>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug text-slate-900">{item.name}</h3>
                      {item.name === "Growth Plan" && (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-3 min-h-12 flex-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                      {displayPrice(item, currency, rates)}
                    </p>
                    {item.unit && <p className="mt-1 text-xs font-medium text-slate-500">{item.unit}</p>}
                    {item.range && <p className="mt-1 text-xs font-medium text-slate-500">Final price depends on agreed scope.</p>}
                    <Link
                      href="/contact"
                      className="mt-5 inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-navy underline underline-offset-4 hover:text-navy-hover"
                    >
                      Discuss this service <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {category.note && (
                <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  {category.note}
                </p>
              )}
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white">
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">A clear scope before work begins</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Deliverables, timelines, invoicing, and applicable taxes (VAT/WHT) are confirmed in a written Statement of Work before work starts with ENTREHUB SERVICES LTD. Currency conversions are indicative reference amounts rather than binding FX quotes.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
