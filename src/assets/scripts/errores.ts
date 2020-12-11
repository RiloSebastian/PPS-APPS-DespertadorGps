
export function firebaseErrors(err) {
	let mensajeError: string = '';
	switch (err.code) {
		case "auth/argument-error":
			mensajeError = 'No se han pasado los argumentos correspondientes para esta operación.';
			break;
		case "auth/invalid-email":
			mensajeError = 'Email no valido';
			break;
		case "auth/operation-not-allowed":
			mensajeError = 'No se permite realizar esta operación';
			break;
		case "auth/weak-password":
			mensajeError = 'La contraseña es debil';
			break;
		case "auth/user-disabled":
			mensajeError = 'El usuario esta inhabilitado';
			break;
		case "auth/user-not-found":
			mensajeError = 'El usuario no ha encontrado.';
			break;
		case "auth/wrong-password":
			mensajeError = 'Contraseña incorrecta.';
			break;
		case "auth/credential-already-in-use":
			mensajeError = 'Estas credenciales ya estan en uso.';
			break;
		case "auth/email-already-in-use":
			mensajeError = 'Este email ya esta en uso.';
			break;
		case "firestore/cancelled":
			mensajeError = 'La operación fue cancelada.'
			break;
		case "firestore/unknown":
			mensajeError = 'Error desconocido en la operación sobre la base de datos.';
			break;
		case "firestore/invalid-argument":
			mensajeError = 'Argumento invalido en la operación.';
			break;
		case "firestore/not-found":
			mensajeError = 'El documento solicitado no se ha encontrado.';
			break;
		case "firestore/already-exists":
			mensajeError = 'Este id ya existe en la base de datos.';
			break;
		case "firestore/permission-denied":
			mensajeError = 'No tienes el permiso necesario para realizar esta operación.';
			break;
		case "firestore/unauthenticated":
			mensajeError = 'No hay credenciales validadas para realizar esta operación.';
			break;
		case "firestore/unavailable":
			mensajeError = 'El servicio de la base de datos no se encuentra disponible.';
			break;
		case "firestore/aborted":
			mensajeError = 'La operación fue abortada.';
			break;
		case "firestore/out-of-range":
			mensajeError = 'La operación se hizo fuera del rango valido';
			break;
		case "storage/unknown":
			mensajeError = 'Ocurrió un error desconocido.'
			break;
		case "storage/object-not-found":
			mensajeError = 'No existe ningún objeto en la referencia deseada.'
			break;
		case "storage/bucket-not-found":
			mensajeError = 'No se configuró ningún depósito para Cloud Storage.'
			break;
		case "storage/project-not-found":
			mensajeError = 'No se configuró ningún proyecto para Cloud Storage.'
			break;
		case "storage/quota-exceeded":
			mensajeError = 'Se superó la cuota del depósito de Cloud Storage.'
			break;
		case "storage/unauthenticated":
			mensajeError = 'El usuario no se autenticó.'
			break;
		case "storage/unauthorized":
			mensajeError = 'El usuario no está autorizado para realizar la acción deseada.'
			break;
		case "storage/retry-limit-exceeded":
			mensajeError = 'Se superó el límite de tiempo máximo permitido para una operación. Vuelve a subirlo.'
			break;
		case "storage/invalid-checksum":
			mensajeError = 'El archivo del cliente no coincide con la suma de verificación del archivo que recibió el servidor. Vuelve a subirlo.'
			break;
		case "storage/canceled":
			mensajeError = 'El usuario canceló la operación.'
			break;
		case "storage/invalid-event-name":
			mensajeError = 'Se proporcionó un nombre de evento no válido.'
			break;
		case "storage/invalid-url":
			mensajeError = 'Se proporcionó una URL no válida a refFromURL(). '
			break;
		case "storage/invalid-argument":
			mensajeError = 'El argumento pasado no es valido.'
			break;
		case "storage/invalid-format":
			mensajeError = 'El formato de la imagen a subir no corresponde con los parametros especificados.'
			break;
		case ":storage/no-default-bucket":
			mensajeError = 'No se configuró ningún depósito en la propiedad storageBucket.'
			break;
		case "storage/cannot-slice-blob":
			mensajeError = 'el blob ha cambiado en algun momento. verifica que todo funciona correctamente.'
			break;
		case "storage/server-file-wrong-size":
			mensajeError = 'El archivo del cliente no coincide con el tamaño del archivo que recibió el servidor. Vuelve a subirlo.'
			break;
		default:
			mensajeError = 'Ha ocurrido un error con el servicio de Firebase: codigo ' + err.code + '.';
			break;
	}
	return mensajeError;
}