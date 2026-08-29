import { Component, OnInit } from '@angular/core';
import { ApiStatusService } from './Services/api-status.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    apiWakingUp$ = this.apiStatus.wakingUp$;
    constructor( private apiStatus:ApiStatusService){}


  ngOnInit(): void {
    
  }
  title = 'Evaluation-companies';
}
