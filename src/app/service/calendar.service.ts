import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SessionEvent} from '../interface/SessionEvent';
import {IChangeRequestDTO, ISessionEventDTO} from '../interface/dto';
import {map} from 'rxjs/operators';
import {ChangeRequest} from '../interface/ChangeRequest';
import {ValidateAllSessionEvent} from '../components/validate-all-modal/validate-all-modal.component';
import {ExpenseType} from '../components/expenses-modal/expenses-modal.component';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {
    public calendarEvents: SessionEvent[] = [];

    constructor(private http: HttpClient) {
    }

    public getCalendarEvents(start?: string, end?: string): Promise<SessionEvent[]> {
        return this.http.get(`${environment.backendForFrontend}/agenda-item/from/${start}/to/${end}`, {headers: {Auth: 'True'}})
            .pipe(map((results: ISessionEventDTO[]) => {
                this.calendarEvents = SessionEvent.createArrayFromDTO(results);
                return this.calendarEvents;
            })).toPromise();
    }

    public getCalendarEvent(id: string): Promise<SessionEvent> {
        return this.http.get(`${environment.backendForFrontend}/agenda-item/${id}`,
            {headers: {Auth: 'True'}})
            .pipe(map((dto: ISessionEventDTO) => {
                return new SessionEvent().createFromDTO(dto);
            })).toPromise();
    }

    public async getChangeRequest(id: string): Promise<ChangeRequest> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/change-request/agenda-item/${id}`, {headers: {Auth: 'True'}})
                .subscribe((result: IChangeRequestDTO) => {
                    resolve(new ChangeRequest().createFromDTO(result));
                }, reject);
        });
    }

    public async getImposedChangeRequest(id: string): Promise<ChangeRequest> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/change-request/agenda-item/${id}/status/IMPOSED`, {headers: {Auth: 'True'}})
                .subscribe((result: IChangeRequestDTO) => {
                    resolve(new ChangeRequest().createFromDTO(result));
                }, reject);
        });
    }

    public async getCalendarEventById(id): Promise<SessionEvent> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/agenda-item/${id}`, {headers: {Auth: 'True'}})
                .subscribe((result: ISessionEventDTO) => {
                    resolve(new SessionEvent().createFromDTO(result));
                }, reject);
        });
    }

    public async validateCalendarEvent(
        session: SessionEvent,
        rosterDisturbanceType: ExpenseType, forceOverlap = false): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.backendForFrontend}/worker-session`, {
                agendaItemId: session.id,
                startTime: session.apiStart,
                endTime: session.apiEnd,
                extraDistance: session.distance ? session.distance.shopping : 0,
                rosterDisturbanceType,
                forceOverlap
            }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async getUnvalidatedCalendarEvents(): Promise<ValidateAllSessionEvent[]> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/agenda-item/non-validated`, {headers: {Auth: 'True'}})
                .subscribe((results: ISessionEventDTO[]) => {
                    resolve(SessionEvent.createArrayFromDTO(results).map((i) => {
                        (i as ValidateAllSessionEvent).toValidate = !i.overlapping || i.overlappingAbsence || i.type === 'AFWEZIGHEID';
                        return i as ValidateAllSessionEvent;
                    }));
                }, reject);
        });
    }

    public async changeCalendarEvent(
        id: string,
        newStartTime: any,
        newEndTime: any,
        reasonRequest: string,
        customerNotified: boolean
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.backendForFrontend}/change-request`, {
                agendaItemId: id,
                newStartTime,
                newEndTime,
                reasonRequest,
                customerNotified
            }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async deleteCalendarEvent(session: SessionEvent, reason: string, customerRequested: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.backendForFrontend}/remove-request`,
                {
                    agendaItemId: session.id,
                    reason,
                    customerRequested
                }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async validateMultipleCalendarEvents(items: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.backendForFrontend}/worker-session/validate/all`,
                {
                    ids: items
                }
                , {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async updateClientNotified(items: string[], value: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/agenda-item/client-communicated/${value ? 'true' : 'false'}`,
                items
                , {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }
}
