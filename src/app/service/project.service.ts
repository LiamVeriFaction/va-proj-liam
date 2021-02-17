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

  /**
   * Get all the projects attached to the user
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${APIUrl}/project/`);
  }

  /**
   * Get a single project using it's id
   * @param id The desired project id
   */
  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${APIUrl}/project/${id}/`);
  }

  /**
   * Add a new project to the database
   * @param project The ProjectData of the new Prohect
   */
  addProject(project: ProjectData): Observable<Project[]> {
    return this.http.post<Project>(`${APIUrl}/project/`, project).pipe(
      switchMap(() => {
        return this.getProjects();
      })
    );
  }

  /**
   * Add a new section to a particular project
   * @param section the SectionData of the new section
   * @param id  The ID of the project the section is attached to
   */
  addSection(section: SectionData, id: number): Observable<Section[]> {
    return this.http
      .post<Section>(`${APIUrl}/project/${id}/section/`, section)
      .pipe(
        switchMap(() => {
          return this.getSections(id);
        })
      );
  }

  /**
   * Get all the sections assigned to a particular project
   * @param id The Project who's sections you want
   */
  getSections(id: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${APIUrl}/project/${id}/section/`);
  }

  /**
   * Edit a project
   * @param id The id of the project you want to edit
   * @param project The new ProjectData
   */
  editProject(id: number, project: ProjectData) {
    return this.http.patch<Project>(`${APIUrl}/project/${id}/`, project);
  }

  /**
   * Delete a project from the database
   * @param id the id of the project to delete
   */
  deleteProject(id: number) {
    return this.http.delete(`${APIUrl}/project/${id}/`);
  }
}
