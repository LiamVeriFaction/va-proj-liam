import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

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
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { UserPageComponent } from './components/user-page/user-page.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskInputBoxComponent } from './components/dialogs/task-input-box/task-input-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectInputBoxComponent } from './components/dialogs/project-input-box/project-input-box.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SectionInputBoxComponent } from './components/dialogs/section-input-box/section-input-box.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoteComponent } from './components/note/note.component';
import { NoteInputBoxComponent } from './components/dialogs/note-input-box/note-input-box.component';
import { ConfirmBoxComponent } from './components/dialogs/confirm-box/confirm-box.component';
import { AuthenticationService } from './service/authentication.service';
import { appInitializer } from './service/app-initializer';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    NavBarComponent,
    ProjectCardComponent,
    SectionComponent,
    TaskComponent,
    ProjectPageComponent,
    UserPageComponent,
    LoginComponent,
    TaskInputBoxComponent,
    ProjectInputBoxComponent,
    SectionInputBoxComponent,
    NoteComponent,
    NoteInputBoxComponent,
    ConfirmBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatExpansionModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthenticationService],
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    MatDatepickerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
