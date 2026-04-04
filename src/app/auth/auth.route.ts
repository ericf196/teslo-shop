import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { LoginPage } from "./pages/login-page/login-page";
import { RegisterPage } from "./pages/register-page/register-page";

export const authRoutes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            { path: 'login', component: LoginPage },
            { path: 'register', component: RegisterPage },
            { path: '**', redirectTo: 'login' }
        ]
    }
];

export default authRoutes;