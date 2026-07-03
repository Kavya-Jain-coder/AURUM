'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    collection: 'rings',
    price: '', // in Rupees
    description: '',
    story: '',
    materialsMetal: 'Yellow Gold',
    materialsStone: 'Diamond',
    materialsWeight: '',
    materialsPurity: '18 Karat',
    inStock: true,
    isNew: false,
    isBestseller: false,
  });

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          const p = data.product;
          setForm({
            name: p.name || '',
            slug: p.slug || '',
            collection: p.collection || 'rings',
            price: (p.price / 100).toString() || '', // convert paise to Rupees
            description: p.description || '',
            story: p.story || '',
            materialsMetal: p.materials?.metal || 'Yellow Gold',
            materialsStone: p.materials?.stone || 'Diamond',
            materialsWeight: p.materials?.weight || '',
            materialsPurity: p.materials?.purity || '18 Karat',
            inStock: p.inStock !== false,
            isNew: !!p.isNew,
            isBestseller: !!p.isBestseller,
          });
        } else {
          setError(data.error || 'Failed to fetch product specifications');
        }
      } catch (err) {
        setError('Error loading specifications from API');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    setForm({
      ...form,
      name: val,
      slug: generatedSlug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.price) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const priceInPaise = Math.round(parseFloat(form.price) * 100);
      
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: priceInPaise,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Failed to update product specs');
      }
    } catch (err) {
      setError('An error occurred while saving specifications.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border border-aurum-gold-dim border-t-aurum-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl bg-aurum-shadow/30 border border-aurum-mist/50 p-8 md:p-10 space-y-8">
      <div>
        <h2 className="font-display font-medium italic text-aurum-cream text-xl">
          Edit Specifications: {form.name}
        </h2>
        <p className="text-xs font-body text-aurum-ivory-deep mt-1">
          Modify active details for this luxury piece.
        </p>
      </div>

      {error && (
        <div className="bg-aurum-ruby/10 border border-aurum-ruby/30 text-aurum-ivory-deep text-xs py-3 px-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Piece Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Collection *
            </label>
            <select
              value={form.collection}
              onChange={(e) => setForm({ ...form, collection: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            >
              <option value="rings">Rings</option>
              <option value="necklaces">Necklaces</option>
              <option value="bracelets">Bracelets</option>
              <option value="earrings">Earrings</option>
            </select>
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Price (INR) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              required
            />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300 resize-none"
          />
        </div>

        <div>
          <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
            Cosmic Story
          </label>
          <textarea
            value={form.story}
            onChange={(e) => setForm({ ...form, story: e.target.value })}
            rows={3}
            className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300 resize-none"
          />
        </div>

        {/* Technical specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="font-body text-aurum-ivory-deep text-[9px] tracking-[0.2em] uppercase block mb-2">
              Metal Type
            </label>
            <input
              type="text"
              value={form.materialsMetal}
              onChange={(e) => setForm({ ...form, materialsMetal: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-3 py-2.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            />
          </div>
          <div>
            <label className="font-body text-aurum-ivory-deep text-[9px] tracking-[0.2em] uppercase block mb-2">
              Stone
            </label>
            <input
              type="text"
              value={form.materialsStone}
              onChange={(e) => setForm({ ...form, materialsStone: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-3 py-2.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            />
          </div>
          <div>
            <label className="font-body text-aurum-ivory-deep text-[9px] tracking-[0.2em] uppercase block mb-2">
              Weight
            </label>
            <input
              type="text"
              value={form.materialsWeight}
              onChange={(e) => setForm({ ...form, materialsWeight: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-3 py-2.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            />
          </div>
          <div>
            <label className="font-body text-aurum-ivory-deep text-[9px] tracking-[0.2em] uppercase block mb-2">
              Purity
            </label>
            <input
              type="text"
              value={form.materialsPurity}
              onChange={(e) => setForm({ ...form, materialsPurity: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-3 py-2.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4 accent-aurum-gold bg-aurum-obsidian border-aurum-mist"
            />
            <span className="font-body text-aurum-cream text-xs uppercase tracking-wider">In Stock</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
              className="w-4 h-4 accent-aurum-gold bg-aurum-obsidian border-aurum-mist"
            />
            <span className="font-body text-aurum-cream text-xs uppercase tracking-wider">New Arrival</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isBestseller}
              onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })}
              className="w-4 h-4 accent-aurum-gold bg-aurum-obsidian border-aurum-mist"
            />
            <span className="font-body text-aurum-cream text-xs uppercase tracking-wider">Bestseller</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="btn-gold px-8 py-3.5 text-xs font-body tracking-[0.15em]"
          >
            {saving ? 'Saving...' : 'Save Specifications'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="btn-outline-gold px-8 py-3.5 text-xs font-body tracking-[0.15em]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
