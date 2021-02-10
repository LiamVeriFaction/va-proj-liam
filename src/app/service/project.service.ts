import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { ProjectData } from '../models/dialog-data/project.data';
import { SectionData } from '../models/dialog-data/section-data';
import { Project } from '../models/project';
import { Section } from '../models/section';

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

  addProject(project: ProjectData): Observable<Project[]> {
    return this.http.post<Project>(`${APIUrl}/project/`, project).pipe(
      switchMap(() => {
        return this.getProjects();
      })
    );
  }

  addSection(section: SectionData, id: number): Observable<Section[]> {
    return this.http
      .post<Section>(`${APIUrl}/project/${id}/section/`, section)
      .pipe(
        switchMap(() => {
          return this.getSections(id);
        })
      );
  }

  getSections(id: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${APIUrl}/project/${id}/section/`);
  }

  editProject(id:number, project: ProjectData){
    return this.http.patch<Project>(`${APIUrl}/project/${id}/`,project);
  }

  deleteProject(id:number){
    return this.http.delete(`${APIUrl}/project/${id}/`);
  }

  moveSection(){

  }
}
