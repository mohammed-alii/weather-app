import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'weather-app';

  apiKey: any
  constructor(private http: HttpClient) {

    this.apiKey =  '0854fad50aea1829edb062a336e390fb'
  }
  ngOnInit(): void {
}

}
