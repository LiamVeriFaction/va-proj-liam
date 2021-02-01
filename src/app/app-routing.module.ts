import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'projects/:id',
    component: ProjectPageComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
