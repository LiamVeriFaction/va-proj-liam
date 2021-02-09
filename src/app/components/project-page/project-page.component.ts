import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectData } from 'src/app/models/dialog-data/project.data';
import { SectionData } from 'src/app/models/dialog-data/section-data';
import { Project } from 'src/app/models/project';
import { Section } from 'src/app/models/section';
import { ProjectService } from 'src/app/service/project.service';
import { SectionService } from 'src/app/service/section.service';
import { ProjectInputBoxComponent } from '../dialogs/project-input-box/project-input-box.component';
import { SectionInputBoxComponent } from '../dialogs/section-input-box/section-input-box.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {
  sectionList!: Section[];
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private sectionService: SectionService,
    private router : Router,
  ) {}

  //Use the routed parameter to get the project and sections, storing both locally
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: Params) => {
      this.projectService
        .getProject(+params.get('id'))
        .subscribe((project: Project) => {
          this.project = project;
          this.projectService
            .getSections(project.id)
            .subscribe((sections: Section[]) => {
              this.sectionList = sections;
            });
        });
    });
  }

  addSectionDialog() {
    let projectDialog = this.dialog.open(SectionInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    projectDialog.afterClosed().subscribe((section: SectionData) => {
      if (section.heading) {
        this.projectService
          .addSection(section, this.project.id)
          .subscribe((sections: Section[]) => {
            this.sectionList = sections;
          });
      }
    });
  }

  //Section ID's need for CDK Drop List
  getSectionIDs(slist: Section[]): string[] {
    return slist.map((section: Section) => {
      return section.id + '';
    });
  }

  //The emitter either emits edit or delete to first argument.
  changeSection(event: [string, Section]) {
    //On edit, reopen the dialog for input but put current value in data
    if (event[0] === 'edit') {
      let taskDialog = this.dialog.open(SectionInputBoxComponent, {
        width: '250px',
        data: { heading: event[1].heading, description: event[1].description },
      });

      taskDialog.afterClosed().subscribe((section: SectionData) => {
        if (section.heading) {
          this.sectionService
            .editSection(event[1].id, section)
            .subscribe(() => this.refreshSections());
        }
      });
    } else if (event[0] === 'delete') {
      this.sectionService
        .deleteSection(event[1].id)
        .subscribe(() => this.refreshSections());
    }
  }

  refreshSections() {
    this.projectService
      .getSections(this.project.id)
      .subscribe((sections) => (this.sectionList = sections));
  }

  editProject() {
    let taskDialog = this.dialog.open(ProjectInputBoxComponent, {
      width: '400px',
      data: {
        project_name: this.project.project_name,
        description: this.project.description,
        start_date: this.project.start_date,
        target_date: this.project.target_date,
      },
    });

    taskDialog.afterClosed().subscribe((project: ProjectData) => {
      if (project.project_name) {
        this.projectService
          .editProject(this.project.id, project)
          .subscribe(() => this.refreshProject());
      }
    });
  }

  deleteProject(){
    this.projectService.deleteProject(this.project.id).subscribe(()=>(this.router.navigate(['/main'])))
  }

  refreshProject(){
    this.projectService.getProject(this.project.id).subscribe((project:Project) => (this.project = project));
  }
}
