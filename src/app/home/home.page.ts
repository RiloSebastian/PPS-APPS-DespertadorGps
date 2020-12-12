import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { Router } from "@angular/router";
import { Geofence } from '@ionic-native/geofence/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { MediaCapture, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from '../servicios/auth/auth.service';
import { AlertasService } from 'src/app/servicios/alertas.service';
import { ComplementosService } from 'src/app/servicios/complementos.service';
import { Geolocation, Geoposition, GeolocationOptions } from '@ionic-native/geolocation/ngx';
import { Map, TileLayer, Marker, Circle, Icon, FeatureGroup } from 'leaflet'
import { timer } from 'rxjs'

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
	public splash: boolean = true;
	public map: Map;
	public listadoViajes: Array<any> = [];
	public markUsuario: Marker = null;
	public markUsuarioIcon = new Icon({ iconUrl: '../../assets/usuario.svg', iconSize: [30, 25] });
	public markDestino: Marker = null;
	public markers = new FeatureGroup();
	public zonaProximidad: Circle = null;
	public alarma = new Audio();
	public usuario: any = null;
	public subU: any = null;
	public geoFlag: boolean = false;
	public subGeoTrans: any = null;
	public subDistance: any = null;
	public subHist: any = null;
	public geoData: any = {
		direc: null,
		latlngU: null,
		latlngD: null,
		distancia: null,
		radio: 100,
	}
	constructor(private alertas: AlertasService, private file: File, private auth: AuthService, private geolocation: Geolocation, private router: Router,
		private geocoder: NativeGeocoder, private geofence: Geofence, private media: MediaCapture, private comp: ComplementosService) { }

	public ngOnInit(): void {
		console.log('accede a usuario');
		this.subU = this.auth.usuario.subscribe(user => {
			if (user !== null) {
				this.usuario = user;
				this.splash = false;
				console.log(this.usuario);
				setTimeout(() => {
					let geoOps: GeolocationOptions = { enableHighAccuracy: true, timeout: 2000 };
					this.geolocation.getCurrentPosition(geoOps).then(data => {
						let x: any = data as any;
						this.mostrarMapa(x.coords.latitude, x.coords.longitude);
						this.actualizarUsuario(x.coords.latitude, x.coords.longitude)
						console.log(this.geoData);
					});
				}, 2000);
				this.subHist = this.alertas.traerTodos().subscribe(r => {
					this.listadoViajes = r.map(s => {
						const x: any = s.payload.doc.data() as any;
						return { ...x };
					})
				})
			}
		});
	}

	public mostrarMapa(lat, lng) {
		this.map = new Map("map", { zoomControl: false }).fitWorld({ maxZoom: 35 });
		let x: TileLayer = new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
		this.map.setView([lat, lng], 20);
		this.map.on('click', e => this.clickMapa(e));
	}

	public clickMapa(data) {
		this.actualizarDestino(data.latlng.lat, data.latlng.lng);
	}


	public actualizarUsuario(lat, lng) {
		if (this.markUsuario !== null) {
			this.markers.removeLayer(this.markUsuario)
			this.map.removeLayer(this.markUsuario);
		}
		this.geoData.latlngU = [lat, lng];
		this.markUsuario = new Marker(this.geoData.latlngU, { icon: this.markUsuarioIcon }).addTo(this.map).addTo(this.markers);
		if (this.geoData.latlngU !== null && this.geoData.latlngD !== null) {
			this.map.fitBounds(this.markers.getBounds());
		}
		console.log(this.geoData);
	}

	public actualizarDestino(lat, lng) {
		if (this.markDestino !== null) {
			this.map.removeLayer(this.markDestino);
			this.markers.removeLayer(this.markDestino)
			this.map.removeLayer(this.zonaProximidad);
		}
		this.ingresarDire([lat, lng]).then(() => {
			this.markDestino = new Marker([lat, lng]).addTo(this.map).addTo(this.markers).bindPopup(`${this.geoData.direc}. distancia: ${this.geoData.distancia}`).openPopup();
			this.zonaProximidad = new Circle([lat, lng], { radius: this.geoData.radio, color: 'red', fillColor: '#f03', fillOpacity: 0.5 }).addTo(this.map);
			if (this.geoData.latlngU !== null && this.geoData.latlngD !== null) {
				this.map.fitBounds(this.markers.getBounds());
			}
			console.log(this.geoData);
		});
	}

	public ingresarDire(data) {
		console.log(data);
		if (typeof data === 'string' || data instanceof String) {
			this.geoData.direc = data;
			return this.geocoder.forwardGeocode(this.geoData.direc, { useLocale: true, maxResults: 1 }).then(geoCodeData => {
				this.geoData.latlngD = [geoCodeData[0].latitude, geoCodeData[0].longitude];
			});
		} else {
			this.geoData.latlngD = [data[0], data[1]];
			return this.geocoder.reverseGeocode(data[0], data[1], { useLocale: true, maxResults: 1 }).then(geoCodeData => {
				this.geoData.direc = `${geoCodeData[0].thoroughfare} ${geoCodeData[0].subThoroughfare}, ${geoCodeData[0].subAdministrativeArea} ${geoCodeData[0].administrativeArea}`;
			});
		}
	}

	public grabarAlarma() {
		this.media.captureAudio().then(audioData => {
			let x = audioData[0].fullPath;
			this.alarma.src = x;
			/*var directoryPath = x.substr(0, x.lastIndexOf('/')); // URL to directory without filename
			var fileName = x.substr(x.lastIndexOf('/') + 1); // filename with extension
			return this.file.readAsDataURL(directoryPath, fileName).then(urlData => {
				this.alarma.src = urlData;
			});*/
		}).catch(err => this.comp.presentToastConMensajeYColor('Se ha cancelado la grabacion' + err.message, 'primary'));
	}

	public iniciarViaje() {
		this.map.removeEventListener('click', e => this.clickMapa(e));
		this.geoFlag = true;
		console.log(this.geoData);
		this.geofence.initialize();
		return this.geofence.addOrUpdate({
			id: 'user',
			latitude: this.geoData.latlngD[0],
			longitude: this.geoData.latlngD[1],
			radius: this.geoData.radio,
			transitionType: this.geofence.TransitionType.ENTER,
			notification: {
				id: 1,
				title: 'Entraste al radio de la direccion',
				text: `entraste al radio de ${this.geoData.distancia} metros de la localidad elegida`,
				openAppOnClick: true,
				vibration: [2000],
			}
		}).then(() => {
			let geoOps: GeolocationOptions = { enableHighAccuracy: true, timeout: 2000 };
			this.subDistance = this.geolocation.watchPosition(geoOps).subscribe(data => {
				let x: any = data as any;
				this.actualizarUsuario(x.coords.latitude, x.coords.longitude);
				this.geoData.distancia = this.calcularDistancia(x.coords.latitude, x.coords.longitude);
				this.actualizarDestino(this.geoData.latlngD[0], this.geoData.latlngD[1])
				console.log(this.geoData);
			});
		}).then(() => {
			this.subGeoTrans = this.geofence.onTransitionReceived().subscribe(data => {
				let aux = timer(500,2000).subscribe(r =>{
					this.alarma.loop = true;
					this.alarma.play();
					if(r == 4){
						aux.unsubscribe();
						this.alarma.loop = false;
						this.alarma.remove();
					}
				})
				let auxI = setInterval(() => {
					this.alarma.play();
				},2000);
				setTimeout(()=>{
					clearInterval(auxI);
				},8000);
				this.comp.presentToastConMensajeYColor(`entraste al radio de ${this.geoData.distancia} metros de la localidad elegida`, 'success');
				this.cancelarViaje();
			})
		}).catch(err => {
			this.cancelarViaje();
			this.comp.presentToastConMensajeYColor('ha ocurrido un error. ' + err.message, 'danger');
		});
	}

	public calcularDistancia(latAct, longAct) {
		const radioTierra = 6371e3; // radio de la tierra en metros
		const lat1Deg = latAct * Math.PI / 180; // lat usuario en radianes
		const lat2Deg = this.geoData.latlngD[0] * Math.PI / 180; //lat destino en radianes
		const distLat = (this.geoData.latlngD[0] - latAct) * Math.PI / 180;
		const distLong = (this.geoData.latlngD[1] - longAct) * Math.PI / 180;
		const a = Math.sin(distLat / 2) * Math.sin(distLat / 2) + Math.cos(lat1Deg) * Math.cos(lat2Deg) * Math.sin(distLong / 2) * Math.sin(distLong / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return radioTierra * c; // distancia en metros
	}

	public cancelarViaje() {
		this.splash = true;
		this.geoFlag = false;
		this.geofence.remove('user').then(() => {
			if (this.subGeoTrans !== null) {
				this.subGeoTrans.unsubscribe();
				this.subDistance.unsubscribe();
			}
			if (this.markDestino !== null) {
				this.map.removeLayer(this.markDestino);
				this.map.removeLayer(this.zonaProximidad);
			}
			return this.alertas.crearViaje({ fecha: Date.now(), direccion: this.geoData.direc, radio: this.geoData.radio })
		}).then(() => {
			this.geoData.latlngD = [0, 0];
			this.geoData.distancia = 100;
			this.geoData.radio = 0;
		}).catch(err => {
			this.comp.presentToastConMensajeYColor('ha ocurrido un error. ' + err, 'danger');
		}).finally(() => this.splash = false);
	}

	public cerrarSesion() {
		this.auth.logout().then(() => {
			if (this.subU !== null) {
				this.subU.unsubscribe();
				setTimeout(() => {
					this.map.off();
					this.map.remove();
				}, 500)
			}
			this.splash = true;
			this.comp.playAudio('error');
			this.router.navigate([''])
		});
	}

}
