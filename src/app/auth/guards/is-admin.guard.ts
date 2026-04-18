import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(authService.checkStatus());
    if (!isAuthenticated) {
        router.navigateByUrl('/');
        return false;
    }

    const user = authService.user();
    if (!user || !user.roles.includes('admin')) {
        router.navigateByUrl('/');
        return false;
    }

    return true;
};
