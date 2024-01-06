import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Model/user';
import { AppService } from 'src/app/Service/app.service';
import { AuthService } from 'src/app/Service/auth.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  emailInput = 'email@example.com';
  user: User | undefined;
  idUser = 0;
  nameUser = 'example';
  type= true;
  isChangePassword = false;
  constructor(
    private appService: AppService,
    private authService: AuthService,
    @Inject(Router) private router: Router,
  ) {
     
  }
  ngOnInit(): void {
   this.getUserInfo();

  }
  getUserInfo(): void {
    this.authService.getUserProfile().subscribe((data: any) => {
      this.user = data;
      this.emailInput = this.user?.userDTO.email || 'example@gmail.com';
      this.idUser = this.user?.userDTO.id || 0;
      this.nameUser = this.user?.userDTO.fullname || 'example';
      
    })
  }
  updateUser(): void{
    if(this.user?.userDTO.createdAt){
      this.authService.updateUser(this.idUser, this.nameUser, this.emailInput, this.user?.userDTO.createdAt).subscribe((data: any) =>{
        this.appService.notiSuccess("Cập nhật thành công","Đã cập nhật thành công thông tin của bạn");
      })
    }
  } 
  handleChangePassword(): void{
    if(this.isChangePassword){
      this.isChangePassword = false;
    }
    else {this.isChangePassword = true;}

  }
  changePassword(passwordCurent: string, passwordNew: string, passwordConfirm: string): void{
    if(passwordNew != passwordConfirm){
      this.appService.notiWarning("DỖI","Bạn vui lòng nhập mật khẩu mới trùng với xác nhận mật khẩu");
      return ;
    }
    else{
      this.authService.changePassword(passwordCurent, passwordNew, passwordConfirm).subscribe(data => {
        this.appService.notiSuccess("Thành công","Bạn đã cập nhật thành công mật khẩu");
        this.router.navigate(['']);
      },
      Errror=>{
        this.appService.notiError("OOP! Lỗi mất rồi","Bạn vui lòng kiểm tra lại nhé!")
        return;
      })
    }
  }
}
