import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { ProductsService } from '@products/services/products.service';

interface ProductParams {
  idSlug: string;
}

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage {
  private activatedRoute = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  // Signal que se actualiza cuando cambian los parámetros de la ruta
  productIdSlug = signal<string>(this.activatedRoute.snapshot.params['idSlug']);

  constructor() {
    this.activatedRoute.params.subscribe((params) => console.log(params));
  }

  productResource = rxResource({
    // params: función que retorna los parámetros reactivos
    params: () => ({ idSlug: this.productIdSlug() }),
    // stream: función que recibe los params y retorna un Observable
    stream: ({ params }: { params: ProductParams }) => {
      if (!params.idSlug) {
        throw new Error('idSlug is required');
      }
      return this.productsService.getProductBySlug(params.idSlug);
    }
  });
}
