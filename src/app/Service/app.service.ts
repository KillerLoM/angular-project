import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = 'http://localhost:9000/api';
  constructor(private http: HttpClient,
      private toast: NgToastService,
) { }
  geturlLogin(){
    return this.url + '/auth/login';
  }
  getUrlSignUp(){
    return this.url + '/auth/register';
  }
  getUrlLogout(){
    return this.url + '/auth/logout';
  }
  getUrlValidate(){
    return this.url + '/auth/validate-token';
  }
  getUrlCourses(){
    return this.url + '/courses';
  }
  getUrlLessons(){
    return this.url + '/lessons';
  }
  getUrlWishlist(){
  return this.url + '/wishlist/';
  }
  getUrlGoals(){
    return this.url + '/objectives/course/';
  }
  getUrlCart(){
    return this.url + '/cart/'
  }
  getUrlCartMine(){
    return this.url + '/cart/mine'
  }
  getUrlEnroll(){
    return this.url + '/enrollments/'
  }
  notiSuccess(title: string, message: string){
    this.toast.success({
      detail: title,
      summary: message,
      duration: 3000,
      position: 'topRight',
    });
  }
  notiError(title: string, message: string){
    this.toast.error({
      detail: title,
      summary: message,
      duration: 3000,
      position: 'topRight',
    });
  }
  notiWarning(title: string, message: string){
    this.toast.warning({
      detail: title,
      summary: message,
      duration: 3000,
      position: 'topRight',
    })
  }
  logOut(){
    localStorage.clear();
  }
  formatCurrency(input: number): string {
    let million = Math.floor(input / 1000); 
    let output = '';
    if (million >= 1) {
      output = million + ' triệu';
    }
    let thousand = input % 1000; 
    if (thousand >= 1) {
      output += ' ' + thousand + ' nghìn'; 
    }
    return output;
  }
  

}
