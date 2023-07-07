import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, IonicModule, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {

  constructor( private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet) {
      this.platform.backButton.subscribeWithPriority(-1, () => {
        if (!this.routerOutlet?.canGoBack()) {
          App.exitApp();
        }
      });
    }


}
