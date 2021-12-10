import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {WorkerSession} from '../interface/worker-session';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerSessionService {

  constructor(private http: HttpClient) { }

  createWorkerSession(workerSession: WorkerSession): Observable<WorkerSession> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('jwt-token')
      })
    };


    return this.http.post<WorkerSession>(environment.backendForFrontend + '/worker-session', workerSession, httpOptions);
  }
}
