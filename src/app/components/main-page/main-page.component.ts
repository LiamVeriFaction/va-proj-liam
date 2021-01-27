import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Project } from 'src/app/models/project';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  projectList$ : Observable<Project[]>;
  
  constructor(private authService : AuthenticationService, private projectService : ProjectService) { 
    this.projectList$  = projectService.getProjects();
  }

  ngOnInit(): void {
    this.authService.login('liam','9ZmvnqK1G4rgPrTCJX').subscribe();
  }

  isLoggedIn() : boolean{
    return this.authService.loggedIn;
  }



}
