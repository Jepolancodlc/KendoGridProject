import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puesto } from './model-puestos';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  configUrl = 'assets/puestos.json';

  constructor(private http: HttpClient) {
  }

  public getJSON(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(this.configUrl);
  }

}
