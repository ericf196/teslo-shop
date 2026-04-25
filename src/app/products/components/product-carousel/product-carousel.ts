import { AfterViewInit, Component, ElementRef, inject, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: [
    `
    .swiper {
      width: 100%;
      height: 500px;
    }
    `
  ]
})
export class ProductCarousel implements AfterViewInit, OnChanges {

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  productsService = inject(ProductsService);
  swiper: Swiper | undefined = undefined;

  ngAfterViewInit(): void {
    this.swiperInit();

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);

    if (changes['images'].firstChange) {
      return;
    }

    if (!this.swiper) {
      return;
    }

    this.swiper.destroy(true, true);

    const paginationEl: HTMLElement = this.swiperDiv().nativeElement?.querySelector('.swiper-pagination');

    paginationEl.innerHTML = '';

    setTimeout(() => {
      this.swiperInit();
    }, 300);
  }

  swiperInit(): void {
    const element = this.swiperDiv().nativeElement;
    if (!element) {
      return;
    }

    console.log(this.images());

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
