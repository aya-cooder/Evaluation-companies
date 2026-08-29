import { Component, OnInit } from '@angular/core';
import { TaqimService } from '../../Services/taqim.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../Services/auth.service';
import * as XLSX from 'xlsx';

import { Chart, registerables } from 'chart.js';
import { company } from '../../Interfaces/taqim';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-view-report',
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent implements OnInit{
  selectedCompany: string | null = null; 

  companies: company [] = [];
    allCompanies: company[] = [];
    selectedCompanyNames: string[] = [];
    requestTypeFilter: string = '';
    addedDateFilter: string = '';
    addedSecondDate: string = '';
    chart: any;
  
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
  
 constructor(private taqim: TaqimService,private spinner:NgxSpinnerService ,   private _AuthService:AuthService , private toaster:ToastrService){
    Chart.register(...registerables);

  }

  ngOnInit(): void {

     this._AuthService.companyId.subscribe({
      next: (companyId) => {
        if (companyId) {
        this.filterBasedonCompanyId(companyId);
        } else {
    this.getFliterCompanies('');
  }
}
});
  }

    filterBasedonCompanyId(userCompanyId: number) {
      if (userCompanyId) {
        this.requestTypes = this.requestTypes.filter(item => item.value === userCompanyId);
      }
    }
    getFliterCompanies(requestType: any) {
      this.spinner.show();
      this.taqim.getReport(requestType).subscribe(
        res => {
          if (res.message) {
            this.toaster.warning(res.message, 'No Reports Found', { timeOut: 3000 });  // Display warning toast
            this.companies = [];  // Empty companies list
          } else {
            this.companies = res;
            this.allCompanies = res;
          }
          this.spinner.hide();
        },
        error => {
          console.error('Error fetching data:', error);
          this.toaster.error('لا يوجد تقرير لتلك الشركة ', 'Error', { timeOut: 3000 });  // Display error toast
          this.spinner.hide();
        }
      );
    }
    
  
    applyRequestTypeFilter(requestType: string): void {
      this.requestTypeFilter = requestType;
      this.getFliterCompanies(requestType);
    }
    
      exportToExcel(): void {
        const dataToExport = this.companies.map((item, index) => ({
          'العدد': index + 1,
          'اسم الشركة': item.companyName,
          ' طلبات الشركات الجديدة  ': item.report,
          ' التعديلات': item.reportEdit,
          ' الطلبات التي لم يتم رفعها ': item.reportLmetmelraf ,
          '   التاريخ   ': item.date ,
          '   Created by   ': item.user ,



        }));
    
        // تحويل الكائنات إلى ورقة Excel
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
        XLSX.writeFile(workbook, '    تقرير الشركات  .xlsx');
      }

}
