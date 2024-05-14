import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }
  getCurrent(key: string, lon: number, lat: number) :Observable<[]>{
    return this.http.get<[]>(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
  }
  getDaily(key: string, lon: number, lat: number) :Observable<[]>{
    return this.http.get<[]>(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
  }
  noLocationAccessCurrent(key: string, lon: number, lat: number) :Observable<[]>{
    return this.http.get<[]>(`https://api.openweathermap.org/data/2.5/weather?lat=29.9952793&lon=31.1824813&appid=${key}&units=metric`)
  }
  noLocationAccessDaily(key: string, lon: number, lat: number) :Observable<[]>{
    return this.http.get<[]>(`https://api.openweathermap.org/data/2.5/forecast?lat=29.9952793&lon=31.1824813&appid=${key}&units=metric`)
  }
}
