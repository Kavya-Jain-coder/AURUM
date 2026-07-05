'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RatesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Default standard materials we want to track
  const defaultRates = [
    { materialType: 'metal', materialName: '22K Gold', ratePerUnit: 684200 }, // in paise
    { materialType: 'metal', materialName: '18K Gold', ratePerUnit: 563100 },
    { materialType: 'metal', materialName: 'Silver 925', ratePerUnit: 9400 },
    { materialType: 'metal', materialName: 'Platinum 950', ratePerUnit: 321000 },
    { materialType: 'gemstone', materialName: 'Diamond VVS-EF', ratePerUnit: 4200000 },
    { materialType: 'gemstone', materialName: 'Diamond VS-GH', ratePerUnit: 3100000 },
  ];

  const [rates, setRates] = useState(defaultRates.map(r => ({ ...r, displayValue: (r.ratePerUnit / 100).toString() })));

  const handleRateChange = (index: number, val: string) => {
    const newRates = [...rates];
    newRates[index].displayValue = val;
    setRates(newRates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = rates.map(r => ({
        materialType: r.materialType,
        materialName: r.materialName,
        // Convert input INR to paise
        ratePerUnit: Math.round(parseFloat(r.displayValue || '0') * 100),
      }));

      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rates: payload }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(data.error || 'Failed to update rates');
      }
    } catch (err) {
      setError('An error occurred while saving rates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-aurum-shadow/30 border border-aurum-mist/50 p-8 md:p-10 space-y-8">
      <div>
        <h2 className="font-display font-medium italic text-aurum-cream text-xl">
          Today's Market Rates
        </h2>
        <p className="font-body text-aurum-ivory-mid text-xs mt-2 leading-relaxed">
          Update the daily bullion and gemstone rates. These values (in INR per gram or carat) will instantly recompute the live prices of all products in the catalogue.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 text-sm font-body">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-900/20 border border-green-500/50 text-green-200 text-sm font-body">
          Rates successfully updated for today! All product prices are now live.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rates.map((rate, idx) => (
            <div key={rate.materialName}>
              <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
                {rate.materialName} {rate.materialType === 'metal' ? '(₹/g)' : '(₹/ct)'}
              </label>
              <input
                type="number"
                step="0.01"
                value={rate.displayValue}
                onChange={(e) => handleRateChange(idx, e.target.value)}
                className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-aurum-gold text-aurum-void font-body text-xs tracking-[0.2em] uppercase hover:bg-aurum-cream transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Apply to Catalog'}
        </button>
      </form>
    </div>
  );
}
