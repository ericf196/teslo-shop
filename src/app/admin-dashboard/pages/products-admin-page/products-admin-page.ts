import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductTable } from '@products/components/product-table/product-table';
import { ProductsService } from '@products/services/products.service';
import { Pagination } from '@shared/components/pagination/pagination';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
  styleUrl: './products-admin-page.css',
})
export class ProductsAdminPage {
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);
  productsPerPage = signal<number>(10);

  productsResource = rxResource({
    params: () => ({ page: Number(this.paginationService.currentPage()) - 1, limit: this.productsPerPage() }),
    stream: ({ params }: { params: { page: number, limit: number } }) => {
      return this.productsService.getProducts({ limit: params.limit, offset: params.page * params.limit });
    },
  });

  products = computed(() => this.productsResource.value()?.products ?? []);
  totalProducts = computed(() => this.productsResource.value()?.count ?? 0);
  totalPages = computed(() => this.productsResource.value()?.pages ?? 0);
  currentPage = computed(() => Number(this.paginationService.currentPage()) || 1);

  updateProductsPerPage(value: number): void {
    this.paginationService.setPage(1);
    this.productsPerPage.set(value);
  }
}
