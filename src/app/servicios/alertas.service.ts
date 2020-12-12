import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage'
import { AngularFirestore } from '@angular/fire/firestore'

@Injectable({
	providedIn: 'root'
})
export class AlertasService {

	constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

	traerTodos() {
		return this.firestore.collection('alarmaGps').doc('subcolecciones').collection('alarmas', ref => ref.orderBy('fecha', 'desc')).snapshotChanges();
	}

	actualizarEquipo(data) {
		return this.firestore.collection('alarmaGps').doc('subcolecciones').collection('alarmas').doc(data.id).set(data, { merge: true });
	}

	public crearViaje(data: any) {
		return this.firestore.collection('alarmaGps').doc('subcolecciones').collection('alarmas').add(data).then( dRef => dRef.id);
	}
}
