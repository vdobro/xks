import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

if (environment.production) {
  enableProdMode();
}

UIkit.use(Icons);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
