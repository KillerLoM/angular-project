import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Course } from 'src/app/Model/course';
import { Goals } from 'src/app/Model/goals';
import { AppService } from 'src/app/Service/app.service';
import { CartService } from 'src/app/Service/cart.service';
import { CourseService } from 'src/app/Service/course.service';
import { LessonsService } from 'src/app/Service/lessons.service';
import { ShareService } from 'src/app/Service/shared/share.service';
import { WishlistService } from 'src/app/Service/wishlist.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  
})
export class DetailComponent implements OnInit {

  private idCourse : number;
  isValid = true;
  obj: Goals[] =[];
  isBuy = false;
  isAddedCart = false;
 
  isAddedLike = false;
  public numberOfLessons = 0;
  @Output() dataEvent = new EventEmitter<string>();


   courseDetails: Course| null = null;
  constructor(
    private shareService: ShareService,
    private courseService: CourseService,
    private lessonService: LessonsService,
    @Inject(Router) private router: Router,
    @Inject(AppService) public appService: AppService,
    @Inject(WishlistService) private wishListService: WishlistService,
    @Inject(CartService) private cartService: CartService,
    
    )
    {
    this.idCourse = this.shareService.getIdCourse();
      this.isValid = this.shareService.getLogin();

  }
  ngOnInit(){
    this.courseService.getDetailsCourse(this.idCourse).subscribe((data: Course) => {
      this.courseDetails = data;
      this.lessonService.getLessons(this.idCourse).subscribe(data => {
        this.numberOfLessons = data.numberOfItems;

      },Error =>{
        throw Error;
      })
    })
    this.courseService.getObjectiveCourse(this.idCourse).subscribe((objectives: any) => {
      this.obj = objectives.getCourseObjectives;
    }, Error => {
      throw new Error
    })
    this.wishListService.getStatusWishList(this.idCourse).subscribe((data: any) => {
      this.isAddedLike = data.checkUserLikedCourse.inWishlist;
      console.log(data.checkUserLikedCourse.inWishlist);
    })
    this.cartService.getStatusCart(this.idCourse).subscribe((data: any) => {
      this.isAddedCart = data.checkUserCartItem.inCart;
    })
  }
  addCart(){
    if(this.isValid){
      if(!this.isAddedCart){
        this.cartService.addCart(this.idCourse).subscribe(data =>{
          this.appService.notiSuccess('Đã thêm sản phẩm vào giỏ hàng','Thành công');
        })
        this.isAddedCart = !this.isAddedCart;
      }
      
    }
    else{
      this.appService.notiError('Bạn vui lòng đăng nhập','Lỗi');
      this.sendData();
    }
  }
  sendData() {
    const dataToSend = 'reset';
    this.dataEvent.emit(dataToSend);
  }
  addFavorite(){
    this.isAddedLike = !this.isAddedLike;
    if(this.isValid){
      if((this.isAddedLike)){
        this.wishListService.addWishList(this.idCourse).subscribe(wishList =>{
          
        })
      }
 
      if(!(this.isAddedLike)){
        this.wishListService.deleteWishList(this.idCourse).subscribe(wishList =>{
        })
      }
    }
    else{
      this.appService.notiError('Bạn vui lòng đăng nhập','Lỗi');
      this.sendData();
    }
    
  }
  handleBuyCourse(): void{
    this.isBuy = true;
  }
}
