import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Puesto } from './model-puestos';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  configUrl = 'http://localhost:3000/puestos';

  constructor(private http: HttpClient) {
  }

  public getJSON(): Observable<Puesto[]> {
    return this.http.get<Puesto[]>(this.configUrl);
  }

  post(puesto: Puesto): Observable<Puesto> {
    return this.http.post<Puesto>(this.configUrl, puesto);
  }

  // Borra todo el contenido excepto cuando es contenido agregado
  delete(puesto: Puesto): Observable<Puesto> {
    return this.http.delete<Puesto>(`${this.configUrl}/${puesto.id}`);
  }

  // Put aún sin probar correctamente
  put(puesto: Puesto): Observable<Puesto> {
    return this.http.put<Puesto>(`${this.configUrl}/${puesto.id}`, puesto);
  }
}
