import { Inject, Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = '';
  constructor(private appService: AppService,
    @Inject(HttpClient) private http: HttpClient) {
   }
   getAllCategories(){
    this.url = this.appService.getUrlCourses()+'/categories';
    return this.http.get(`${this.url}`).pipe();
   }
   getCoursesCategories(name: any){
    this.url = this.appService.getUrlCourses() +'/cat/';
    return this.http.get(`${this.url}${name}`).pipe();
   }
}
