'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Ramasubramanian',
    location: 'Chennai',
    rating: 5,
    text: 'The Nataraja I ordered is breathtaking. The detail on the flames, the expression — it\'s like Swamimalai has sent a tiny temple into my home. My priest was moved when he saw it.',
    product: 'Nataraja Dancing Shiva',
  },
  {
    name: 'Vikram Nair',
    location: 'Bengaluru',
    rating: 5,
    text: 'Packaging was exquisite — the statue arrived in a wooden box lined with temple cotton. The Panchamukhi Ganesha has transformed our puja room. Absolutely worth every rupee.',
    product: 'Panchamukhi Ganesha',
  },
  {
    name: 'Meenakshi Iyengar',
    location: 'Mumbai',
    rating: 5,
    text: 'I have been collecting divine statues for 20 years. The Ashtalakshmi set from Aadhirai is the finest I\'ve ever owned. The proportions are iconographically perfect.',
    product: 'Ashtalakshmi Brass Set',
  },
  {
    name: 'Dr. Suresh Pillai',
    location: 'Kochi',
    rating: 5,
    text: 'Their customer service guided me to the right Ganesha based on my Vastu requirements. The Prana Pratishtha guide included was invaluable for the consecration ceremony.',
    product: 'Panchamukhi Ganesha',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 bg-cream-dark mandala-bg overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-gold-500" />
            <span className="font-accent text-gold-500 text-xs tracking-[0.3em] uppercase">Testimonials</span>
            <div className="h-px w-8 bg-gold-500" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl text-forest-900 font-semibold">
            Words from Devotees
          </h2>
        </div>

        <div className="relative">
          <div className="bg-white border border-stone-100 p-8 lg:p-12 text-center shadow-sm relative">
            {/* Quote mark */}
            <div className="font-display text-8xl text-gold-200 leading-none absolute top-4 left-8 select-none">"</div>

            <div className="flex justify-center mb-4">
              {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                <Star key={i} size={16} className="text-gold-500 fill-gold-500" />
              ))}
            </div>

            <blockquote className="font-display text-xl lg:text-2xl text-forest-900 italic leading-relaxed mb-8 relative z-10">
              {testimonials[current].text}
            </blockquote>

            <div>
              <p className="font-accent text-sm text-forest-900 font-semibold tracking-wide">
                {testimonials[current].name}
              </p>
              <p className="font-body text-xs text-stone-400 mt-1">
                {testimonials[current].location} · {testimonials[current].product}
              </p>
            </div>

            {/* Gold bottom border */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 border border-stone-200 flex items-center justify-center hover:border-forest-900 hover:bg-forest-900 hover:text-white transition-all rounded-full"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-gold-500 w-6' : 'bg-stone-200'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 border border-stone-200 flex items-center justify-center hover:border-forest-900 hover:bg-forest-900 hover:text-white transition-all rounded-full"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
