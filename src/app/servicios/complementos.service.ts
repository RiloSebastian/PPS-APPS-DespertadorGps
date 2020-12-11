import { Injectable } from '@angular/core';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ComplementosService {
	public flagSonidos: boolean = true;
	public splash: boolean = false;

	constructor(public toastController: ToastController, public vib: Vibration) { }

	playAudio(tipoAudio:string) {
		if (this.flagSonidos) {
			if (this.flagSonidos) {
				let audio = new Audio();
				if (tipoAudio === 'success') {
					audio.src = '../../assets/audio/login/sonidoBotonSUCESS.mp3';
				} else if (tipoAudio === 'error') {
					audio.src = '../../assets/audio/login/sonidoBotonBORRAR.mp3';
				} else if (tipoAudio === 'notification') {
					audio.src = '../../assets/audio/login/sonidoBotonNOTIFICATION.mp3';
				}
				audio.play();
			}
		}
	}

	toggleSonidos() {
		this.flagSonidos = !this.flagSonidos;
	}

	async presentToastConMensajeYColor(msg: string, color: string) {
		console.log(msg);
		if (color === 'danger') {
			this.playAudio('error');
			this.vib.vibrate(1000);
		} else if ('success') {
			this.playAudio('success');
		} else {
			this.playAudio('notification');
		}
		const toast = await this.toastController.create({
			message: msg,
			position: 'bottom',
			duration: 3000,
			color: color,
			buttons: [
				{
					text: 'Aceptar',
					role: 'cancel',
				}
			]
		});
		toast.present();
	}
}