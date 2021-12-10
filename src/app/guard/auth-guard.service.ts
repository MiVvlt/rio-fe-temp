import {Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {CanActivate, Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(private router: Router, private authService: AuthService) {
    }

    // @ts-ignore
    canActivate(): boolean {
        if (this.authService.authenticated()) {
            return true;
        } else {
            this.router.navigate(['/menu/login']);
            return false;
        }
    }
}
