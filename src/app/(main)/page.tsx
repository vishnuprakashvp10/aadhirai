import { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyAadhirai from '@/components/home/WhyAadhirai';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import ArtisanStory from '@/components/home/ArtisanStory';
import MarqueeStrip from '@/components/home/MarqueeStrip';

export const metadata: Metadata = {
  title: 'Aadhirai — Curated Indian Divine Statues & Sculptures',
  description: 'Discover exquisite handcrafted divine statues and sacred sculptures from master artisans across India.',
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <MarqueeStrip />
      <FeaturedCategories />
      <FeaturedProducts />
      <ArtisanStory />
      <WhyAadhirai />
      <TestimonialsSection />
      <BlogPreview />
    </div>
  );
}
