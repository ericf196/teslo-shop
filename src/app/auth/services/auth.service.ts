import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '@auth/interfaces/user.interface';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { rxResource } from '@angular/core/rxjs-interop';

const BASE_URL = environment.baseUrl;

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));

    private http = inject(HttpClient);

    checkStatusResource = rxResource({
        stream: () => this.checkStatus(),
    });

    authStatus = computed<AuthStatus>(() => {
        if (this._authStatus() === 'checking') return 'checking';

        if (this._user()) {
            return 'authenticated';
        }

        return 'not-authenticated';
    });

    user = computed<User | null>(() => this._user());
    token = computed<string | null>(() => this._token());

    /**
     * Realiza el login del usuario
     * @param credentials Credenciales de login (email y password)
     * @returns Observable con la respuesta de autenticación
     */
    login(credentials: LoginRequest): Observable<boolean> {
        return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, credentials)
            .pipe(
                map(({ user, token }) => this.handleAuthSuccess({ user, token })),
                catchError((error: any) => {
                    this._token.set(null);
                    this._user.set(null);
                    this._authStatus.set('not-authenticated');
                    return of(false);
                })
            );
    }

    /**
     * Registra un nuevo usuario
     * @param userData Datos del usuario para registro
     * @returns Observable con la respuesta de autenticación
     */
    register(userData: RegisterRequest): Observable<boolean> {
        return this.http.post<AuthResponse>(`${BASE_URL}/auth/register`, userData).pipe(
            map(({ user, token }) => this.handleAuthSuccess({ user, token })),
            catchError((error: any) => {
                this._token.set(null);
                this._user.set(null);
                this._authStatus.set('not-authenticated');
                return of(false);
            })
        );
    }

    /**
     * Verifica el token del usuario
     * @returns Observable con la información del usuario autenticado
     */
    checkStatus(): Observable<boolean> {
        const token = localStorage.getItem('token');
        if (!token) {
            this.logout();
            return of(false);
        }
        return this.http.get<AuthResponse>(`${BASE_URL}/auth/check-status`, {
            /* headers: {
                'Authorization': `Bearer ${token}`
            } */
        }).pipe(
            map(({ user, token }) => this.handleAuthSuccess({ user, token })),
            catchError((error: any) => {
                return this.handleAuthError(error);
            })
        );
    }

    /**
     * Cierra la sesión del usuario
     * @returns Observable
     */
    logout() {
        this._token.set(null);
        this._user.set(null);
        this._authStatus.set('not-authenticated');
        localStorage.removeItem('token');
    }

    private handleAuthSuccess({ user, token }: AuthResponse) {
        this._authStatus.set('authenticated');
        this._user.set(user);
        this._token.set(token);

        localStorage.setItem('token', token);
        return true;
    }

    private handleAuthError(error: any) {
        this.logout();
        return of(false);
    }
}
