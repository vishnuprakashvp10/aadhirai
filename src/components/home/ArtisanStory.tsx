import Link from 'next/link';

export default function ArtisanStory() {
  return (
    <section className="py-20 lg:py-28 bg-forest-900 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23E1A730' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-8 bg-gold-500" />
              <span className="font-accent text-gold-400 text-xs tracking-[0.3em] uppercase">Our Heritage</span>
            </div>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl text-white font-semibold leading-tight mb-6">
              Five Thousand Years of{' '}
              <span className="italic text-gold-400">Sacred Art</span>
            </h2>
            <p className="font-body text-white/60 text-base leading-relaxed mb-5">
              The artisans of Swamimalai, Tamil Nadu, have been casting bronze deities since the Chola dynasty — over 1,000 years of unbroken tradition. We work directly with these families, ensuring each piece carries the full weight of that legacy.
            </p>
            <p className="font-body text-white/60 text-base leading-relaxed mb-8">
              The lost-wax casting (Mezhugu Vaarthal) technique used today is identical to what produced the iconic Nataraja that now sits in the British Museum. Every statue begins as beeswax, sculpted by hand, and ends as a prayer made eternal in metal.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-10 pt-8 border-t border-white/10">
              {[
                { v: '1000+', l: 'Years of Tradition' },
                { v: '50+', l: 'Artisan Families' },
                { v: 'Panchaloha', l: 'Sacred Alloy' },
              ].map(({ v, l }) => (
                <div key={l}>
                  <div className="font-display text-2xl text-gold-400 font-semibold">{v}</div>
                  <div className="font-body text-xs text-white/40 mt-1 leading-snug">{l}</div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-gold-500 text-forest-900 font-accent text-xs tracking-widest uppercase px-8 py-4 hover:bg-gold-400 transition-colors"
            >
              Read Our Full Story
            </Link>
          </div>

          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { bg: 'bg-forest-800', h: 'h-64', label: 'Wax Sculpting' },
              { bg: 'bg-forest-700', h: 'h-40', label: 'Metal Casting' },
              { bg: 'bg-forest-700', h: 'h-40', label: 'Finishing' },
              { bg: 'bg-forest-800', h: 'h-64', label: 'Final Blessing' },
            ].map(({ bg, h, label }) => (
              <div key={label} className={`${bg} ${h} rounded-sm flex items-end p-4 relative overflow-hidden border border-white/5`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="relative font-body text-xs text-gold-400/70 tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
