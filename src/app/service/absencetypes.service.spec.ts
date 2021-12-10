import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {AbsenceTypesService} from './absencetypes.service';
import {AbsenceType} from '../interface/AbsenceType';

describe('✅ AbsenceTypeService: unit tests', () => {

    let injector: TestBed;
    let service: AbsenceTypesService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AbsenceTypesService]
        });
        injector = getTestBed();
        service = injector.get(AbsenceTypesService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('#getAbsenceTypesAsync', () => {
        it('should return a Promise<AbsenceType[]>', async () => {
            const dummyAbsenceType = new AbsenceType().createFromDTO({
                id: 'AV',
                name: 'Anciënniteitsverlof',
                index: 5
            });

            const absenceTypePromise = service.getAbsenceTypesAsync('Aalst');
            const req = httpMock.expectOne(`${environment.backendForFrontend}/absence/type/Aalst`);
            expect(req.request.method).toBe('GET');
            req.flush([dummyAbsenceType]);
            const absenceType = await absenceTypePromise;
            expect(absenceType).toEqual([dummyAbsenceType]);
        });
    });

    describe('#changeAbsenceType', () => {
        it('should return a Promise<void> >', async () => {
            service.changeAbsenceType({id: 'test'}, 'testId');
            const req = httpMock.expectOne(`${environment.backendForFrontend}/absence`);
            expect(req.request.method).toBe('PUT');
            req.flush(new AbsenceType());
        });
    });

    describe('#getAbsenceTypeByDatasetAndId', () => {
        it('should return a Promise<AbsenceType>', async () => {
            const dummyAbsenceType = new AbsenceType().createFromDTO({
                id: 'AV',
                name: 'Anciënniteitsverlof',
                index: 5
            });
            const dataset = 'Aalst';
            const sessionType = 'TEST';

            const absenceTypePromise = service.getAbsenceTypeByDatasetAndId(dataset, sessionType);
            const req = httpMock.expectOne(`${environment.backendForFrontend}/absence/dataset/${dataset}/id/${sessionType}`);
            expect(req.request.method).toBe('GET');
            req.flush(dummyAbsenceType);
            const absenceType = await absenceTypePromise;
            expect(absenceType).toEqual(dummyAbsenceType);
        });
    });
});
