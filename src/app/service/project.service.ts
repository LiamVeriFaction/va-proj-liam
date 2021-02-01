import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { ProjectData } from '../models/dialog-data/project.data';
import { Project } from '../models/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${APIUrl}/project/`);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${APIUrl}/project/${id}/`);
  }

  addProject(project : ProjectData) : Observable<Project[]>{
    return this.http.post<Project>(`${APIUrl}/project/`, project).pipe(
      switchMap(() => {
        return this.getProjects();
      })
    )
  }
}
