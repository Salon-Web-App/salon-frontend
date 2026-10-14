"use client";

import { useState, useMemo } from "react";

export default function TransformationGallery({ items }) {
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(items.map((i) => i.category))], [items]);
  const filtered = category === "All" ? items : items.filter((i) => i.category === category);

  if (items.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-gradient-to-br from-cream-soft to-white">
      <div className="container-app">
        <div className="text-center mb-16">
          <span className="eyebrow mb-6">Our Portfolio</span>
          <h2 className="text-5xl md:text-6xl font-bold text-charcoal mt-6 mb-6">
            Transformations
          </h2>
          <div className="section-divider" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                category === cat
                  ? "bg-gradient-to-r from-gold to-gold-light text-white shadow-lg shadow-gold/30"
                  : "bg-white text-charcoal border border-gold/20 hover:border-gold/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="grid grid-cols-2 gap-0.5 bg-gold p-0.5">
                <div className="relative h-[300px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.beforeUrl}
                    alt={`${item.title} - Before`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-charcoal">
                    Before
                  </div>
                </div>
                <div className="relative h-[300px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.afterUrl}
                    alt={`${item.title} - After`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-gold to-gold-light text-white rounded-full text-xs font-semibold">
                    After
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal to-transparent text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold mt-1">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
