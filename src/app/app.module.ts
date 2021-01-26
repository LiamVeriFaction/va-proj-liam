import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './components/main-page/main-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { SectionComponent } from './components/section/section.component';
import { TaskComponent } from './components/task/task.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import {MatCardModule} from '@angular/material/card';
import { JwtInterceptor } from './helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NavBarComponent,
    ProjectCardComponent,
    SectionComponent,
    TaskComponent,
    ProjectPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
