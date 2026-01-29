import { inject, Injectable } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    private activedRoute = inject(ActivatedRoute);

    currentPage = toSignal(
        this.activedRoute.queryParams.pipe(
            map((params) => params['page'] ?? 1),
            map((page) => isNaN(page) ? 1 : page),
            tap((page) => console.log('page', page)),
        ),
        { initialValue: 1 }
    )



}
