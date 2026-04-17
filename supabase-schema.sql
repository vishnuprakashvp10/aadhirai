-- ============================================
-- AADHIRAI DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  material TEXT,
  height_cm DECIMAL(6,2),
  weight_kg DECIMAL(6,3),
  finish TEXT,
  deity TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_id TEXT,
  razorpay_order_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BLOGS TABLE
-- ============================================
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author TEXT DEFAULT 'Aadhirai Team',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  deity TEXT,
  read_time INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NEWSLETTER TABLE
-- ============================================
CREATE TABLE newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Public can read published products
CREATE POLICY "Public products read" ON products FOR SELECT USING (true);

-- Public can read published blogs
CREATE POLICY "Public blogs read" ON blogs FOR SELECT USING (published = true);

-- Public can read reviews
CREATE POLICY "Public reviews read" ON reviews FOR SELECT USING (true);

-- Anyone can insert reviews
CREATE POLICY "Anyone can create review" ON reviews FOR INSERT WITH CHECK (true);

-- Anyone can create order
CREATE POLICY "Anyone can create order" ON orders FOR INSERT WITH CHECK (true);

-- Anyone can view own order by email (no auth needed)
CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);

-- Anyone can insert customer
CREATE POLICY "Anyone insert customer" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone view customer" ON customers FOR SELECT USING (true);

-- Newsletter signup
CREATE POLICY "Anyone subscribe newsletter" ON newsletter FOR INSERT WITH CHECK (true);

-- Service role has full access (for admin panel)
-- Note: With service role key, RLS is bypassed automatically

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run in Supabase Dashboard → Storage → New Bucket
-- Bucket name: aadhirai-assets (public bucket)
-- Then add policy: Allow public read
-- Then add policy: Allow authenticated upload

