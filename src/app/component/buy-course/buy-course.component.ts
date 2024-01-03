import { SelectionModel } from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Component, Inject, OnInit } from '@angular/core';
import { Cart } from 'src/app/Model/cart';
import { Course } from 'src/app/Model/course';
import { AppService } from 'src/app/Service/app.service';
import { CartService } from 'src/app/Service/cart.service';
import { EnrollmentsService } from 'src/app/Service/enrollments.service';
import { ShareService } from 'src/app/Service/shared/share.service';
import { catchError } from 'rxjs';
interface Transaction {
  item: string;
  cost: number;
}
@Component({
  selector: 'app-buy-course',
  templateUrl: './buy-course.component.html',
  styleUrls: ['./buy-course.component.scss']
})
export class BuyCourseComponent implements OnInit{
  displayedColumns: string[] = ['item', 'cost'];
  displayedColumns2 : string[] = ['select', 'position', 'name', 'price'];
  totalSelectedPrice: number = 0;
  carts: Course[] = [];
   sum = 0;
   selection = new SelectionModel<Course>(true, []);
   dataSource = new MatTableDataSource<Course>();
  constructor(
    @Inject(CartService) private cartService: CartService,
    @Inject(EnrollmentsService) private enrollService: EnrollmentsService,
    private shareService: ShareService,
    public appService: AppService
  ){

  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void{
      this.cartService.getCart().subscribe((data: any) => {
        this.carts = data.getAllMyCartItems.content;
        this.carts.forEach((course, index) => {
          course.position = index + 1;
        });
        this.dataSource.data = this.carts;
        console.log(this.carts);
      })  
      this.cartService.getTotalBill().subscribe((data: any) => {
        this.sum = data.getMyCartBill.totalPrice;

        console.log(this.sum)
      })
    }
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    toggleAllRows() {
      if (this.isAllSelected()) {
        this.selection.clear();
        this.totalSelectedPrice = 0; 
      } else {
        this.selection.select(...this.dataSource.data);
        this.updateSelectedTotal(); 
      }
    }
    updateSelectedTotal(): void {
      this.totalSelectedPrice = this.selection.selected.reduce((acc, curr) => acc + curr.price, 0);
    }
    checkboxLabel(row?: Course): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      const label = `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position || 0 + 1}`;
      this.updateSelectedTotal();
      return label;
    }
    handlePaymentAll(): void{
      let email = this.shareService.getEmaiUser();
        for(let item of this.carts){
          this.enrollService.addEnroll( email, item.id,).subscribe((data =>{
            this.appService.notiSuccess('Đã mua thành công khóa học','Thành công');
            this.cartService.deleteCart(item.id).subscribe((data: any) =>{
              setInterval(() =>{location.reload()}, 1000)
            }, catchError => {
              console.log(Error);
            })
          }))
        }
    }
}
