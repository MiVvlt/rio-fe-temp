import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Client} from '../interface/Client';
import {HttpClient} from '@angular/common/http';
import {IClientDTO, ISessionEventDTO} from '../interface/dto';
import {SessionEvent} from '../interface/SessionEvent';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClientsService {

    constructor(private http: HttpClient) {
    }

    public getClientsByName(name: string): Promise<Client[]> {
        return this.http.get(`${environment.backendForFrontend}/customer/name/${name.trim()}`, {headers: {Auth: 'True'}})
            .pipe(map((result: IClientDTO[]) => {
                return Client.createArrayFromDTO(result);
            })).toPromise();
    }

    public async getClientCalendar(id: string | number, dates: { start: string, end: string }): Promise<SessionEvent[]> {
        return this.http.get(
            `${environment.backendForFrontend}/agenda-item/customer/${id}/from/${dates.start}/to/${dates.end}`,
            {headers: {Auth: 'True'}}
        ).pipe(map((result: ISessionEventDTO[]) => {
            return SessionEvent.createArrayFromDTO(result);
        })).toPromise();
    }
}
