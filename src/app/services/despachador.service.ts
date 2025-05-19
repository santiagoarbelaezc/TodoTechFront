import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PersonaDTO } from '../models/persona.dto';

@Injectable({
  providedIn: 'root'
})
export class DespachadorService {
  private apiUrl = 'https://todotechshopprojectsoftware.onrender.com/api/despachadores';

  constructor(private http: HttpClient) {}

  crearDespachador(persona: PersonaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, persona);
  }
}
