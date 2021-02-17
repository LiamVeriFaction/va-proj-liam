import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { ProjectResolverService } from './service/project-resolver.service';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: UserPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects/:id',
    component: ProjectPageComponent,
    resolve: { project: ProjectResolverService },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
