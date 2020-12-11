import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Geofence } from '@ionic-native/geofence/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { AuthService } from '../servicios/auth/auth.service';
import { ComplementosService } from 'src/app/servicios/complementos.service';
import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { filter } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	public usuario: any = null;
	public subU: any = null;
	public direccion: string = null;
	public radioAprox: number = null;
	public geoFlag: boolean = false;
	public subGeoTrans: any = null;
	public subDistance: any = null;
	public geoData: any = {
		direc: null,
		lat: 0,
		long: 0,
		distancia: 5,
		radio: 100,
	}
	constructor(private auth: AuthService, private geolocation: Geolocation, private router: Router, private geocoder: NativeGeocoder, private geofence: Geofence, private media: MediaCapture, private comp: ComplementosService) { }

	ngOnInit(): void {
		console.log('accede a usuario');
		this.subU = this.auth.usuario.subscribe(user => {
			if (user !== null) {
				this.usuario = user;
				console.log(this.usuario);
			}
		});
	}

	ingresarDire() {
		this.geoData.direc = this.direccion;
		this.geocoder.forwardGeocode(this.direccion, { useLocale: true, maxResults: 1 }).then(geoCodeData => {
			this.geoData.lat = geoCodeData[0].latitude;
			this.geoData.long = geoCodeData[0].longitude;
		}).then(() => {
			this.geoFlag = true;
			this.geofence.initialize();
			return this.geofence.addOrUpdate({
				id: 'user',
				latitude: this.geoData.lat,
				longitude: this.geoData.long,
				radius: this.radioAprox ? this.radioAprox : 100,
				transitionType: 1,
				notification: {
					id: 1,
					title: 'Entraste al radio de la direccion',
					text: `entraste al radio de ${this.radioAprox} metros de la localidad elegida`,
					openAppOnClick: true,
					vibration: [2000],
				}
			});
		}).then(() => {
			let geoOps: GeolocationOptions = { enableHighAccuracy: true, timeout: 1000 };
			this.subDistance = this.geolocation.watchPosition(geoOps);
			this.subDistance.subscribe(data => {
				let x: Geoposition = data as Geoposition;
				if (x.coords != undefined) {
					this.geoData.distancia = this.calcularDistancia(x.coords.latitude, x.coords.longitude);
				} else {
					this.comp.presentToastConMensajeYColor('ha ocurrido un error. ' + JSON.stringify(x), 'danger');
				}
			});
		}).then(() => {
			this.geoFlag = true;
			this.subGeoTrans = this.geofence.onTransitionReceived().subscribe(data => {
				this.comp.presentToastConMensajeYColor('has llegado a tu destino', 'success');
			})
		}).catch(err => {
			this.cancelarDire();
			this.comp.presentToastConMensajeYColor('ha ocurrido un error. ' + err, 'danger');
		});
	}

	calcularDistancia(latAct, longAct) {
		const radioTierra = 6371e3; // radio de la tierra en metros
		const lat1Deg = latAct * Math.PI / 180; // lat usuario en radianes
		const lat2Deg = this.geoData.lat * Math.PI / 180; //lat destino en radianes
		const distLat = (this.geoData.lat - latAct) * Math.PI / 180;
		const distLong = (this.geoData.long - longAct) * Math.PI / 180;
		const a = Math.sin(distLat / 2) * Math.sin(distLat / 2) + Math.cos(lat1Deg) * Math.cos(lat2Deg) * Math.sin(distLong / 2) * Math.sin(distLong / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return radioTierra * c; // distancia en metros
	}

	cancelarDire() {
		this.geoFlag = false;
		this.geofence.remove('user').then(() => {
			if (this.subGeoTrans !== null) {
				this.subGeoTrans.unsubscribe();
			}
		}).catch(err => {
			this.comp.presentToastConMensajeYColor('ha ocurrido un error. ' + err, 'danger');
		});
	}

	public cerrarSesion() {
		this.auth.logout().then(() => {
			if (this.subU !== null) {
				this.subU.unsubscribe();
			}
			this.comp.playAudio('error');
			this.router.navigate([''])
		});
	}

}
