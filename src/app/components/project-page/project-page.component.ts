import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Project } from 'src/app/models/project';
import { Section } from 'src/app/models/section';
import { ProjectService } from 'src/app/service/project.service';
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
    private dialog: MatDialog
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

    projectDialog.afterClosed().subscribe((section) => {
      if (section) {
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
}
