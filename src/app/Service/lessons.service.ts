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
  getLessons(id: number, page: number): Observable<any> {

    let params = new HttpParams().set('page', page.toString()); 
    
    return this.http.get(`${this.url}/${id}`,{params}).pipe();
  }
}
