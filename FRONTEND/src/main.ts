import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom()
  ]
});
