import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/Model/category';
import { Course } from 'src/app/Model/course';
import { AppService } from 'src/app/Service/app.service';
import { CategoryService } from 'src/app/Service/category.service';
import { CourseService } from 'src/app/Service/course.service';
import { ShareService } from 'src/app/Service/shared/share.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  template: '<app-home-page (data)="receiveData($event)"></app-home-page>',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  receivedData: any;
  listCategories : Category[] = [];

  categoryNew : string = ''
    category: any;
  receiveData(data: any) {
    this.receivedData =  data;
    console.log(data);
  }
  // @Input() category: string | undefined;
  ListCourses: Course[] | null = [];
  ListOrtherCourses: Course[] | null = [];
  constructor(private categoryService: CategoryService, private appService: AppService,private route: ActivatedRoute,
    private courseService: CourseService,
    private sharedService: ShareService) {
      this.category = this.sharedService.getCategory();
      console.log(this.category);
      //this.handleCategory(this.category)


  }
  ngAfterViewInit(): void {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.listCategories = data;
      console.log(this.listCategories)
      this.categoryNew = this.category;
      let index = this.listCategories.findIndex(item => item.category === this.category );
      if(index !== -1){
        this.listCategories.splice(index, 1);
      }
      this.handleGetOrtherCourses();
    })
  }
  handleGetAllCourses() {
    throw new Error('Method not implemented.');
  }
  handleGetOrtherCourses(): void{
    for (let item of this.listCategories){
      this.categoryService.getCoursesCategories(item.category).subscribe((data: any) => {
        this.ListOrtherCourses = data.getCoursesByCategory;
        console.log(this.ListOrtherCourses)
      })
     
    }
  }
  handleCategory(name: any) { 
    this.categoryService.getCoursesCategories(name).subscribe((data: any) => {
      this.ListCourses = data.getCoursesByCategory;
      console.log(this.ListCourses);
    },Error => {
        this.appService.notiError("Đã có lỗi xảy ra", "Rất tiếc nhưng hình như đã có lỗi gì đó");
        location.reload();
    });
  }
  addToCart(course: any) {
    // Implement your logic to add to cart
    console.log('Added to Cart:', course.title);
  }

  addToWishlist(course: any) {
    // Implement your logic to add to wishlist
    console.log('Added to Wishlist:', course.title);
  }
  ngOnInit(){
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('category') ?? null;
      if (idParam !== null) {
        this.category = idParam;
      } else {
        console.error('No lesson ID found in the URL.');
      }
    });
    this.handleCategory(this.category); 
    this.handleGetOrtherCourses;   
  }
}

