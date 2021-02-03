import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { SectionData } from '../models/dialog-data/section-data';
import { Section } from '../models/section';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param id the project id
   */

  getSections(id: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${APIUrl}/project/${id}/section/`)
  }

  /**
   *
   * @param id the section id
   */
  getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${APIUrl}/section/${id}/`);
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
}
