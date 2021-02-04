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
  sectionList$!: Observable<Section[]>;
  project!: Project;

  constructor(
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: Params) => {
      this.sectionList$ = this.projectService
        .getProject(+params.get('id'))
        .pipe(
          switchMap((project: Project) => {
            this.project = project;
            return this.sectionService.getSections(project.id);
          })
        );
    });
  }

  openDialog() {
    let projectDialog = this.dialog.open(SectionInputBoxComponent, {
      width: '250px',
      data: { heading: '', description: '' },
    });

    projectDialog.afterClosed().subscribe((section) => {
      if (section) {
        this.sectionList$ = this.sectionService.addSection(
          section,
          this.project.id
        );
      }
    });
  }

  getSectionIDs(slist: Section[]): string[] {
    return slist.map((section: Section) => {
      return section.id + '';
    });
  }

  taskMove() {
     this.sectionList$ = this.sectionService.getSections(this.project.id);
  }
}
