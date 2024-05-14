import { ActivitiesService } from './../services/activities.service';
import { PrayerTimeService } from './../services/prayer-time.service';
import { daily } from './../models/daily.d';
import { current } from './../models/current.d';
import { WeatherService } from './../services/weather.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { prayers } from '../models/prayer';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexTheme,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
};

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  apiKey: string;
  long: number = 0;
  lat: number = 0;
  current: current = {} as current;
  daily: daily = {} as daily;
  fiveDaysData: any[] = [];
  fiveDaysTemp: any[] = [];
  dateNow: string = '';
  showLoading: boolean = true;
  prayerTimes: prayers = {} as prayers;
  weekDays: string[];
  nextFiveDays: any[] = [];
  constructor(
    private weatherService: WeatherService,
    private prayerTimeService: PrayerTimeService
  ) {
    // openweathermap.com auth key
    this.apiKey = '0854fad50aea1829edb062a336e390fb';

    this.weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // apex charts options

    this.chartOptions = {
      series: [
        {
          name: 'temperature',
          data: this.fiveDaysTemp,
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: '5 Days Forecast',
        align: 'left',
        style: {
          color: '#fff',
        },
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#fff'],
          },
        },
      },
      xaxis: {
        categories: this.nextFiveDays,
        labels: {
          style: {
            colors: '#fff',
          },
        },
      },
      theme: {
        mode: 'dark',
      },
    };
  }
  
  ngOnInit(): void {
    this.getLocation();
    this.getDate();
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.long = position.coords.longitude;
        this.lat = position.coords.latitude;
        this.getCurrent();
        this.getDaily();
        this.getPrayers();
      });
    }
  }

  // gets current weather data
  getCurrent() {
    this.showLoading = true;
    this.weatherService.getCurrent(this.apiKey, this.long, this.lat).subscribe({
      next: (res: any) => {
        this.current = res;
      },
      error: (err: HttpErrorResponse) => {
        // errors can be handled here
      },
      complete: () => {
        this.showLoading = false;
      },
    });
  }

  // gets current weather data
  getDaily() {
    this.showLoading = true;
    this.weatherService.getDaily(this.apiKey, this.long, this.lat).subscribe({
      next: (res: any) => {
        this.daily = res;
        for (let i = 0; i < this.daily.list.length; i += 8) {
          this.fiveDaysData.push(this.daily.list[i]);
          this.fiveDaysTemp.push(Math.floor(this.daily.list[i].main.temp));
        }
      },
      error: (err: HttpErrorResponse) => {
        // errors can be handled here
      },
      complete: () => {
        this.showLoading = false;
      },
    });
  }

  // gets current date as a string with format `day name | month name YYYY`
  getDate() {
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const now = new Date();
    const day: string = this.weekDays[now.getDay()];
    this.getNextFiveDays(day);
    var month = months[now.getMonth()];
    this.dateNow = `${day} | ${month} ${now.getFullYear()}`;
  }

  // gets prayer timings for current day
  getPrayers() {
    const date = new Date();
    this.prayerTimeService.getPrayerTimes(date, this.lat, this.long).subscribe({
      next: (res: any) => {
        this.prayerTimes = res.data.timings;
      },
      error: (err: HttpErrorResponse) => {},
    });
  }

  // gets a string[] with next five day depending on current day given as string
  getNextFiveDays(day: string) {
    const todayIndex = this.weekDays.indexOf(day);
    for (let i = 0; i <= 4; i++) {
      const nextDayIndex = (todayIndex + i) % this.weekDays.length;

      this.nextFiveDays.push(this.weekDays[nextDayIndex]);
    }
    return this.nextFiveDays;
  }
}
