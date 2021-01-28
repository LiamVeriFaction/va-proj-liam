import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { Section } from '../models/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient) { }

  getSections(id : number) : Observable<Section[]>{
    return this.http.get<Section[]>(`${APIUrl}/project/${id}/section/`)
  }


  getSection(id : number) : Observable<Section>{
    return this.http.get<Section>(`${APIUrl}/section/${id}/`)
    
  }
}


