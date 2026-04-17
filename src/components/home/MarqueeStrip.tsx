export default function MarqueeStrip() {
  const items = [
    '✦ Handcrafted in India',
    '✦ Authentic Materials',
    '✦ Master Artisans',
    '✦ Free Shipping above ₹5,000',
    '✦ Prana Pratishtha Guide Included',
    '✦ Brass · Bronze · Marble · Stone',
    '✦ 500+ Divine Sculptures',
    '✦ Ships Across India',
  ];

  return (
    <div className="bg-forest-900 py-3 overflow-hidden relative">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-accent text-gold-400 text-xs tracking-widest mx-8 flex-shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
