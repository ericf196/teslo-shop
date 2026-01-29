import { Component, inject, signal } from '@angular/core';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductsService } from '@products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';

interface ProductRequest {
  limit: number;
  offset: number;
  gender: string;
  page: number;
}

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {


  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // rxResource: convierte un Observable en una señal reactiva
  // Se actualiza automáticamente cuando el signal 'requestParams' cambia
  productsResource = rxResource({
    // params: función que retorna los parámetros reactivos
    params: () => ({ page: this.paginationService.currentPage() - 1 }),
    // stream: función que recibe los params y retorna un Observable
    stream: ({ params }: { params: { page: number } }) => {
      return this.productsService.getProducts({ offset: params.page * 9 });
    }
  });


}
