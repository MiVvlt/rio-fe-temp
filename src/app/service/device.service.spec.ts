import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {DeviceService} from './device.service';
import {Device} from '../interface/device';

describe('✅ DeviceService: unit tests', () => {

    let injector: TestBed;
    let service: DeviceService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DeviceService]
        });
        injector = getTestBed();
        service = injector.get(DeviceService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('#registerDevice', () => {
        it('should return a Promise<void>', async () => {
            const dummyDevice = new Device().createFromDTO({
                token: 'test'
            });

            const promise = service.registerDevice(dummyDevice);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/device`);
            expect(req.request.method).toBe('POST');
            req.flush(null);
            const result = await promise;
            expect(result).toEqual(undefined);
        });
    });
});
