import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { ProductsResponse, Product, ProductGender } from '../interfaces/product.interface';
import { environment } from '../../../environments/environment';
import { User } from '@auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: ProductGender.KID,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productIndividualCache = new Map<string, Product>();

  /**
   * Obtiene todos los productos con opciones de paginación
   * @param page Número de página (default: 1)
   * @param limit Límite de productos por página
   * @returns Observable con la respuesta de productos
   */
  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: {
          limit,
          offset,
          gender,
        },
      })
      .pipe(
        tap((resp) => console.log(resp)),
        tap((resp) => this.productsCache.set(key, resp)),
        tap((resp) => console.log("productsCache ", this.productsCache)),
      );
  }

  getProductBySlug(slug: string): Observable<Product> {
    if (this.productIndividualCache.has(slug)) {
      return of(this.productIndividualCache.get(slug)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${slug}`).pipe(
      tap((resp) => this.productIndividualCache.set(slug, resp)),
      tap((resp) => console.log("productIndividualCache ", this.productIndividualCache)),
    );
  }

  getProductById(id: string): Observable<Product> {

    if (id === 'new') {
      return of(emptyProduct);
    }
    
    if (this.productIndividualCache.has(id)) {
      return of(this.productIndividualCache.get(id)!);
    }
    return this.http.get<Product>(`${BASE_URL}/products/${id}`).pipe(
      tap((resp) => this.productIndividualCache.set(id, resp)),
      tap((resp) => console.log("productIndividualCache ", this.productIndividualCache)),
    );
  };

  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${BASE_URL}/products/${id}`, productLike).pipe(
      tap((product) => this.updateProductInCache(product)),
    );
  }

  updateProductInCache(product: Product): void {
    const productId = product.id;

    this.productIndividualCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map(
        (currentProduct) =>
          currentProduct.id === productId ? product : currentProduct
      );

    });
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${BASE_URL}/products`, productLike).pipe(
      tap((product) => this.updateProductInCache(product)),
    );
  }
}