-- ============================================
-- SAMPLE PRODUCTS DATA
-- ============================================
INSERT INTO products (name, slug, description, short_description, price, compare_price, images, category, material, height_cm, weight_kg, finish, deity, in_stock, stock_quantity, featured, rating, review_count, tags) VALUES
('Panchamukhi Ganesha Brass Statue', 'panchamukhi-ganesha-brass-statue', 'A magnificent five-faced Lord Ganesha crafted from pure brass using traditional Chola casting techniques. Each face represents different aspects of Ganesha''s divine powers — wisdom, prosperity, protection, knowledge, and fulfillment of desires. The intricate detailing on the crown, ornaments, and vahana (mouse) showcases the artisan''s mastery.', 'Exquisite 5-faced brass Ganesha using Chola casting techniques', 18500, 22000, ARRAY['https://images.unsplash.com/photo-1593640408182-31c228d71f27?w=800'], 'Lord Ganesha', 'Pure Brass', 38, 4.2, 'Antique Gold', 'Ganesha', true, 15, true, 4.8, 124, ARRAY['ganesha', 'brass', 'panchamukhi', 'chola', 'puja']),
('Nataraja Dancing Shiva Bronze', 'nataraja-dancing-shiva-bronze', 'The cosmic dancer Nataraja, Lord Shiva in his eternal dance of creation and destruction. Cast in traditional Panchaloha (five-metal alloy) using the lost-wax method practiced for over 1000 years in Tamil Nadu. The halo of flames, the cosmic drum, and the demon underfoot are rendered with breathtaking precision.', 'Traditional Panchaloha Nataraja using lost-wax casting', 24500, 28000, ARRAY['https://images.unsplash.com/photo-1518489680-943dcbb55f44?w=800'], 'Lord Shiva', 'Panchaloha', 45, 5.8, 'Dark Bronze Patina', 'Shiva', true, 8, true, 4.9, 89, ARRAY['nataraja', 'shiva', 'bronze', 'panchaloha', 'dance']),
('Mahalakshmi Seated on Lotus', 'mahalakshmi-seated-on-lotus', 'Goddess Mahalakshmi in her serene seated posture on a full-bloomed lotus, showering blessings of wealth and prosperity. This statue captures the divine grace of the Goddess with delicate hand-carved ornaments, silk-draped attire details, and the iconic golden coins flowing from her palms.', 'Serene Mahalakshmi showering prosperity from a lotus throne', 15800, 19000, ARRAY['https://images.unsplash.com/photo-1602526432604-029a709e131b?w=800'], 'Goddess Lakshmi', 'Brass', 32, 3.1, 'Gold Polish', 'Lakshmi', true, 20, true, 4.7, 156, ARRAY['lakshmi', 'mahalakshmi', 'lotus', 'prosperity', 'brass']),
('Balakrishna Crawling Krishna', 'balakrishna-crawling-krishna', 'The adorable infant Krishna in his classic crawling pose, one hand raised playfully with a ball of butter. This form of Krishna, known as Balakrishna or Laddu Gopal, brings joy and divine childlike energy to any home. Crafted in white marble dust composite with hand-painted golden accents.', 'Adorable infant Krishna in butter-stealing crawling pose', 4200, 5500, ARRAY['https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800'], 'Lord Krishna', 'Marble Composite', 15, 0.8, 'White & Gold', 'Krishna', true, 35, false, 4.6, 203, ARRAY['krishna', 'balakrishna', 'butter', 'infant', 'marble']),
('Murugan with Vel and Peacock', 'murugan-vel-peacock', 'Lord Murugan, the commander of divine forces, standing tall with his Vel (divine spear) and his peacock vahana at his feet. This South Indian deity statue is especially auspicious for Tamil households. The detailed peacock feathers and intricate Kireedam (crown) demonstrate exceptional craftsmanship.', 'Majestic Lord Murugan with Vel spear and peacock', 12500, 15000, ARRAY['https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800'], 'Lord Murugan', 'Brass', 28, 2.5, 'Antique Finish', 'Murugan', true, 12, true, 4.8, 67, ARRAY['murugan', 'vel', 'peacock', 'south-india', 'brass']),
('Veena Saraswati Marble Statue', 'veena-saraswati-marble-statue', 'Goddess Saraswati, the divine patron of arts and learning, seated gracefully playing the Veena. Her four arms hold the Veena, Vedic scriptures, lotus, and japamala — symbols of creative expression and sacred knowledge. Crafted from pure Makrana marble with delicate hand-carved detailing.', 'Makrana marble Saraswati with hand-carved Veena and ornaments', 22000, 26000, ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'], 'Goddess Saraswati', 'Makrana Marble', 42, 6.2, 'Natural White', 'Saraswati', true, 6, true, 4.9, 45, ARRAY['saraswati', 'veena', 'marble', 'learning', 'arts']),
('Panchmukhi Hanuman Wall Plaque', 'panchmukhi-hanuman-wall-plaque', 'The powerful five-faced form of Hanuman displaying immense divine strength. This wall-mount plaque captures the Panchamukhi (five-faced) aspect believed to ward off evil and bring protection to the household. Each face — Hanuman, Narasimha, Garuda, Varaha, and Hayagriva — is rendered in exquisite detail.', 'Five-faced protective Hanuman wall plaque in antique brass', 8500, 10500, ARRAY['https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800'], 'Lord Hanuman', 'Brass', 35, 2.8, 'Antique Brass', 'Hanuman', true, 18, false, 4.7, 91, ARRAY['hanuman', 'panchmukhi', 'protection', 'wall-plaque', 'brass']),
('Mahishasura Mardini Durga', 'mahishasura-mardini-durga', 'Goddess Durga in her fierce Mahishasura Mardini form — the slayer of the buffalo demon. This awe-inspiring statue depicts the 10-armed Goddess riding her lion, each arm bearing a divine weapon, her expression radiating both fierce power and divine compassion. A masterpiece of traditional bronze casting.', 'Ten-armed Durga slaying Mahishasura — fierce divine energy', 31000, 36000, ARRAY['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'], 'Goddess Durga', 'Bronze', 50, 7.5, 'Dark Patina', 'Durga', true, 4, true, 5.0, 38, ARRAY['durga', 'mahishasura', 'ten-arms', 'bronze', 'fierce']),
('Meditating Gautama Buddha', 'meditating-gautama-buddha', 'Gautama Buddha in the serene Dhyana Mudra (meditation posture) with eyes half-closed in deep samadhi. The gentle smile on the Buddha''s lips embodies the peace that comes from true enlightenment. Crafted from black granite with a matte finish that exudes timeless spiritual calm.', 'Serene meditation Buddha in black granite Dhyana Mudra', 9800, 12000, ARRAY['https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800'], 'Buddha', 'Black Granite', 30, 4.0, 'Matte Black', 'Buddha', true, 22, false, 4.8, 178, ARRAY['buddha', 'meditation', 'granite', 'dhyana', 'peace']),
('Vishnu with Sudarshana Chakra', 'vishnu-sudarshana-chakra', 'Lord Vishnu, the cosmic preserver, in his majestic standing Tribhanga posture holding the Sudarshana Chakra, Panchajanya conch, lotus, and Kaumodaki mace. The elaborate Kireedam, Kaustubha gem, and Vaijayanti garland make this a collector''s masterpiece in Panchaloha alloy.', 'Majestic standing Vishnu with all divine attributes in Panchaloha', 28000, 32500, ARRAY['https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800'], 'Lord Vishnu', 'Panchaloha', 48, 6.8, 'Bronze Patina', 'Vishnu', true, 7, true, 4.9, 52, ARRAY['vishnu', 'sudarshana', 'panchaloha', 'preserver', 'chakra']),
('Small Ganesha for Car Dashboard', 'small-ganesha-car-dashboard', 'A compact, elegant Ganesha idol specially designed for car dashboards and small spaces. The non-slip base ensures it stays securely in place during travel. This auspicious Ganesha brings divine protection and auspicious beginnings to every journey.', 'Compact auspicious Ganesha with non-slip base for car or desk', 899, 1200, ARRAY['https://images.unsplash.com/photo-1593640408182-31c228d71f27?w=800'], 'Lord Ganesha', 'Resin with Gold Finish', 8, 0.15, 'Gold', 'Ganesha', true, 100, false, 4.5, 342, ARRAY['ganesha', 'car', 'dashboard', 'small', 'travel']),
('Ashtalakshmi Brass Set', 'ashtalakshmi-brass-set', 'A complete set of the eight forms of Goddess Lakshmi — Adi Lakshmi, Dhana Lakshmi, Dhanya Lakshmi, Gaja Lakshmi, Santana Lakshmi, Veera Lakshmi, Vijaya Lakshmi, and Vidhya Lakshmi — each representing a different aspect of abundance and blessing. Perfect for Lakshmi puja rooms.', 'Complete set of 8 Lakshmi forms in brass — the Ashtalakshmi', 35000, 42000, ARRAY['https://images.unsplash.com/photo-1602526432604-029a709e131b?w=800'], 'Goddess Lakshmi', 'Pure Brass', 20, 8.5, 'Gold Polish', 'Lakshmi', true, 5, true, 5.0, 28, ARRAY['lakshmi', 'ashtalakshmi', 'set', 'brass', 'eight-forms']);

-- ============================================
-- SAMPLE BLOGS DATA
-- ============================================
INSERT INTO blogs (title, slug, excerpt, content, cover_image, author, category, tags, deity, read_time, published, featured) VALUES
('The Divine Significance of Lord Ganesha in Hindu Worship', 'divine-significance-lord-ganesha', 'Discover why Lord Ganesha is invoked first in every Hindu ritual and celebration, and the profound symbolism behind his unique form.', '<h2>The First Among Gods</h2><p>Lord Ganesha, the elephant-headed deity, holds a unique place in the Hindu pantheon as Vighneshvara — the remover of obstacles. Before any significant undertaking, from starting a business to beginning a wedding ceremony, Hindus across the world invoke Lord Ganesha''s blessings.</p><h2>The Symbolism of His Form</h2><p>Every aspect of Ganesha''s appearance carries profound meaning. His large elephant head represents wisdom and the ability to think big. His small eyes signify concentration and focus. His large ears suggest the importance of listening — to wisdom, to others, and to the universe itself.</p><h2>The Broken Tusk</h2><p>One of the most fascinating stories behind Ganesha''s broken tusk involves the writing of the Mahabharata. When Sage Vyasa needed a scribe to record the epic, Ganesha volunteered — but broke off his own tusk to use as a pen when his regular one broke, sacrificing himself for the sake of knowledge.</p><h2>Ganesha in Sculpture</h2><p>When choosing a Ganesha statue for your home or puja room, consider the direction of his trunk. A left-curving trunk (Vamamukhi) is considered highly auspicious for home worship. A right-curving trunk (Dakshinamukhi) is more powerful but requires strict ritualistic worship.</p>', 'https://images.unsplash.com/photo-1593640408182-31c228d71f27?w=1200', 'Aadhirai Team', 'Mythology', ARRAY['ganesha', 'hinduism', 'symbolism'], 'Ganesha', 8, true, true),
('Nataraja: The Cosmic Dance of Creation and Destruction', 'nataraja-cosmic-dance', 'Explore the profound cosmological symbolism in Shiva''s Tandava dance and why the Nataraja statue remains one of India''s most iconic artistic creations.', '<h2>The Dance of the Universe</h2><p>The Nataraja — Shiva as the Lord of Dance — is perhaps the most profound artistic expression of Hindu cosmology. In a single, dynamic image, it encapsulates the entire cycle of the cosmos: creation, preservation, and dissolution.</p><h2>The Four Arms of Nataraja</h2><p>Each of Nataraja''s four arms tells a cosmic story. The upper right hand holds the Damaru (drum), whose rhythmic beat is the sound of creation — the primordial AUM. The upper left hand holds Agni (fire), the force of dissolution that cleanses and transforms. The lower right hand is in Abhaya Mudra, the gesture of protection and blessing. The lower left hand points to the uplifted foot, symbolizing liberation from the cycle of birth and death.</p><h2>The Ring of Fire</h2><p>The Prabhamandala — the aureole of flames surrounding the figure — represents the manifest universe, the phenomenal world of maya (illusion) within which the divine dance takes place.</p>', 'https://images.unsplash.com/photo-1518489680-943dcbb55f44?w=1200', 'Aadhirai Team', 'Mythology', ARRAY['shiva', 'nataraja', 'cosmology', 'dance'], 'Shiva', 10, true, true),
('Goddess Lakshmi: Eight Forms of Divine Abundance', 'goddess-lakshmi-eight-forms', 'A deep dive into the Ashtalakshmi — the eight manifestations of Goddess Lakshmi and the specific blessings each form bestows upon devotees.', '<h2>The Many Faces of Prosperity</h2><p>Goddess Lakshmi, the divine consort of Vishnu, is the embodiment of wealth, fortune, prosperity, and beauty. But her blessings extend far beyond material wealth — she is the source of all abundance in the universe, including spiritual richness, courage, and knowledge.</p><h2>The Eight Lakshmis</h2><p>The concept of Ashtalakshmi — the eight Lakshmis — captures the multidimensional nature of abundance. Adi Lakshmi is the primordial goddess, Dhana Lakshmi brings monetary wealth, Dhanya Lakshmi blesses with food and harvest, Gaja Lakshmi grants power and royalty, Santana Lakshmi bestows healthy offspring, Veera Lakshmi gives courage and strength, Vijaya Lakshmi brings victory, and Vidhya Lakshmi illuminates with knowledge and education.</p>', 'https://images.unsplash.com/photo-1602526432604-029a709e131b?w=1200', 'Aadhirai Team', 'Mythology', ARRAY['lakshmi', 'ashtalakshmi', 'prosperity', 'goddess'], 'Lakshmi', 7, true, false),
('The Lost-Wax Casting Technique of Tamil Nadu', 'lost-wax-casting-tamil-nadu', 'Journey into the ancient art of Perdu Casting — the 5000-year-old technique that creates the world''s most intricate metal sculptures.', '<h2>An Ancient Art Form</h2><p>The lost-wax casting technique, known in Tamil as Mezhugu Vaarthal, has been practiced in South India for over five millennia. The artisans of Swamimalai, a small town near Kumbakonam in Tamil Nadu, are the last living custodians of this ancient tradition.</p><h2>The Process</h2><p>The process begins with a beeswax model, painstakingly sculpted by hand with extraordinary detail. This wax model is coated with layers of clay and dried. The clay mold is then heated, causing the wax to melt and drain away — hence the name ''lost wax.'' Molten metal (traditionally Panchaloha) is poured into the void, and once cooled, the clay is broken away to reveal the bronze sculpture within.</p>', 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 'Aadhirai Team', 'Craftsmanship', ARRAY['bronze', 'lost-wax', 'swamimalai', 'craftsmanship'], null, 9, true, false),
('Vastu Shastra: Placing Statues for Maximum Positive Energy', 'vastu-shastra-statue-placement', 'Learn the ancient science of Vastu Shastra to correctly position your deity statues for optimal flow of positive energy in your home.', '<h2>The Science of Sacred Space</h2><p>Vastu Shastra, the ancient Indian science of architecture and spatial arrangement, offers detailed guidance on where to place deity statues in your home to ensure the maximum flow of positive energy (Prana).</p><h2>The Ideal Puja Room</h2><p>The northeast corner of the home, known as the Ishaan Kona, is considered the most sacred direction — the corner of the gods. If possible, your puja room or altar should be in this zone. The idol should face west (so the devotee faces east during worship) or face east (devotee faces west).</p><h2>Specific Deity Guidance</h2><p>Ganesha statues are best placed at the entrance, facing outward to guard the home. Lakshmi should be in the puja room or kitchen (the space of abundance). Shiva lingam should never be placed in the bedroom. Saraswati belongs in the study room or library.</p>', 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1200', 'Aadhirai Team', 'Vastu', ARRAY['vastu', 'placement', 'puja-room', 'energy'], null, 6, true, false),
('Lord Murugan: The Eternal Youth of the Tamil Gods', 'lord-murugan-tamil-deity', 'Explore the rich mythology and cultural significance of Lord Murugan, the patron deity of Tamil Nadu and the embodiment of divine youth and wisdom.', '<h2>The Tamil God</h2><p>No deity is more deeply embedded in Tamil culture than Lord Murugan. Known by many names — Kartikeya, Skanda, Subramanya, Shanmuga, Vel Muruga — he is the son of Shiva and Parvati, and the commander of the divine army (Devasena).</p><h2>The Six Sacred Abodes</h2><p>Tamil Nadu is home to the six most sacred temples of Murugan, known as the Arupadai Veedu. Palani, Tiruchendur, Swamimalai, Tirupparamkunram, Pazhamudircholai, and Tiruttani — each of these temples enshrines a different aspect of Murugan''s divine personality.</p>', 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=1200', 'Aadhirai Team', 'Mythology', ARRAY['murugan', 'tamil', 'kartikeya', 'south-india'], 'Murugan', 8, true, false),
('How to Perform Prana Pratishtha: Consecrating Your Statue', 'prana-pratishtha-guide', 'A step-by-step guide to the sacred Hindu ritual of Prana Pratishtha — the ceremony that invites divine consciousness to inhabit a newly acquired statue.', '<h2>What is Prana Pratishtha?</h2><p>Prana Pratishtha (Sanskrit: प्राण प्रतिष्ठा) literally means "establishing life force." It is the sacred Hindu ritual through which a statue or image is transformed from a beautiful object into a living divine presence — a true murti.</p><h2>Preparing for the Ritual</h2><p>Before the consecration, the statue should be ritually purified with Panchagavya (five products of the cow: milk, curd, ghee, dung, and urine) and then bathed in Panchamrita (milk, honey, sugar, curd, and ghee).</p><h2>The Ritual Process</h2><p>The ritual involves the chanting of specific Vedic mantras by a qualified priest, the invocation of the deity into the murti through Avahana (invitation), followed by various Upacharas (offerings) including flowers, incense, lamp, and food. The final step is Netra Unmeelanam — the opening of the eyes.</p>', 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200', 'Aadhirai Team', 'Rituals', ARRAY['prana-pratishtha', 'consecration', 'ritual', 'puja'], null, 11, true, true),
('Panchaloha: The Sacred Five-Metal Alloy of Hindu Sculpture', 'panchaloha-sacred-alloy', 'Discover the mystical properties of Panchaloha — the ancient five-metal alloy of gold, silver, copper, zinc, and iron used in traditional Hindu temple sculptures.', '<h2>The Divine Alloy</h2><p>Panchaloha (Sanskrit: पञ्चलोह) — literally "five metals" — is a sacred alloy described in ancient Hindu texts including the Agamas and Shilpa Shastras. Traditionally composed of gold, silver, copper, zinc, and iron, with copper forming the majority, Panchaloha is considered the ideal material for casting deity statues.</p><h2>The Sacred Proportions</h2><p>Ancient texts prescribe specific ratios for each metal. The exact proportions have been kept as closely guarded secrets by hereditary artisan families (Vishwakarma communities) for generations. The unique combination of metals is believed to create a material that resonates with divine frequencies and is capable of holding spiritual energy.</p>', 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200', 'Aadhirai Team', 'Craftsmanship', ARRAY['panchaloha', 'metal', 'alloy', 'casting', 'traditional'], null, 7, true, false),
('The Nine Planets: Understanding Navagraha Statues', 'navagraha-nine-planets-guide', 'An astrological and spiritual guide to the Navagraha — the nine celestial beings who govern the cosmic forces affecting human life and destiny.', '<h2>The Cosmic Governors</h2><p>In Vedic astrology, the Navagraha — the nine planetary deities — are believed to exert a profound influence on human destiny. Surya (Sun), Chandra (Moon), Mangala (Mars), Budha (Mercury), Brihaspati (Jupiter), Shukra (Venus), Shani (Saturn), Rahu (North Node), and Ketu (South Node) — each rules over specific aspects of life.</p><h2>Propitiation Through Worship</h2><p>Worshipping Navagraha statues, particularly on days associated with specific planets (Sunday for Sun, Monday for Moon, etc.), is believed to mitigate the malefic effects of planetary positions and strengthen beneficial influences in one''s astrological chart.</p>', 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1200', 'Aadhirai Team', 'Astrology', ARRAY['navagraha', 'planets', 'astrology', 'vedic'], null, 9, true, false),
('Caring for Your Brass and Bronze Statues', 'caring-brass-bronze-statues', 'Expert tips on cleaning, polishing, and maintaining your brass and bronze divine statues to preserve their beauty and sanctity for generations.', '<h2>The Living Metal</h2><p>Brass and bronze statues are not mere decorative objects — they are living representations of divine energy. Proper care ensures they remain both physically beautiful and spiritually potent for generations.</p><h2>Regular Cleaning</h2><p>For everyday dust removal, use a soft, dry microfiber cloth. Avoid harsh abrasives or acidic cleaners. For deeper cleaning, create a paste of tamarind and salt (traditional method) or use a mild brass cleaner. Gently rub in the direction of the casting lines, then rinse with clean water and dry thoroughly.</p><h2>The Patina Question</h2><p>Natural patina — the dark oxidation that develops over time — is actually considered auspicious on puja statues. It indicates the statue is "breathing" and accumulating spiritual energy. Many connoisseurs prefer the aged look of a naturally patinated bronze over a freshly polished one.</p>', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200', 'Aadhirai Team', 'Care & Maintenance', ARRAY['care', 'cleaning', 'brass', 'bronze', 'maintenance'], null, 6, true, false);
