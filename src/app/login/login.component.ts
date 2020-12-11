import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { USUARIOS } from '../mock/usuarios-mock';
import { AuthService } from '../servicios/auth/auth.service';
import { ComplementosService } from 'src/app/servicios/complementos.service';
import firebase from 'firebase/app';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	public usuarios: Array<any> = USUARIOS;
	public loginForm: FormGroup = new FormGroup({
		iUsuario: new FormControl(null, [Validators.required, Validators.email]),
		iPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
	});
	public mensajeError: string = null;
	public mostrarPassword: boolean = false;

	constructor(private auth: AuthService, private router: Router, private comp: ComplementosService ) { }

	ngOnInit() {
		console.log(this.usuarios);
	}

	public seleccionarUsuario(usuario) {
		console.log(usuario);
		this.loginForm.controls.iUsuario.setValue(usuario.correo);
		this.loginForm.controls.iPassword.setValue(usuario.clave);
	}

	public tryLogin() {
		console.log(this.loginForm.value);
		if (this.loginForm.valid) {
			this.auth.login(this.loginForm.value.iUsuario, this.loginForm.value.iPassword.toString()).then(() => {
				console.log('entro');
				this.comp.playAudio('success');
				setTimeout(()=>{
				this.router.navigate(['Home']);
				},1000)
			}).catch((err: firebase.FirebaseError) => {
				switch (err.code) {
					case 'auth/argument-error':
						this.mensajeError =  err.message;
						break;
					case 'auth/invalid-email':
						this.mensajeError = 'El Correo electronico es invalido';
						break;
					case 'auth/user-disabled':
						this.mensajeError = 'El usuario esta deshabilitado';
						break;
					case 'auth/user-not-found':
						this.mensajeError = 'No se ha encontrado el usuario';
						break;
					case 'auth/wrong-password':
						this.mensajeError = 'Contraseña incorrecta';
						break;
					default:
						this.mensajeError = 'Ha ocurrido un error';
						break;
				}
				this.comp.vib.vibrate(1000);
				setTimeout(()=>{
					this.mensajeError = null;
				},3500);
				console.log(this.mensajeError);
			});
		}
	}
}
