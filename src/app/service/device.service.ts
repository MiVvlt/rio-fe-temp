import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Device} from '../interface/device';



@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }


  public async registerDevice(device: Device): Promise<void> {
    return new Promise((resolve, reject) => {
        this.http.post(`${environment.backendForFrontend}/device`, {
            token: device.token
        }, {headers: {Auth: 'True'}})
            .subscribe((data) => {
              console.log(data);
                resolve();
            }, reject);
    });
}
}
