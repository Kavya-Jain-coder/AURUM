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
    metalType: '22K Gold',
    metalWeightGrams: '',
    gemstoneType: 'Diamond VVS-EF',
    gemstoneCarat: '',
    makingCharges: '',
    description: '',
    story: '',
    materialsMetal: 'Yellow Gold',
    materialsStone: 'Diamond',
    materialsWeight: '',
    materialsPurity: '18 Karat',
    inStock: true,
    isNew: false,
    isBestseller: false,
    gemstoneVariants: [] as { type: string; baseCarat: number; color: string; imagePath: string }[],
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
            metalType: p.metalType || '22K Gold',
            metalWeightGrams: p.metalWeightGrams || '',
            gemstoneType: p.gemstoneType || 'None',
            gemstoneCarat: p.gemstoneCarat || '',
            makingCharges: p.makingCharges ? (p.makingCharges / 100).toString() : '',
            description: p.description || '',
            story: p.story || '',
            materialsMetal: p.materials?.metal || 'Yellow Gold',
            materialsStone: p.materials?.stone || 'Diamond',
            materialsWeight: p.materials?.weight || '',
            materialsPurity: p.materials?.purity || '18 Karat',
            inStock: p.inStock !== false,
            isNew: !!p.isNew,
            isBestseller: !!p.isBestseller,
            gemstoneVariants: p.gemstoneVariants || [],
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
    if (!form.name || !form.slug || !form.metalWeightGrams || !form.makingCharges) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        metalWeightGrams: parseFloat(form.metalWeightGrams),
        gemstoneCarat: form.gemstoneCarat ? parseFloat(form.gemstoneCarat) : null,
        gemstoneType: form.gemstoneType === 'None' ? null : form.gemstoneType,
        makingCharges: Math.round(parseFloat(form.makingCharges) * 100),
        gemstoneVariants: form.gemstoneVariants,
      };
      
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const handleImageUpload = async (index: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        const newVariants = [...form.gemstoneVariants];
        newVariants[index].imagePath = data.url;
        setForm({ ...form, gemstoneVariants: newVariants });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (e) {
      alert('Upload failed');
    }
  };

  const addVariant = () => {
    setForm({
      ...form,
      gemstoneVariants: [
        ...form.gemstoneVariants,
        { type: '', baseCarat: 0, color: '#ffffff', imagePath: '' },
      ],
    });
  };

  const updateVariant = (index: number, key: string, value: any) => {
    const newVariants = [...form.gemstoneVariants];
    (newVariants[index] as any)[key] = value;
    setForm({ ...form, gemstoneVariants: newVariants });
  };

  const removeVariant = (index: number) => {
    const newVariants = [...form.gemstoneVariants];
    newVariants.splice(index, 1);
    setForm({ ...form, gemstoneVariants: newVariants });
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Metal Type *
            </label>
            <select
              value={form.metalType}
              onChange={(e) => setForm({ ...form, metalType: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            >
              <option value="22K Gold">22K Gold</option>
              <option value="18K Gold">18K Gold</option>
              <option value="Silver 925">Silver 925</option>
              <option value="Platinum 950">Platinum 950</option>
            </select>
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Metal Weight (grams) *
            </label>
            <input
              type="number"
              step="0.01"
              value={form.metalWeightGrams}
              onChange={(e) => setForm({ ...form, metalWeightGrams: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Making Charges (INR) *
            </label>
            <input
              type="number"
              value={form.makingCharges}
              onChange={(e) => setForm({ ...form, makingCharges: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              required
            />
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Gemstone Type
            </label>
            <select
              value={form.gemstoneType}
              onChange={(e) => setForm({ ...form, gemstoneType: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3.5 outline-none focus:border-aurum-gold transition-colors duration-300"
            >
              <option value="None">None</option>
              <option value="Diamond VVS-EF">Diamond VVS-EF</option>
              <option value="Diamond VS-GH">Diamond VS-GH</option>
            </select>
          </div>

          <div>
            <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
              Gemstone Carat
            </label>
            <input
              type="number"
              step="0.01"
              value={form.gemstoneCarat}
              onChange={(e) => setForm({ ...form, gemstoneCarat: e.target.value })}
              className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-4 py-3 outline-none focus:border-aurum-gold transition-colors duration-300"
              disabled={form.gemstoneType === 'None'}
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

        <div className="pt-6 border-t border-aurum-mist/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-medium italic text-aurum-ivory text-lg">
              Gemstone Variants
            </h3>
            <button
              type="button"
              onClick={addVariant}
              className="font-body text-xs text-aurum-gold hover:text-aurum-cream transition-colors border border-aurum-gold px-3 py-1.5"
            >
              + Add Variant
            </button>
          </div>
          <p className="font-body text-xs text-aurum-ivory-deep mb-4">
            Add multiple variants (e.g. Diamond, Ruby). These will appear on the storefront allowing users to see different styles with live prices. Uploading an image replaces the default image.
          </p>

          <div className="space-y-4">
            {form.gemstoneVariants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_80px_200px_40px] gap-4 items-end bg-aurum-void/50 p-4 border border-aurum-mist/30 relative group">
                
                <div>
                  <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
                    Type (e.g. Ruby)
                  </label>
                  <input
                    type="text"
                    value={variant.type}
                    onChange={(e) => updateVariant(index, 'type', e.target.value)}
                    className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-3 py-2 outline-none focus:border-aurum-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
                    Base Carat
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={variant.baseCarat}
                    onChange={(e) => updateVariant(index, 'baseCarat', parseFloat(e.target.value) || 0)}
                    className="w-full bg-aurum-obsidian border border-aurum-mist/80 text-aurum-ivory font-body text-sm px-3 py-2 outline-none focus:border-aurum-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                    className="w-full h-[38px] bg-aurum-obsidian border border-aurum-mist/80 p-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
                    Image
                  </label>
                  <div className="relative overflow-hidden w-full h-[38px] border border-aurum-mist/80 bg-aurum-obsidian flex items-center justify-center cursor-pointer hover:border-aurum-gold transition-colors text-xs text-aurum-ivory-mid">
                    {variant.imagePath ? (
                       <span className="truncate px-2" title={variant.imagePath}>{variant.imagePath.split('/').pop()}</span>
                    ) : (
                       <span>Upload...</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center h-[38px]">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-aurum-mist hover:text-aurum-ruby text-lg transition-colors"
                    title="Remove variant"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {form.gemstoneVariants.length === 0 && (
              <div className="text-center py-6 text-aurum-ivory-deep text-xs font-body italic border border-dashed border-aurum-mist/30">
                No gemstone variants added.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 border-t border-aurum-mist/20 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-gold text-sm px-10 py-3 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Product'}
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
