import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IPushNotificationDTO} from '../interface/dto';
import {PushNotification} from '../interface/PushNotification';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(public http: HttpClient) {
    }

    getPushNotifications(): Promise<PushNotification[]> {
        return this.http.get(`${environment.backendForFrontend}/push-notification/v2/all/${localStorage.getItem('userId')}`,
            {headers: {Auth: 'True'}})
            .pipe(map((dto: IPushNotificationDTO[]) => {
                return PushNotification.createArrayFromDTO(dto);
            })).toPromise();
    }

    getPushNotificationsAmount(): Promise<number> {
        return this.http.get(`${environment.backendForFrontend}/push-notification/v2/count/${localStorage.getItem('userId')}`,
            {headers: {Auth: 'True'}})
            .pipe(map((dto: { count: number }) => {
                return dto.count;
            })).toPromise();
    }


    public async markAllAsRead(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/push-notification/v2/all`,
                {
                    userId : localStorage.getItem('userId')
                }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async update(id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/push-notification/v2`, {
                id,
                viewed: true,
                userId: localStorage.getItem('userId')
            }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

}
