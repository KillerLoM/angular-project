import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendSignalService {
  private signalSource = new Subject<number>;
  signal$ = this.signalSource.asObservable();
  
  constructor() { }
  sendSignal(signal: number){
    this.signalSource.next(signal);
  }
}
