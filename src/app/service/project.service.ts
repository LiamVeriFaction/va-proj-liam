import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { Project } from '../models/project';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }


  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${APIUrl}/project/`)
  }

  getProject(id:number) : Observable<Project>{
    return this.http.get<Project>(`${APIUrl}/project/${id}/`)
  }
}