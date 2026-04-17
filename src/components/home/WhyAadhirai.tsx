import { Shield, Truck, Award, Heart, Phone, Star } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Authentic Craftsmanship',
    desc: 'Every piece is certified authentic, crafted by verified master artisans using traditional methods.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'All transactions protected by Razorpay — India\'s most trusted payment gateway with bank-grade security.',
  },
  {
    icon: Truck,
    title: 'Pan-India Delivery',
    desc: 'Carefully packaged in custom boxes with temple cotton padding. Ships across all 28 states.',
  },
  {
    icon: Heart,
    title: 'Prana Pratishtha Guide',
    desc: 'Each statue comes with a sacred consecration guide, mantras, and care instructions in English & Tamil.',
  },
  {
    icon: Phone,
    title: 'Expert Support',
    desc: 'Our team of scholars and artisan representatives is available to guide your selection.',
  },
  {
    icon: Star,
    title: 'Collector\'s Quality',
    desc: 'Museum-grade finishing, precise iconographic details faithful to Agamic standards.',
  },
];

export default function WhyAadhirai() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">Why Choose Us</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl text-forest-900 font-semibold">
            The Aadhirai Difference
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-8 border border-stone-100 hover:border-gold-300 hover:shadow-lg transition-all duration-300 rounded-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-50/0 to-gold-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 bg-forest-900 flex items-center justify-center mb-5 group-hover:bg-gold-500 transition-colors duration-300">
                  <Icon size={20} className="text-gold-400 group-hover:text-forest-900 transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl text-forest-900 font-semibold mb-3">{title}</h3>
                <p className="font-body text-sm text-stone-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
