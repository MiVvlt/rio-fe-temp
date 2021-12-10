import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICareWorkerDTO } from '../interface/dto';
import {environment} from '../../environments/environment';
import { CareWorker } from '../interface/care-worker';



@Injectable({
  providedIn: 'root'
})
export class CareWorkerService {

  constructor(private http: HttpClient) { }

  public async getCareWorkerMe(): Promise<CareWorker> {
    return new Promise((resolve, reject) => {
        this.http.get(`${environment.backendForFrontend}/care-worker/me`, {headers: {Auth: 'True'}})
            .subscribe((result: ICareWorkerDTO) => {
                resolve(new CareWorker().createFromDTO(result));
            }, reject);
    });
  }
}
