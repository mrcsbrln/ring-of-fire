import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-5d525","appId":"1:693718047700:web:16205a9caf49d56f4f5441","storageBucket":"ring-of-fire-5d525.firebasestorage.app","apiKey":"AIzaSyAiEh5LiWa6RCADtdiHczg0_wIdlLYoBwY","authDomain":"ring-of-fire-5d525.firebaseapp.com","messagingSenderId":"693718047700"})), provideFirestore(() => getFirestore())]
};
