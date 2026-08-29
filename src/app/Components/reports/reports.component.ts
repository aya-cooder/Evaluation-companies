import { Component } from '@angular/core';
import { TaqimService } from '../../Services/taqim.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent  {

  companyid?: number;
  report: string=''
  reportEdit:string=''
  reportlmetmelraf:string=''
  companySearch: string = ''; // النص المدخل للبحث

  requestTypeFilter: string = '';


  requestTypes = [
    { label: 'None', value: '' },
    { label: 'بيرفكت سيرفاى', value: 45 },
    { label: 'إسبكترم', value: 46 },
    { label: 'الجيزة', value: 47 },
    { label: 'الماسة', value: 48 },
    { label: 'جيومكانى', value: 49 },
    { label: 'ماستر سيرفاى', value: 50 },
    { label: 'ايدج برو', value: 51 },
    { label: 'سيفل كاد', value: 52 },
    { label: 'المصرية الكويتية', value: 53 },
    { label: 'انفو فاكت', value: 54 },
    { label: 'هاى ليفل', value: 55 },
    { label: 'زون سيرفاي', value: 56 },
    { label: 'MSD', value: 57 },
    { label: 'الصفا سيرفاى', value: 60 },
    { label: 'الاستشارى سيرفاى', value: 61 },
    { label: 'بريسيشن سيرفاى', value: 62 },
    { label: 'بي ام سي سيرفاي', value: 63 },
    { label: 'جيوسكيل', value: 64 },
    { label: 'عمارنه للمقاولات', value: 65 },
    { label: 'النقيب', value: 66 },
    { label: 'وايز جروب', value: 67 },
    { label: 'هندسه البناء', value: 68 },
    { label: 'المستقبل', value: 69 },
    { label: 'الصفا للمقاولات', value: 70 },
    { label: 'المجد', value: 72 },
    { label: 'اليمامة', value: 74 },
    { label: 'المصرية للخدمات', value: 76 },
    { label: 'انيكس', value: 79 },
    { label: 'المصرية المساحة', value: 80 },
    { label: 'بروكسيما', value: 81 },
    { label: 'تشاري البحر الاحمر', value: 84 },
    { label: 'فيرتكس', value: 86 },
    { label: 'ام جى اى اس', value: 88 },
    { label: 'الطلبات المستردة', value: 89 },
    { label: 'الكريم للمقاولات', value: 99 }
  ];
  filteredRequestTypes = [...this.requestTypes]; // نسخة مفلترة لعرض الشركات
  companyForm = new FormGroup({
    companyid: new FormControl(null),  // Default value can be null or 0
    report: new FormControl(''),        // Default value for report field
    reportEdit: new FormControl('') ,    // Default value for reportEdit field
    reportlmetmelraf: new FormControl('') 
  });

  constructor( private reportservice:TaqimService, private toaster:ToastrService,){}
  
 

  filterBasedonCompanyId(userCompanyId: number) {
    if (userCompanyId) {
      this.requestTypes = this.requestTypes.filter(item => item.value === userCompanyId);
    }
  }

  filterCompanies() {
    const searchTerm = this.companySearch.toLowerCase();
    this.filteredRequestTypes = this.requestTypes.filter(company =>
      company.label.toLowerCase().includes(searchTerm)
    );
  }
  onCompanyChange(companyId: any): void {
    console.log('Selected Company:', companyId);
    // هنا يمكنك إضافة أي منطق لتحديث التقرير بناءً على الشركة المختارة
  }

  onSubmit() {
    if (this.companyid && this.report ) {
      // Send data to the service
      this.reportservice.InsertReport(this.companyid, this.report).subscribe(
        response => {
          this.toaster.success(response.message, 'Success');
        },
        error => {
          this.toaster.error(error.error.message, 'Error');
        }
      );
    } else {
      this.toaster.error('Please fill in all required fields.');
    }
  }
  submitEdit(){
      if (this.companyid &&  this.reportEdit) {
        // Send data to the service
        this.reportservice.InsertEditReport(this.companyid,  this.reportEdit).subscribe(
          response => {
            this.toaster.success(response.message, 'Success');
          },
          error => {
            this.toaster.error(error.error.message, 'Error');
          }
        );
      } else {
        this.toaster.error('Please fill in all required fields.');
      }
    }

    submitlmetmelraf(){
      if (this.companyid &&  this.reportlmetmelraf) {
        // Send data to the service
        this.reportservice.Insertlmetmelraf3Report(this.companyid,  this.reportlmetmelraf).subscribe(
          response => {
            this.toaster.success(response.message, 'Success');
          },
          error => {
            this.toaster.error(error.error.message, 'Error');
          }
        );
      } else {
        this.toaster.error('Please fill in all required fields.');
      }

    }
  
}
