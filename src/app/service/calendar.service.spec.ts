import {getTestBed, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CalendarService} from './calendar.service';
import {environment} from '../../environments/environment';
import {SessionEvent, SessionEventStatus} from '../interface/SessionEvent';
import {ChangeRequest} from '../interface/ChangeRequest';
import {ValidateAllSessionEvent} from '../components/validate-all-modal/validate-all-modal.component';
import * as moment from 'moment';

describe('✅ CalendarService: unit tests', () => {
    let injector: TestBed;
    let service: CalendarService;
    let httpMock: HttpTestingController;
    const dummySessionEvent = {
        careWorker: undefined,
        clientCommunicated: false,
        clientComunicated: false,
        comment: '',
        customer: undefined,
        dataset: '',
        distance: {shopping: 0},
        id: 'test',
        noah: '',
        serviceType: '',
        sessionType: 'HULPBEURT',
        startTime: moment().subtract(1, 'hours').toISOString(),
        endTime: moment().subtract(30, 'minutes').toISOString(),
        status: 'DEFINITE' as SessionEventStatus,
        teamId: '',
        type: undefined
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CalendarService]
        });
        injector = getTestBed();
        service = injector.get(CalendarService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('#getCalendarEvents', () => {
        it('should return a Promise<SessionEvent[]>', async () => {
            const sessionEventsPromise = service.getCalendarEvents('start', 'end');
            const req = httpMock.expectOne(`${environment.backendForFrontend}/agenda-item/from/start/to/end`);
            expect(req.request.method).toBe('GET');
            req.flush([dummySessionEvent]);
            const sessionEvents = await sessionEventsPromise;
            expect(sessionEvents).toEqual(SessionEvent.createArrayFromDTO([dummySessionEvent]));
        });
    });

    describe('#getCalendarEvent', () => {
        it('should return a Promise<SessionEvent>', async () => {
            const sessionEventsPromise = service.getCalendarEvent(dummySessionEvent.id);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/agenda-item/${dummySessionEvent.id}`);
            expect(req.request.method).toBe('GET');
            req.flush(dummySessionEvent);
            const sessionEvents = await sessionEventsPromise;
            expect(sessionEvents).toEqual(new SessionEvent().createFromDTO(dummySessionEvent));
        });
    });

    describe('#getImposedChangeRequest', () => {
        it('should return a Promise<ChangeRequest>', async () => {
            const dummyChangeRequest = {
                agendaItemId: '',
                newEndTime: '',
                newStartTime: '',
                oldEndTime: '',
                oldStartTime: '',
                id: 'test'
            };
            const promise = service.getImposedChangeRequest(dummySessionEvent.id);
            const req = httpMock
                .expectOne(`${environment.backendForFrontend}/change-request/agenda-item/${dummySessionEvent.id}/status/IMPOSED`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyChangeRequest);
            const result = await promise;
            expect(result).toEqual(new ChangeRequest().createFromDTO(dummyChangeRequest));
        });
    });

    describe('#getCalendarEventById', () => {
        it('should return a Promise<SessionEvent>', async () => {
            const sessionEventsPromise = service.getCalendarEventById(dummySessionEvent.id);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/agenda-item/${dummySessionEvent.id}`);
            expect(req.request.method).toBe('GET');
            req.flush(dummySessionEvent);
            const sessionEvents = await sessionEventsPromise;
            expect(sessionEvents).toEqual(new SessionEvent().createFromDTO(dummySessionEvent));
        });
    });

    describe('#validateCalendarEvent', () => {
        it('should return a Promise<void>', async () => {
            const sessionEventsPromise = service.validateCalendarEvent(
                new SessionEvent().createFromDTO(dummySessionEvent),
                'ROSTER_DISTURBANCE_6',
                'CAR'
            );
            const req = httpMock.expectOne(`${environment.backendForFrontend}/worker-session`);
            expect(req.request.method).toBe('POST');
            req.flush(null);
            const sessionEvents = await sessionEventsPromise;
            expect(sessionEvents).toEqual(undefined);
        });
    });

    describe('#getUnvalidatedCalendarEvents', () => {
        it('should return a Promise<ValidateAllSessionEvent[]>', async () => {
            const sessionEventsPromise = service.getUnvalidatedCalendarEvents();
            const req = httpMock.expectOne(`${environment.backendForFrontend}/agenda-item/non-validated`);
            expect(req.request.method).toBe('GET');
            req.flush([dummySessionEvent]);
            const sessionEvents = await sessionEventsPromise;
            const validate: ValidateAllSessionEvent[] =
                SessionEvent.createArrayFromDTO([dummySessionEvent])
                    .map((i) => {
                        (i as ValidateAllSessionEvent).toValidate = !i.isOverlapping;
                        return i as ValidateAllSessionEvent;
                    }).filter((i) => {
                    return i.canValidate;
                });
            expect(sessionEvents).toEqual(validate);
        });
    });

    describe('#changeCalendarEvent', () => {
        it('should return a Promise<void>', async () => {
            const promise = service.changeCalendarEvent(
                'string',
                'any',
                'any',
                'string',
                true);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/change-request`);
            expect(req.request.method).toBe('POST');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });

    describe('#deleteCalendarEvent', () => {
        it('should return a Promise<void>', async () => {
            const promise = service.deleteCalendarEvent(
                new SessionEvent().createFromDTO(dummySessionEvent),
                'string',
                true);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/remove-request`);
            expect(req.request.method).toBe('POST');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });

    describe('#validateMultipleCalendarEvents', () => {
        it('should return a Promise<void>', async () => {
            const promise = service.validateMultipleCalendarEvents(
                ['test']);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/worker-session/validate/all`);
            expect(req.request.method).toBe('POST');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });

    describe('#updateClientNotified, setValue: true', () => {
        it('should return a Promise<void>', async () => {
            const Val = true;
            const promise = service.updateClientNotified(
                ['test'], Val);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/agenda-item/client-communicated/${Val}`);
            expect(req.request.method).toBe('PUT');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });

    describe('#updateClientNotified, setValue: false', () => {
        it('should return a Promise<void>', async () => {
            const Val = false;
            const promise = service.updateClientNotified(
                ['test'], Val);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/agenda-item/client-communicated/${Val}`);
            expect(req.request.method).toBe('PUT');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });
});
