import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Project } from 'src/app/models/project';
import { Section } from 'src/app/models/section';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProjectService } from 'src/app/service/project.service';
import { SectionService } from 'src/app/service/section.service';
import { SectionInputBoxComponent } from '../dialogs/section-input-box/section-input-box.component';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {

  sectionList! : Section[];
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: Params) =>{
      this.projectService.getProject(+params.get('id')).subscribe(
        (project: Project) =>{
          this.project = project;
          this.projectService.getSections(project.id).subscribe(
            (sections : Section[]) => {
              this.sectionList = sections;
            }
          )
        }
      )
    })
  }

  openDialog() {
    let projectDialog = this.dialog.open(SectionInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    projectDialog.afterClosed().subscribe((section) => {
      if (section) {
      this.projectService.addSection(section,this.project.id).subscribe((sections: Section[])=>{
        this.sectionList = sections;
      });
      }
    });
  }

  getSectionIDs(slist: Section[]): string[] {
    return slist.map((section: Section) => {
      return section.id + '';
    });
  }
  

}
