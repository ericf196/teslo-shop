import { Routes } from '@angular/router';
import { notAuthenticatedGuard } from '@auth/guards/not-autenticeted.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.route'),
        canMatch: [notAuthenticatedGuard]
    },
    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes')
    }
];
