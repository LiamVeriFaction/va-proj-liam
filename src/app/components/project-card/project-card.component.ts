import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input() id! : number
  project$! : Observable<Project>


  constructor(private projectService : ProjectService) {

   }

  ngOnInit(): void {
    this.project$ = this.projectService.getProject(this.id);
  }

}
