import { User } from "@auth/interfaces/user.interface";

export interface ProductsResponse {
    count: number;
    pages: number;
    products: Product[];
  }

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: ProductSize[];
  gender: ProductGender;
  tags: string[];
  images: string[];
  user: User;
}

export enum ProductGender {
  MEN = 'men',
  WOMEN = 'women',
  KID = 'kid',
  UNISEX = 'unisex'
}

export enum ProductSize {
    XS = 'XS',
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL',
    XXL = 'XXL'
  }
