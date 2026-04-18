import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProductsService } from '@products/services/products.service';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
  styleUrl: './product-admin-page.css',
})
export class ProductAdminPage {
  private activatedRoute = inject(ActivatedRoute);
  private route = inject(Router);
  private productsService = inject(ProductsService);

  productId = toSignal(
    this.activatedRoute.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' }
  );

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }: { params: { id: string } }) => {
      return this.productsService.getProductById(params.id);
    }
  });

  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.route.navigate(['/admin/products']);
    }
  });
}
