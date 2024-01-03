import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private cagtegory: string | null = "all";
  private idCourseHigh: number[] | null = null;
  private checkValid: boolean = false;
  private idCourse: number  = 8;
  private emailUser = '';
  private isLogin = false;
  constructor() { }
  setCategory(categoryInput: string){
    this.cagtegory = categoryInput;
  }
  setIdCoures(idCourseHigh: number[]){
    this.idCourseHigh = idCourseHigh;
  }
  setEmaiUser(input: string){
    this.emailUser = input;
  }
  getEmaiUser(){
    return this.emailUser;
  }
  setIdCourse(input: number){
    this.idCourse = input;
  }
  getCategory(){
    return this.cagtegory;
  }
  getIdCourseHigh(){
    return this.idCourseHigh;
  }
  setCheckValid(input: boolean){
    this.checkValid = input;
  }
  getCheckValid(): boolean{
    return this.checkValid;
  }
  getIdCourse(): number{
    return this.idCourse;
  }
  setLogin(input: boolean){
    this.isLogin = input
  }
  getLogin(): boolean{
    return this.isLogin;
  }
}
