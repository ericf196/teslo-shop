import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductsService } from '@products/services/products.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { map } from 'rxjs';

interface ProductRequest {
  limit: number;
  offset: number;
  gender: string;
  page: number;
}

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, Pagination],
  templateUrl: './gender-page.html',
  styleUrl: './gender-page.css'
})
export class GenderPage {

  route = inject(ActivatedRoute);

  gender = toSignal(
    this.route.params.pipe(map(({gender}) => gender))
  )

  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  // rxResource: convierte un Observable en una señal reactiva
  // Se actualiza automáticamente cuando el signal 'requestParams' cambia
  productsResource = rxResource({
    // params: función que retorna los parámetros reactivos
    params: () => ({gender: this.gender(), page: this.paginationService.currentPage() - 1}),
    // stream: función que recibe los params y retorna un Observable
    stream: ({ params }: { params: any }) => {
      return this.productsService.getProducts({ offset: params.page * 9, gender: params.gender });
    }
  });

}
