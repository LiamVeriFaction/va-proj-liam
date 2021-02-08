import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectData } from 'src/app/models/dialog-data/project.data';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/service/project.service';
import { ProjectInputBoxComponent } from '../dialogs/project-input-box/project-input-box.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  projectList!: Project[];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      this.projectList = projects;
    });
  }

  addProjectDialog() {
    let projectDialog = this.dialog.open(ProjectInputBoxComponent, {
      width: '400px',
      data: {
        project_name: '',
        description: '',
        start_date: '',
        target_date: '',
      },
    });

    projectDialog.afterClosed().subscribe((project: ProjectData) => {
      if (project.project_name) {
        this.projectService
          .addProject(project)
          .subscribe((projects: Project[]) => {
            this.projectList = projects;
          });
      }
    });
  }
}
