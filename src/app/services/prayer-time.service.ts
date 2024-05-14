import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrayerTimeService {
  constructor(private http: HttpClient) {}

  getPrayerTimes(date: Date, lat: number, long: number): Observable<[]> {
    return this.http.get<[]>(`http://api.aladhan.com/v1/timings?date=${date}&latitude=${lat}&longitude=${long}&method=4`);
  }
}
