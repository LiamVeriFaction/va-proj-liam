import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Project } from '../models/project';
import { ProjectService } from './project.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolverService implements Resolve<Project> {
  /**
   * Preloads the project data before the page is displayed
   * @param route The router containing the project id
   * @param state
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Project> {
    return this.projectService.getProject(route.params.id);
  }

  constructor(private projectService: ProjectService) {}
}
