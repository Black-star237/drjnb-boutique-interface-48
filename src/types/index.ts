
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: string[] | null; // JSONB field for multiple images
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  is_active: boolean;
  images: string[];
}
