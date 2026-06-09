export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date: string;
  time_slot: string;
  motif: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface FAQCategory {
  id: number;
  name: string;
  icon: string;
  sort_order: number;
}

export interface FAQItem {
  id: number;
  category_id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  display_name: string;
}
