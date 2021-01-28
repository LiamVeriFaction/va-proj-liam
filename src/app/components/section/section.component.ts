import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Section } from 'src/app/models/section';
import { Task } from 'src/app/models/task';
import { SectionService } from 'src/app/service/section.service';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  @Input() id! : number;
  section$! : Observable<Section>
  taskList$! : Observable<Task[]>

  constructor(private sectionService : SectionService, 
    private taskService: TaskService) { }

  ngOnInit(): void {
    this.section$ = this.sectionService.getSection(this.id);
    this.taskList$ = this.taskService.getTasks(this.id);
  }

}
