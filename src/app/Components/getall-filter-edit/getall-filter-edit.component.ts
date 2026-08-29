import { Component, OnInit } from '@angular/core';
import { company } from '../../Interfaces/taqim';
import { TaqimService } from '../../Services/taqim.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Chart, registerables } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { ChartDialogEDitComponent } from '../chart-dialog-edit/chart-dialog-edit.component';
import * as XLSX from 'xlsx';
import { AuthService } from '../../Services/auth.service';



@Component({
  selector: 'app-getall-filter-edit',
  templateUrl: './getall-filter-edit.component.html',
  styleUrl: './getall-filter-edit.component.css'
})
export class GETAllFilterEditComponent  implements OnInit{
  selectedCompany: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;

  companies: company[] = [];
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



  constructor(private taqim:TaqimService,private spinner:NgxSpinnerService , public dialog:MatDialog , private _AuthService:AuthService){
    Chart.register(...registerables);

  }

  ngOnInit(): void {
    this._AuthService.companyId.subscribe(()=>{

      this.filterBasedonCompanyId(this._AuthService.companyId.getValue())

    })
  }

  filterBasedonCompanyId(userCompanyId: number) {
    if (userCompanyId) {
      this.requestTypes = this.requestTypes.filter(item => item.value === userCompanyId);
    }
  }
  getFliterCompanies(requestType: string, addedDate: string, addedSecondDate: string) {
    this.spinner.show();
    this.taqim.GetAllFilterEdit(requestType, addedDate, addedSecondDate).subscribe(
      res => {
        this.companies = res;
        this.allCompanies = res;
        this.spinner.hide();
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

 applyRequestTypeFilter(requestType: string): void {
    this.requestTypeFilter = requestType;
  }

  applyAddedDateFilter(date: string): void {
    this.addedDateFilter = date;
  }

  applyAddedSecondDateFilter(date: string): void {
    this.addedSecondDate = date;
  }

  applyFilters(): void {
    this.getFliterCompanies(this.requestTypeFilter, this.addedDateFilter, this.addedSecondDate);
  }

  onStartDateFilterChange(event: any): void {
    const date = (event.target as HTMLInputElement).value;
    this.applyAddedDateFilter(date);
  }

  onEndDateFilterChange(event: any): void {
    const date = (event.target as HTMLInputElement).value;
    this.applyAddedSecondDateFilter(date);
  }
  openAcceptedPercentageDialog(): void {
    this.dialog.open(ChartDialogEDitComponent, {
      width: '80%',
      data: { companies: this.companies, chartType: 'acceptedPercentage' }
    });
  }

  openTotalAcceptedDialog(): void {
    
    this.dialog.open(ChartDialogEDitComponent, {
      width: '80%',
      data: { companies: this.companies, chartType: 'totalAcceptedNumber' }
    });
  }
  exportToExcel(): void {
    const dataToExport = this.companies.map((item, index) => ({
      'العدد': index + 1,
      'اسم الشركة': item.companyName,
      'اجمالي عدد الطلبات': item.totalNumber,
      'اجمالي عدد الطلبات المقبولة': item.totalAcceptedNumber,
      'نسبة المقبول': item.acceptedPercentage + '%'
    }));

    // تحويل الكائنات إلى ورقة Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };
    XLSX.writeFile(workbook, 'فلتر التعديلات  الخاص بالشركات .xlsx');
  }
}

