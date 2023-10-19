import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { __DEV__ } from '@apollo/client/utilities/globals';


if (__DEV__) {  // Adds messages only in a dev environment

  loadDevMessages();

  loadErrorMessages();

}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
