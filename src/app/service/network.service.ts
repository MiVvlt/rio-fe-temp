import { Injectable } from '@angular/core';
import {Network} from '@ionic-native/network/ngx';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }

  checkNetwork(networkRef: Network, routerRef: Router) {
    if (networkRef.type === 'none') {
      console.warn('Network disconnected, redirecting to calendar page');
      routerRef.navigate(['/menu/calendar']);
    }
  }
}
