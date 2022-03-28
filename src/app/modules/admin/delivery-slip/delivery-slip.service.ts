import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, take } from 'rxjs';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class DeliverySlipService {
    
}