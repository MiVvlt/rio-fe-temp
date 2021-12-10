import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {TravelRequest} from '../interface/TravelRequest';
import * as moment from 'moment';



@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(private http: HttpClient) {}

  public async addTravel(travelRequest: TravelRequest): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('travelRequest :' + JSON.stringify(travelRequest));
        const user = JSON.parse(localStorage.getItem('user'));

        const startTime = new Date(travelRequest.startTime);
        const endTime = new Date(travelRequest.endTime);

        console.log('startTime: ' + JSON.stringify(startTime));
        console.log('endTime: ' + JSON.stringify(endTime));

        const start = moment(startTime).format('HH:mm');
        const end = moment(endTime).format('HH:mm');

        console.log('start: ' + start);
        console.log('end: ' + end);

        this.http.post(`${environment.backendForFrontend}/travel-time`, {
            careWorkerPersonnelId: user.uniqueId,
            startTime: start,
            endTime: end,
            day: travelRequest.day
        }, {headers: {Auth: 'True'}})
            .subscribe(() => {
                resolve();
            }, reject);
    });
  }

}
