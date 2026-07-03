'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    slug: '',
    collection: 'rings',
    price: '', // in Rupees (will convert to paise on submission)
    description: '',
    story: '',
    materialsMetal: 'Yellow Gold',
    materialsStone: 'Diamond',
    materialsWeight: '',
    materialsPurity: '18 Karat',
    inStock: true,
    isNew: false,
    isBestseller: false,
    imagePath: '',
  });

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

  const uploadFile = async (file: File) => {
    setUploadingImage(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setForm({ ...form, imagePath: data.path });
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading the image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug || !form.price) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const priceInPaise = Math.round(parseFloat(form.price) * 100);
      
      const res = await fetch('/api/admin/products', {
        method: 'POST',
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
        setError(data.error || 'Failed to create product');
      }
    } catch (err) {
      setError('An error occurred while creating product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-aurum-shadow/30 border border-aurum-mist/50 p-8 md:p-10 space-y-8">
      <div>
        <h2 className="font-display font-medium italic text-aurum-cream text-xl">
          Forge New Creation
        </h2>
        <p className="text-xs font-body text-aurum-ivory-deep mt-1">
          Complete the specifications to add a new piece to the AURUM catalogue.
        </p>
      </div>

      {error && (
        <div className="bg-aurum-ruby/10 border border-aurum-ruby/30 text-aurum-ivory-deep text-xs py-3 px-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* Image Upload Area */}
        <div>
          <label className="font-body text-aurum-ivory-deep text-[10px] tracking-[0.2em] uppercase block mb-2">
            Product Image *
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full relative h-48 sm:h-64 border-2 border-dashed border-aurum-mist/50 bg-aurum-obsidian flex flex-col items-center justify-center cursor-pointer hover:border-aurum-gold transition-colors duration-300 group overflow-hidden"
          >
            {form.imagePath ? (
              <Image src={form.imagePath} alt="Preview" fill className="object-contain p-4 group-hover:opacity-50 transition-opacity" />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-aurum-ivory-deep mb-3 group-hover:text-aurum-gold transition-colors">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="font-body text-xs text-aurum-ivory-mid group-hover:text-aurum-cream transition-colors">
                  {uploadingImage ? 'Uploading...' : 'Drag and drop image here, or click to browse'}
                </p>
                <p className="font-body text-[10px] text-aurum-ivory-deep mt-1">JPEG, PNG up to 5MB</p>
              </div>
            )}
            {form.imagePath && !uploadingImage && (
              <div className="absolute inset-0 bg-aurum-void/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-body text-xs text-aurum-gold">Click or Drop to replace</p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

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
              placeholder="e.g. Stellar Solitaire"
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
              placeholder="e.g. stellar-solitaire"
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
              placeholder="e.g. 145000"
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
            placeholder="A description of the jewellery's beauty and craft..."
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
            placeholder="The stellar origins of the gold/diamonds..."
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
              placeholder="Yellow Gold"
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
              placeholder="Diamond (1.2ct)"
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
              placeholder="4.8g"
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
              placeholder="22 Karat"
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
            disabled={loading}
            className="btn-gold px-8 py-3.5 text-xs font-body tracking-[0.15em]"
          >
            {loading ? 'Creating...' : 'Forge Piece'}
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
