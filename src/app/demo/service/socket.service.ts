import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // Import HttpClient

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private timerUpdatesSubject = new BehaviorSubject<any>(null);
  timerUpdates$ = this.timerUpdatesSubject.asObservable();

  private partCountUpdatesSubject = new BehaviorSubject<any>(null);
  partCountUpdates$ = this.partCountUpdatesSubject.asObservable();

  private machineDataSubject = new BehaviorSubject<{ [key: string]: any }>({});
  machineData$ = this.machineDataSubject.asObservable();

  constructor(private socket: Socket, private http: HttpClient) {  // Inject HttpClient
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('send_status', (data: any) => {
      this.machineDataSubject.next(data);
    });
  }

  getLiveData(): Observable<any> {
    return this.socket.fromEvent<any>('send_status');
  }
  getLiveDataavg(): Observable<any> {
    return this.socket.fromEvent<any>('average_cycle_times');
  }

  private apiUrl = 'http://192.168.16.138:5000/update_mode';

  updateMachineMode(machinename: string, mode: string, itemcode: string, process_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { machinename, mode, itemcode, process_name, };
  
    return this.http.post(this.apiUrl, body, { headers });
  }
}
