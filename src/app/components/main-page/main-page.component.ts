import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProjectService } from 'src/app/service/project.service';
import { ProjectInputBoxComponent } from '../dialogs/project-input-box/project-input-box.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  projectList$!: Observable<Project[]>;
  loggedIn!: boolean;

  constructor(
    private authService: AuthenticationService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectList$ = this.projectService.getProjects();
    this.authService
      .getLoggedIn()
      .subscribe((status) => (this.loggedIn = status));
  }

  openDialog() {
    let projectDialog = this.dialog.open(ProjectInputBoxComponent, {
      width: '400px',
      data: { project_name: '', description: '', start_date: '', target_date: '' },
    });

    projectDialog.afterClosed().subscribe((project) => {
      if (project) {
        this.projectList$ = this.projectService.addProject(project)
      }
    });
  }
}
