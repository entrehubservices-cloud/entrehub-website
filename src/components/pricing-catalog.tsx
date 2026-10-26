'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { pricingCategories, type PricingItem } from "@/lib/pricing";

type RateRow = { date: string; base: string; quote: string; rate: number };
type CurrencyRow = { iso_code: string; name: string };

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
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyRow[]>([{ iso_code: "USD", name: "US Dollar" }]);
  const [loading, setLoading] = useState(true);
  const [rateError, setRateError] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRates() {
      setLoading(true);
      setRateError(false);
      try {
        const [ratesResponse, currenciesResponse] = await Promise.all([
          fetch("https://api.frankfurter.dev/v2/rates?base=USD", { signal: controller.signal, cache: "no-store" }),
          fetch("https://api.frankfurter.dev/v2/currencies", { signal: controller.signal, cache: "no-store" }),
        ]);
        if (!ratesResponse.ok || !currenciesResponse.ok) throw new Error("Rate service unavailable");
        const [rateRows, currencyRows] = await Promise.all([
          ratesResponse.json() as Promise<RateRow[]>,
          currenciesResponse.json() as Promise<CurrencyRow[]>,
        ]);
        const nextRates: Record<string, number> = { USD: 1 };
        for (const row of rateRows) {
          if (row.base === "USD" && Number.isFinite(row.rate)) nextRates[row.quote] = row.rate;
        }
        setRates(nextRates);
        setRateDate(rateRows[0]?.date ?? null);
        const names = new Map(currencyRows.map((row) => [row.iso_code, row.name]));
        const nonCurrencyAssets = new Set(["BCH", "BTC", "CMD", "ETH", "LTC", "XAG", "XAU", "XDR", "XPD", "XPT", "XRP"]);
        const options = Object.keys(nextRates)
          .filter((code) => !nonCurrencyAssets.has(code))
          .map((code) => ({ iso_code: code, name: names.get(code) ?? code }))
          .sort((a, b) => a.iso_code === "USD" ? -1 : b.iso_code === "USD" ? 1 : a.iso_code.localeCompare(b.iso_code));
        setCurrencies(options);
      } catch {
        if (!controller.signal.aborted) setRateError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadRates();
    return () => controller.abort();
  }, [refreshCount]);

  const selectedCurrencyName = useMemo(
    () => currencies.find((item) => item.iso_code === currency)?.name ?? currency,
    [currencies, currency],
  );

  return (
    <>
      <section className="border-y border-slate-200 bg-blue-50/60 py-7" aria-label="Currency conversion">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="text-sm font-semibold text-amber-300">Prices are set in US dollars</p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              Choose a display currency. Prices update on this page using the latest published reference rate.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="pricing-currency" className="text-sm font-semibold text-slate-200">Display currency</label>
            <select
              id="pricing-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              disabled={loading || currencies.length <= 1}
              className="min-h-11 min-w-56 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {currencies.map((item) => (
                <option key={item.iso_code} value={item.iso_code}>{item.iso_code} · {item.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setRefreshCount((n) => n + 1)}
              aria-label="Refresh exchange rates"
              title="Refresh exchange rates"
              disabled={loading}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-slate-300 text-slate-200 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center gap-x-2 px-5 text-xs leading-5 text-slate-500 sm:px-8 lg:px-10">
          {loading ? (
            <span role="status">Loading exchange rates…</span>
          ) : rateError ? (
            <span role="status">Exchange rates are temporarily unavailable. The USD prices remain visible.</span>
          ) : (
            <>
              <span>Showing {selectedCurrencyName} ({currency}) conversions</span>
              <span aria-hidden="true">·</span>
              <span>reference rate dated {rateDate ?? "latest available"}</span>
              <span aria-hidden="true">·</span>
              <a className="underline underline-offset-2 hover:text-amber-300" href="https://frankfurter.dev/" target="_blank" rel="noreferrer">Rate source: Frankfurter</a>
            </>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <nav aria-label="Pricing categories" className="mb-9 flex flex-wrap gap-2">
          {pricingCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="inline-flex min-h-10 items-center rounded-full border border-blue-200 bg-white px-4 text-sm font-medium text-slate-200 transition hover:border-amber-300 hover:text-amber-300">
              {category.title}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {pricingCategories.map((category) => (
            <section key={category.id} id={category.id} aria-labelledby={`${category.id}-heading`} className="scroll-mt-24">
              <div className="mb-5 max-w-3xl">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Entrehub Services</p>
                <h2 id={`${category.id}-heading`} className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{category.title}</h2>
                <p className="mt-2 text-base leading-7 text-slate-600">{category.intro}</p>
              </div>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => (
                  <li key={item.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug text-slate-900">{item.name}</h3>
                      {item.name === "Growth Plan" && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-amber-300">Popular</span>
                      )}
                    </div>
                    <p className="mt-3 min-h-12 flex-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                      {displayPrice(item, currency, rates)}
                    </p>
                    {item.unit && <p className="mt-1 text-xs font-medium text-slate-500">{item.unit}</p>}
                    {item.range && <p className="mt-1 text-xs font-medium text-slate-500">Final price depends on scope.</p>}
                    <Link href="/#contact" className="mt-5 inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-amber-300 underline underline-offset-4">
                      Discuss this service <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              {category.note && <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-slate-600">{category.note}</p>}
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/60 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white"><Check className="h-4 w-4" aria-hidden="true" /></span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">A clear scope before work begins</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Website and campaign prices depend on the agreed scope. We confirm deliverables, timing and payment terms in a written proposal before work starts. Currency conversions are indicative reference amounts, not a payment quote; your bank or payment provider may apply its own rate and fees.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
