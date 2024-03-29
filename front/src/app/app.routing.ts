import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticatedLayoutComponent } from '@core/components/authenticated-layout/authenticated-layout.component';
import {
  NotAuthenticatedLayoutComponent
} from '@core/components/not-authenticated-layout/not-authenticated-layout.component';
import { AuthGuard } from '@guard/auth.guard';
import { RoleGuard } from '@guard/role.guard';
import { UserRole } from '@enum/user-role.enum';
import { PublicLayoutComponent } from '@core/components/public-layout/public-layout.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('./modules/stats/stats.module').then(m => m.StatsModule)
      }
    ],
  },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'create',
        loadChildren: () => import('./modules/create-bot-form/create-bot-form.module').then(m => m.CreateBotFormModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
        canActivate: [RoleGuard],
        data: {
          expectedRole: UserRole.admin
        }
      },
      {
        path: 'ui',
        loadChildren: () => import('./modules/ui/ui.module').then(m => m.UiModule)
      },
    ]
  },
  {
    path: '',
    component: NotAuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
    // { enableTracing : true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
