export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  images: string[];
  category: ProductCategory;
  material: string;
  height_cm: number;
  weight_kg: number;
  finish: string;
  deity?: string;
  in_stock: boolean;
  stock_quantity: number;
  featured: boolean;
  rating: number;
  review_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
}

export type ProductCategory =
  | 'Lord Ganesha'
  | 'Lord Shiva'
  | 'Goddess Lakshmi'
  | 'Lord Vishnu'
  | 'Lord Krishna'
  | 'Lord Murugan'
  | 'Goddess Saraswati'
  | 'Lord Hanuman'
  | 'Goddess Durga'
  | 'Buddha'
  | 'Navagraha'
  | 'Other';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_id?: string;
  razorpay_order_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  category: string;
  tags: string[];
  deity?: string;
  read_time: number;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

export interface Analytics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  average_order_value: number;
  revenue_by_month: { month: string; revenue: number }[];
  orders_by_status: { status: string; count: number }[];
  top_products: { name: string; sales: number; revenue: number }[];
  recent_orders: Order[];
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  verified: boolean;
  created_at: string;
}
