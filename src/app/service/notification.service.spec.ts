import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {NotificationService} from './notification.service';
import {PushNotification} from '../interface/PushNotification';

describe('✅ NotificationService: unit tests', () => {

    let injector: TestBed;
    let service: NotificationService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [NotificationService]
        });
        injector = getTestBed();
        service = injector.get(NotificationService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('#getPushNotifications', () => {
        it('should return a Promise<PushNotification[]>', async () => {
            const dummyNotification = new PushNotification().createFromDTO({
                body: 'test', id: 'test', reference: 'test', timestamp: '', title: 'test', type: 'test'
            });

            const promise = service.getPushNotifications();
            const req = httpMock.expectOne(`${environment.backendForFrontend}/push-notification/all`);
            expect(req.request.method).toBe('GET');
            req.flush([dummyNotification]);
            const result = await promise;
            expect(result).toEqual([dummyNotification]);
        });
    });

    describe('#update', () => {
        it('should return a Promise<void>', async () => {

            const promise = service.update('test');
            const req = httpMock.expectOne(`${environment.backendForFrontend}/push-notification/test`);
            expect(req.request.method).toBe('PUT');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });
});
