import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Project } from 'src/app/models/project';
import { Section } from 'src/app/models/section';
import { ProjectService } from 'src/app/service/project.service';
import { SectionService } from 'src/app/service/section.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css'],
})
export class ProjectPageComponent implements OnInit {
  sectionList$!: Observable<Section[]>;
  project$!: Observable<Project>;
  constructor(
    private route: ActivatedRoute,
    private sectionService: SectionService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.project$ = this.projectService.getProject(+params['id']).pipe(
        map((project: Project) => {
          this.sectionList$ = this.sectionService.getSections(project.id);
          return project;
        })
      );
    });
  }
}
