import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PersonaDTO } from '../models/persona.dto';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private apiUrl = 'https://todotechshopprojectsoftware.onrender.com/api/vendedores';

  constructor(private http: HttpClient) {}

  crearVendedor(persona: PersonaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/crear`, persona);
  }
  
}
