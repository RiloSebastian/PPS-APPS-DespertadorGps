import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs'
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuario: BehaviorSubject<null | firebase.User> = new BehaviorSubject(null);

  constructor(private auth: AngularFireAuth, private zone: NgZone) {
  	this.auth.onAuthStateChanged(user=> this.zone.run(()=> {
  		if(user !== null){
        console.log('encontro usuario');
  			this.usuario.next(user);
  		} else{
  			this.usuario.next(null);
  		}
  	})
    );
  }

  public login(email:string, password: string){
    console.log(email+' '+password);
  	return this.auth.signInWithEmailAndPassword(email,password);
  }

  public logout(){
  	return this.auth.signOut();
  }
  
}
