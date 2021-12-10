import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import * as jwt from 'njwt';

describe('✅ AuthService: unit tests', () => {

    let injector: TestBed;
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        injector = getTestBed();
        service = injector.get(AuthService);
        httpMock = injector.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('#logout', () => {
        it(`should remove 'jwt-token' and 'user' from localstorage`, async () => {
            localStorage.setItem('jwt-token', 'test');
            localStorage.setItem('user', 'test');
            service.logout();
            expect(localStorage.getItem('jwt-token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
        });
    });

    describe('#authenticated', () => {
        it(`should return true if localstorage 'device-offline' is 'true'`, async () => {
            localStorage.setItem('device-offline', 'true');
            const authenticated = service.authenticated();
            expect(authenticated).toBe(true);
        });

        it(`should return false if localstorage 'jwt-token' is not present`, async () => {
            localStorage.setItem('device-offline', 'false');
            localStorage.removeItem('jwt-token');
            const authenticated = service.authenticated();
            expect(authenticated).toBe(false);
        });

        it(`should return false if localstorage 'jwt-token' is expired`, async () => {
            const token = jwt.create({iss: 'test', sub: 'test'}, 'top-secret-phrase');
            token.setExpiration(new Date().getTime() - 60 * 1000);

            localStorage.setItem('device-offline', 'false');
            localStorage.setItem('jwt-token', 'Bearer: ' + token.compact());
            const authenticated = service.authenticated();
            expect(authenticated).toBe(false);
        });

        it(`should return true if localstorage 'jwt-token' is not expired`, async () => {
            const token = jwt.create({iss: 'test', sub: 'test'}, 'top-secret-phrase');
            token.setExpiration(new Date().getTime() + 60 * 1000);

            localStorage.setItem('device-offline', 'false');
            localStorage.setItem('jwt-token', 'Bearer: ' + token.compact());
            const authenticated = service.authenticated();
            expect(authenticated).toBe(true);
        });
    });
});
