import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgRedux, NgReduxModule } from 'ng2-redux';
import { createEpicMiddleware } from 'redux-observable';
import { AuthEpic } from '../store/epics/auth';
import { combineReducers } from 'redux';
import { HttpModule } from '@angular/http';
import { AppState, RootReducer, INITIAL_STATE } from '../store/reducers/root';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';
import { RestProvider } from '../providers/rest/rest';

export const Firebase = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxxxxxxxxxxxxx",
  databaseURL: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  projectId: "xxxxxxxxxxxxxxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxx",
  messagingSenderId: "xxxxxxxxxxxxxx"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(Firebase),
    NgReduxModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AuthEpic,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteServiceProvider,
    RestProvider
  ]
})
export class AppModule {
  constructor(private ngRedux: NgRedux<AppState>, private authepic: AuthEpic) {
    const middleware = [
      createEpicMiddleware(this.authepic.login),
      createEpicMiddleware(this.authepic.signup),
      createEpicMiddleware(this.authepic.logout),
    ]
    ngRedux.configureStore(RootReducer, INITIAL_STATE, middleware);
    console.log(middleware);
  }
}
