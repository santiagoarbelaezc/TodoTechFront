import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PersonaDTO } from '../models/persona.dto';

@Injectable({
  providedIn: 'root'
})
export class CajeroService {
  private apiUrl = 'https://todotechshopprojectsoftware.onrender.com/api/cajeros';

  constructor(private http: HttpClient) {}

  crearCajero(persona: PersonaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, persona);
  }
}
