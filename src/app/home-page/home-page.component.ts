import { AfterViewChecked, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, catchError, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs';
import { Category } from '../Model/category';
import { Course } from '../Model/course';
import { User } from '../Model/user';
import { AppService } from '../Service/app.service';
import { AuthService } from '../Service/auth.service';
import { CategoryService } from '../Service/category.service';
import { CourseService } from '../Service/course.service';
import { ShareService } from '../Service/shared/share.service';
import { Router } from '@angular/router';
import { pl_PL } from 'ng-zorro-antd/i18n';
import { WishlistService } from '../Service/wishlist.service';
import { CartService } from '../Service/cart.service';
import { SendSignalService } from '../Service/shared/send-signal.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],

})
export class HomePageComponent implements OnInit {

  ListCategories: Category[] | null = [];
  ListCourses: Course[] = [];
  CourseNames: string[] = [];
  user: User | null = null;
  notToken = false;
  isLogin = false;
  isSignUp = false;
  panelOpenState = true;
  isToken = false;
  isDetail = false;
  isBuy = false;
  numberLiked = 0;
  isCategory = false;
  idCourse = 0 ;
  availableDetail  = false;
  isSetting = false ;
  numberCarted = 0;
  isAboutUs = false;
  nameInput: string | null = null;
  control = new FormControl('');
  filteredItems: Observable<Course[]> | undefined;
  @Output() dataEvent = new EventEmitter<String>();
  private checkValidCalled: boolean = false;
  @Input() valid: boolean | undefined;
  dataFromChild: string | undefined;
  receivedSignal: number = 0;
  private subscription: Subscription | null = null;

  inputForm = this._formBuilder.group({
    'inputControl': [''],
  });
  constructor(
    @Inject(AppService) public appService: AppService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(CategoryService) private categoryService: CategoryService,
    @Inject(ShareService) private shareService: ShareService,
    @Inject(CourseService) private courseService: CourseService,
    @Inject(Router) private router: Router,
    @Inject(WishlistService) private wishlistService: WishlistService,
    @Inject(CartService)  private cartService: CartService,
    private signalService: SendSignalService,
    
    
    private _formBuilder: FormBuilder
  ) {  
    this.subscription = this.signalService.signal$.subscribe((signal) => {
      this.receivedSignal = signal;
      console.log(signal)
    });
    }
  ngOnInit() {
    this.shareService.setLogin(this.checkValid())
    this.getAllCategories();
    this.setupSearchControl();
    if(this.shareService.getDetail() != 0){
      this.availableDetail = true;
      this.handleClick(this.shareService.getDetail());
    }
  }

  private setupSearchControl() {
    
    this.control.valueChanges.pipe(
      debounceTime(300),
      filter((value: string | null) => !!value && value.trim().length > 2),
      switchMap(value => this.courseService.searchCourses(value || ''))
    ).subscribe((data: any) => {
      this.ListCourses = data.searchForCourseByTitle.content;
      this.CourseNames = data.searchForCourseByTitle.content.map((course: any) => course.title);
    });

    this.filteredItems = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    
  }

  private _filter(value: string): Course[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.ListCourses.filter(course =>
        course.title.toLowerCase().includes(filterValue) ||
        course.subtitle.toLowerCase().includes(filterValue) ||
        course.category.toLowerCase().includes(filterValue)

        
      );
    } else {
      return this.ListCourses;
    }
  }

  _normalizeFilter(opt: Course[], value: string): Course[] {
    const filterValue = value.toLowerCase();
    return opt.filter(course =>
      course.title.toLowerCase().includes(filterValue) ||
      course.subtitle.toLowerCase().includes(filterValue) ||
      course.category.toLowerCase().includes(filterValue)
      
    );
  }
  checkValid() {
    let token = localStorage.getItem('token');
    if (token == null) {
      this.notToken = true;
      this.isToken = false;
      return  false;
    } else {
      this.authService.getUserProfile().subscribe(
        (userOutput: any) => {
          this.user = userOutput;
          this.appService.notiSuccess(
            'Đã đăng nhập',
            'Chào mừng bạn đã quay trở lại hệ thống'
          );
          this.isToken = true;
          this.shareService.setLogin(true);
          this.getCartAndFavoriteNumber();
          if (this.user?.userDTO) {
            this.shareService.setEmaiUser(this.user?.userDTO.email)
            let stringName = this.user?.userDTO.fullname.split('');
            let nameDisplay = stringName[0].concat(stringName[1]);
            for (let i = stringName.length - 1; i >= 0; i--) {
              if (stringName[i] == ' ') {
                nameDisplay = stringName[0].concat(stringName[i + 1]);
              }
            }
            this.nameInput = nameDisplay;
          }

          return true;
        },
        (Error) => {
          this.notToken = true;
          this.isToken = false;

          this.appService.notiWarning(
            'Phiên đăng nhập đã hết hạn',
            'VUi lòng đăng nhập lại'
          );
        }
      );
    }
    return false;
  }

  getCartAndFavoriteNumber(): void{
    this.wishlistService.getWishListMine().subscribe((wishList) => {
      this.numberLiked = wishList.getMyWishlistPaged.totalElements;
      console.log( wishList);
    })
    this.cartService.getTotalCart().subscribe((totalCart) => {
      this.numberCarted = totalCart.countMyCartItems.cartCount;
    })
  }
  handleLogin() {
    this.reset();
    this.isLogin = true;

  }

  handleSignUp() {
    this.reset();
    this.isSignUp = true;
  }

  reset() {
    this.isLogin = false;
    this.isSignUp = false;
    this.isDetail = false;
    this.isBuy = false;
    this.isSetting = false;
    this.isAboutUs = false;
  }
  handleClick(id: number){

      this.reset();
      
      if(this.control ||  this.availableDetail){
        this.control.reset(); 
        this.idCourse = id;
        this.shareService.setIdCourse(this.idCourse);
        setTimeout(() => {
      
          this.isDetail = true;

        }, 1000)
      }

  }
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(
      (data: any) => {
        this.ListCategories = data;
      },

    );
  }
  handleReset(){
    this.reset();
    // location.reload();
  }
  sendData(category: string | undefined): void {
    if (category) {
      this.router.navigate(['/category', category]);
      this.shareService.setCategory(category);
    }
  }

  sendId(id: any) {
    this.shareService.setIdCoures(id);
  }

  receiveData(data: string) {

    if(data == 'reset'){
      this.reset();
        this.handleLogin();
        console.log(this.isDetail)
        return;
    }
    if(data == 'buy'){
      this.reset();
      this.isDetail = false;
      this.isBuy = true;
      return;
    }
    if(data == 'getdata'){
      this.getCartAndFavoriteNumber();
    }
   
  }
  handleSetting(){
    this.reset();
    this.isSetting = true;
  }
  handleSignOut(): void{
    localStorage.clear();
    this.authService.logout().subscribe(data => {
      this.appService.notiSuccess("Đã đăng xuất","Hẹn gặp lại bạn cùng FEDUCATION")
    }, Errror =>{
      this.appService.notiSuccess("Đã đăng xuất","Hẹn gặp lại bạn cùng FEDUCATION")
    })
    location.reload();
  }
  handleGetAboutUs(){
    this.reset();
    this.isAboutUs = true;
  }
}
