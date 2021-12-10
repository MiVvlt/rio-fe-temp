import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    logout() {
        localStorage.removeItem('jwt-token');
        localStorage.removeItem('user');
    }

    authenticated() {
        const deviceOffline = localStorage.getItem('device-offline');
        if (deviceOffline === 'true') {
            return true;
        }

        const now = new Date().getTime() / 1000;
        const token = localStorage.getItem('jwt-token');

        return token === null ? false : !(now >= this.getExpDate(token));
    }

    getExpDate(token: string) {
        return this.parseJwt(token).exp;
    }

    getPersonnelId(token: string) {
        return this.parseJwt(token).facsimiletelephonenumber;
    }

    getName(token: string) {
        return this.parseJwt(token).name;
    }

    getIpAddress(token: string) {
        return this.parseJwt(token).ipaddr;
    }

    getEmail(token: string) {
        return this.parseJwt(token).unique_name;
    }

    getData(token: string) {
        return this.parseJwt(token);
    }

    parseJwt(token: string) {
        token = token.split(' ')[1];
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
}
