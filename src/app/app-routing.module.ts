import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';

const routes: Routes = [

  {path:'',component: MainPageComponent},
  {path:'projects/:id', component: ProjectPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
