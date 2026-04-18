import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, CurrencyPipe, RouterLink],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css'
})
export class ProductTable {

  products = input.required<Product[]>();

}
