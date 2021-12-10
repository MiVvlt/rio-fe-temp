import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CareWorkerService} from './care-worker.service';
import {getTestBed, TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {CareWorker} from '../interface/care-worker';

describe('✅ CareWorkerService: unit tests', () => {

    let injector: TestBed;
    let service: CareWorkerService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CareWorkerService]
        });
        injector = getTestBed();
        service = injector.get(CareWorkerService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('#getCareWorkerMe', () => {
        it('should return a Promise<CareWorker>', async () => {
            const dummyUser = new CareWorker().createFromDTO({
                id: 'afd935ec-0357-4ed0-99b8-38f6ed5ecd80',
                personnelId: '0123456',
                careWorkerQuintiqId: '5554',
                firstName: 'NICHOLAS',
                middleName: '',
                lastName: 'DE MEYERS',
                name: 'Nicholas De Meyers',
                teamId: '1',
                type: 'POETSHULP',
                teamMigrated: true
            });

            const userPromise = service.getCareWorkerMe();
            const req = httpMock.expectOne(`${environment.backendForFrontend}/care-worker/me`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyUser);
            const user = await userPromise;
            expect(user).toEqual(dummyUser);
        });
    });
});
