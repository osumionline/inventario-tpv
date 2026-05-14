import { Routes } from '@angular/router';
import isLoggedGuardFn from '@guard/auth.guard.fn';
import Login from '@modules/login/login';

const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'main',
    loadComponent: () => import('@modules/main/main'),
    canActivate: [isLoggedGuardFn],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

export default routes;
