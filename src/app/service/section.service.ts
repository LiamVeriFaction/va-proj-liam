import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { APIUrl } from '../models/api';
import { Section } from '../models/section';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private http: HttpClient) { }

  getSections(id : number){
    return this.http.get<Section[]>(`${APIUrl}/project/${id}/section/`).pipe(map((data) => {
      console.log(data)
      return data
    }))
  }
}


