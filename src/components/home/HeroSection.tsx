'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function HeroSection() {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 10;
      videoRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-forest-900">
      {/* Parallax BG */}
      <div
        ref={videoRef}
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ willChange: 'transform' }}
      >
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 opacity-90" />
        {/* Mandala pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='40' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='20' fill='none' stroke='%23E1A730' stroke-width='0.5'/%3E%3Cline x1='100' y1='20' x2='100' y2='180' stroke='%23E1A730' stroke-width='0.3'/%3E%3Cline x1='20' y1='100' x2='180' y2='100' stroke='%23E1A730' stroke-width='0.3'/%3E%3Cline x1='43' y1='43' x2='157' y2='157' stroke='%23E1A730' stroke-width='0.3'/%3E%3Cline x1='157' y1='43' x2='43' y2='157' stroke='%23E1A730' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Decorative gold orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-500" />
          <span className="font-accent text-gold-400 text-xs tracking-[0.35em] uppercase">
            Sacred Craftsmanship Since 2020
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-500" />
        </div>

        {/* Main Title */}
        <h1
          className="font-display text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-light text-white leading-[0.9] mb-6"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="block">Where</span>
          <span className="block italic text-gold-gradient font-semibold">Divinity</span>
          <span className="block">Meets Craft</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.4s' }}>
          Each statue is a prayer cast in metal — handcrafted by master artisans using traditions passed down through generations in Tamil Nadu.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 bg-gold-500 text-forest-900 font-accent text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold-400 transition-all duration-300"
          >
            Explore Collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-3 border border-white/30 text-white font-accent text-xs tracking-[0.2em] uppercase px-8 py-4 hover:border-gold-400 hover:text-gold-400 transition-all duration-300"
          >
            Our Story
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '0.8s' }}>
          {[
            { value: '500+', label: 'Statues' },
            { value: '50+', label: 'Artisans' },
            { value: '10K+', label: 'Happy Devotees' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl text-gold-400 font-semibold">{stat.value}</div>
              <div className="font-body text-xs text-white/40 tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="text-gold-400/50" size={24} />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
