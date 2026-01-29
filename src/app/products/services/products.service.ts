import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { ProductsResponse, Product } from '../interfaces/product.interface';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

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
}

