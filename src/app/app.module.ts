import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Geofence } from '@ionic-native/geofence/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { environment } from '../environments/environment';

import { HomePage } from './home/home.page';
import { LoginComponent } from './login/login.component';


@NgModule({
	declarations: [AppComponent,HomePage, LoginComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		CommonModule,
		IonicModule.forRoot(),
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFirestoreModule,
		AngularFireStorageModule,
		AngularFireAuthModule,
		AngularFireAuthGuardModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		Geofence,
		Geolocation,
		NativeGeocoder,
		MediaCapture,
		Vibration,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
