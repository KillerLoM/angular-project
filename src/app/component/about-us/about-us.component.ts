import { Component } from '@angular/core';
import { MemberInGroup } from 'src/app/Model/member-in-group';


const ELEMENT_DATA: MemberInGroup[] = [
  {id: 20200275, name: 'Nguyễn Trung Nghĩa', role: "Thành viên nhóm", team: 'Backend'},
  {id: 20200281, name: 'Phan Dương Khải Nguyên', role: "Thành viên nhóm", team: 'Backend'},
  {id: 20200282, name: 'Trần Văn Nguyên', role: "Nhóm trưởng", team: 'Frontend'},
  {id: 20200333, name: 'Nguyễn Minh Tâm', role: "Nhóm phó (core frontned)", team: 'Fullstack'},
  {id: 20200398, name: 'Huỳnh Văn Tuấn', role: "Nhóm phó (core backend)", team: 'Backend'},
  {id: 19200339, name: 'Hồ Đức Khánh', role: "Thành viên nhóm", team: 'backend'},
];
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
