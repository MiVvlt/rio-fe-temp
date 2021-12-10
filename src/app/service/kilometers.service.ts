import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Kilometers} from '../interface/kilometers';
import {IKilometersDTO} from '../interface/dto';


@Injectable({
    providedIn: 'root'
})
export class KilometersService {

    constructor(private http: HttpClient) {
    }

    public async addKilometers(body): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.backendForFrontend}/kilometers`, body, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async editKilometers(body): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/kilometers`, body, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async editKilometersShopping(agendaItemId: string, day: string, kilometer: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/kilometers/shopping`, {
                agendaItemId,
                day,
                kilometer
            }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async getKilometersByDate(date: string): Promise<Kilometers> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/kilometers/${date}`, {headers: {Auth: 'True'}})
                .subscribe((result: IKilometersDTO) => {
                    resolve(new Kilometers().createFromDTO(result));
                }, reject);
        });
    }

    public async getKilometersByAgendaItem(agendaItemId: string): Promise<Kilometers> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/kilometers/agenda-item/${agendaItemId}`, {headers: {Auth: 'True'}})
                .subscribe((result: IKilometersDTO) => {
                    resolve(new Kilometers().createFromDTO(result));
                }, reject);
        });
    }

    public getKilometerTypes(): string[] {
        return [
            'AUTO',
            'BROMFIETS',
            'CARPOOL',
            'MOTO',
            'FIETS',
            'LEASINGFIETS',
        ];
    }
}
