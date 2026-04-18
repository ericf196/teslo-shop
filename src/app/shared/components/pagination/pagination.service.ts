import { inject, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {

    private activedRoute = inject(ActivatedRoute);
    private router = inject(Router);

    currentPage = toSignal(
        this.activedRoute.queryParams.pipe(
            map((params) => params['page'] ?? 1),
            map((page) => isNaN(page) ? 1 : page),
            tap((page) => console.log('page', page)),
        ),
        { initialValue: 1 }
    );

    setPage(page: number): void {
        this.router.navigate([], {
            relativeTo: this.activedRoute,
            queryParams: { page },
            queryParamsHandling: 'merge',
        });
    }

}
