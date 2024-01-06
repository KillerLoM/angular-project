import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/Model/course';
import { Enrollments } from 'src/app/Model/enrollments';
import { Record } from 'src/app/Model/record';
import { AppService } from 'src/app/Service/app.service';
import { CourseService } from 'src/app/Service/course.service';
import { EnrollmentsService } from 'src/app/Service/enrollments.service';
import { ShareService } from 'src/app/Service/shared/share.service';
import { WishlistService } from 'src/app/Service/wishlist.service';
import { LessonsComponent } from '../lessons/lessons.component';
import { LessonsService } from 'src/app/Service/lessons.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss']
})
export class MoreComponent {
  displayedColumns = [
    'title',
    'subtitle',
    'category',
    'rating',
    'price',
    'avatar',
    'handle',
  ];
  listCourses : Course[] =[];
  listEnrolls : Enrollments[] = [];
  listRecord: Record[] = [];
  data : Course[] = [];
  loadMore = true;
  currentPage = 0;
  numberOfElements = 5;
  numberOfPages = 0;
  isLast = false;


  isFirst = true;
  constructor(
    private shareService: ShareService,
    public appService: AppService,
    private wishListService: WishlistService,
    private enrollmentsService: EnrollmentsService,
    private courseService: CourseService,
    private lessonService: LessonsService,
    @Inject(Router) private router: Router){

    }
    async ngOnInit(): Promise<void> {
      await this.getData();
      this.createData();
    }
  async getData(): Promise<void> {
    try {
      const data: any = await this.enrollmentsService.getAllEnroll().toPromise();
      this.listEnrolls = data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  createData(): void {
    this.listRecord = [];
  
    for (let i = 0; i < this.listEnrolls.length; i++) {
      this.listRecord[i] = {
        name: '',             
        current_lessons: 0,   
        max_lessons: 0,       
        finish: '',           
        name_lecturer: '', 
        id_course : this.listEnrolls[i].course_id,   
      };
  
      this.courseService.getDetailsCourse(this.listEnrolls[i].course_id).subscribe((data: Course) => {
        this.listRecord[i].name = data.title;
        console.log(data.title)
        this.listRecord[i].name_lecturer = data.name_user;
        this.lessonService.getLessons(this.listEnrolls[i].course_id, 0).subscribe((lessonData: any) => {
          this.listRecord[i].max_lessons = lessonData.numberOfItems;
        }, error=>{
          console.log(error);
        })
      })
  
      this.listRecord[i].current_lessons = this.listEnrolls[i].progress;
      this.listEnrolls[i].isCompleted == true ? this.listRecord[i].finish = "Đã hoàn tất" : this.listRecord[i].finish = "Đang học";
    }
  
    console.log(this.listRecord);
  }
  handleSendData(id: number): void{
    this.shareService.setIdDetail(id);
    this.router.navigate(['lessons', id] );
  }

}
