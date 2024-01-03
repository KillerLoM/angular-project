import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { Lessons } from '../Model/lessons';
import { HtmlParser } from '@angular/compiler';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {
  url = ''
  constructor(private appService: AppService, @Inject(HttpClient)private http: HttpClient) { 
    this.url = this.appService.getUrlLessons();
  }
  getLessons(id: number): Observable<any> {

    let params = new HttpParams().set('id', id.toString()); 
    return this.http.get(`${this.url}/${id}?page=0`).pipe();
  }
}
