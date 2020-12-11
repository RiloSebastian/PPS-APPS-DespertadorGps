import { Injectable, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class ImagenesService {
	public ref = this.storageS.storage.ref();
	constructor(private storageS: AngularFireStorage, private firestore: AngularFirestore) { }

	public async subirFoto(archivo, usuario, tipoFoto) {
		let nombre = usuario + '_' + Date.now();
		const imagenRef = this.ref.child('relevamiento-visual/cosas-' + tipoFoto + '/' + nombre + '.jpg');
		return imagenRef.putString(archivo,'data_url').then(() => {
			return imagenRef.getDownloadURL().then(url => url );
		}).then(url => {
			return this.firestore.collection('relevamiento-visual').doc('subcolecciones').collection('fotos-de-edificio').add({
				usuario: usuario,
				tipoCosa: tipoFoto,
				fechaDeSubida: Date.now(),
				url: url,
				meGusta: []
			}).then(ref => {
				return ref.get();
			});
		});
	}

	public traerFotos(tipo) {
		return this.firestore.collection('relevamiento-visual').doc('subcolecciones').collection('fotos-de-edificio', ref => ref.where('tipoCosa', '==', tipo).orderBy('fechaDeSubida', 'desc')).get().toPromise();
	}

	public traerFotosTR(tipo){
		return this.firestore.collection('relevamiento-visual').doc('subcolecciones').collection('fotos-de-edificio', ref => ref.where('tipoCosa', '==', tipo).orderBy('fechaDeSubida', 'desc')).snapshotChanges();
	}

	public actualizarLikes(foto) {
		return this.firestore.collection('relevamiento-visual').doc('subcolecciones').collection('fotos-de-edificio').doc(foto.id).update({
			meGusta: foto.meGusta
		});
	}
}

