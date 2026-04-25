import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'productImage',
  standalone: true
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): string {

    if(typeof value === 'string' && value?.startsWith('blob:')){
      return value;
    }

    if (value === null) {
      return './assets/images/no-image.jpg';
    }

    const baseUrl = environment.baseUrl;

    if (value && Array.isArray(value) && value.length > 1) {
      return `${baseUrl}/files/product/${value[0]}`;
    }

    if (value && typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    return './assets/images/no-image.jpg';
  }
}

