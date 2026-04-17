import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Story — Aadhirai',
  description: 'Learn about Aadhirai\'s mission to preserve ancient Indian sculptural traditions by connecting master artisans with devotees worldwide.',
};

const team = [
  { name: 'Arjun Krishnaswamy', role: 'Founder & Curator', bio: 'Born in Swamimalai, Arjun grew up watching his grandfather cast bronze idols. After a decade in design, he returned to preserve this heritage.' },
  { name: 'Meera Sundaram', role: 'Head of Artisan Relations', bio: '15 years working directly with artisan communities across Tamil Nadu, ensuring fair wages and authentic techniques.' },
  { name: 'Rajan Pillai', role: 'Iconographic Scholar', bio: 'PhD in Hindu iconography from Madras University. Ensures every statue meets authentic Agamic standards.' },
];

const milestones = [
  { year: '2020', event: 'Founded in Chennai with 5 artisan families' },
  { year: '2021', event: 'Reached 100 verified artisan partners' },
  { year: '2022', event: 'Launched online platform, 500+ statues' },
  { year: '2023', event: '10,000+ devotees served across India' },
  { year: '2024', event: 'Expanded to international shipping' },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-forest-900 pt-10 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Ccircle cx='60' cy='60' r='30' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-400 text-xs tracking-[0.3em] uppercase">Our Story</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h1 className="font-display text-5xl lg:text-7xl text-white font-semibold leading-tight mb-5">
            Preserving a<br /><span className="italic text-gold-400">Living Tradition</span>
          </h1>
          <p className="font-body text-white/60 text-base max-w-2xl mx-auto leading-relaxed">
            Aadhirai was born from a simple belief: that the master artisans of South India — heirs to a 1,000-year sculptural tradition — deserve a world-class platform to share their sacred art.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-8 bg-gold-500" />
              <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">The Mission</span>
            </div>
            <h2 className="font-display text-4xl text-forest-900 font-semibold mb-5">
              Where Sacred Art Meets Conscious Commerce
            </h2>
            <p className="font-body text-stone-500 text-base leading-relaxed mb-4">
              The Vishwakarma artisan communities of Swamimalai and Nachiyarkoil have been creating some of the world's most exquisite bronze sculptures for over a millennium. Yet many of these families struggle to find buyers beyond local temple committees.
            </p>
            <p className="font-body text-stone-500 text-base leading-relaxed mb-4">
              Aadhirai bridges this gap. We visit ateliers directly, document each artisan's lineage and technique, and bring their work to devotees and collectors across India and the world — at prices that ensure every craftsperson earns a dignified livelihood.
            </p>
            <p className="font-body text-stone-500 text-base leading-relaxed">
              Every purchase is an act of cultural preservation. Every statue carries the fingerprints of a living master.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Artisan Families', value: '50+' },
              { label: 'Statues Curated', value: '500+' },
              { label: 'Devotees Served', value: '10K+' },
              { label: 'Years of Tradition', value: '1000+' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-forest-900 p-8 text-center rounded-sm">
                <div className="font-display text-4xl text-gold-400 font-semibold mb-2">{value}</div>
                <div className="font-body text-xs text-white/50 tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-forest-900 font-semibold">Our Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-100 -translate-x-1/2 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 hidden md:block" />
                  <div className="w-16 h-16 bg-forest-900 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                    <span className="font-accent text-gold-400 text-xs font-bold">{m.year.slice(2)}</span>
                  </div>
                  <div className={`flex-1 bg-stone-50 p-5 rounded-sm border border-stone-100 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <p className="font-accent text-sm text-gold-500 font-semibold mb-1">{m.year}</p>
                    <p className="font-body text-sm text-stone-600">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">The Team</span>
              <div className="h-px w-8 bg-gold-500" />
            </div>
            <h2 className="font-display text-4xl text-forest-900 font-semibold">The People Behind Aadhirai</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map(({ name, role, bio }) => (
              <div key={name} className="text-center p-8 border border-stone-100 hover:shadow-lg transition-shadow rounded-sm group">
                <div className="w-20 h-20 bg-forest-900 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                  <span className="font-display text-2xl text-gold-400 group-hover:text-forest-900 transition-colors">{name[0]}</span>
                </div>
                <h3 className="font-display text-xl text-forest-900 font-semibold mb-1">{name}</h3>
                <p className="font-accent text-xs text-gold-500 tracking-wide mb-3">{role}</p>
                <p className="font-body text-sm text-stone-500 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-forest-900 p-12 text-center rounded-sm">
          <h2 className="font-display text-3xl text-white font-semibold mb-4">Begin Your Sacred Collection</h2>
          <p className="font-body text-white/60 mb-8 max-w-xl mx-auto">Every statue you purchase directly supports an artisan family and helps preserve India's most magnificent sculptural heritage.</p>
          <Link href="/products" className="inline-flex items-center gap-3 bg-gold-500 text-forest-900 font-accent text-xs tracking-widest uppercase px-10 py-4 hover:bg-gold-400 transition-colors">
            Explore Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
