import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from '@shared/components/form-error-label/form-error-label';
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  product = input.required<Product>();
  fb = inject(FormBuilder);
  productsService = inject(ProductsService);
  router = inject(Router);
  wasSaved = signal(false);


  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: ['', []],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValues(this.product());
  }

  setFormValues(formLike: Partial<Product>): void {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') ?? '' });
  }

  async onSubmit() {

    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) {
      return;
    }

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.split(',').map(tag => tag.trim().toLowerCase()) ?? [],
    };

    console.log({ productLike });

    if (this.product().id === 'new') {

      const product = await firstValueFrom(this.productsService.createProduct(productLike));

      this.router.navigate(['/admin/products', product.id]);

      /*this.productsService.createProduct(productLike).subscribe({
        next: (product) => {
          console.log("Producto creado", product);
          this.router.navigate(['/admin/products', product.id]);
        },
        error: (error) => {
          console.error("Error al crear el producto", error);
        },
      });*/
    } else {
      await firstValueFrom(this.productsService.updateProduct(this.product().id, productLike));
      /*this.productsService.updateProduct(this.product().id, productLike).subscribe({
        next: (product) => {
          console.log("Producto actualizado", product);
        },
        error: (error) => {
          console.error("Error al actualizar el producto", error);
        },
      });*/
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  onSizeClick(size: string): void {
    const currentSizes = this.productForm.get('sizes')?.value ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes });
  }

  setGender(gender: string): void {
    this.productForm.get('gender')?.setValue(gender);
  }

}
