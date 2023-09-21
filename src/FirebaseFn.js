/* eslint-disable no-unused-vars */
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'
import { auth } from './FirebaseConfig.js'
// FUNCION AUTENTICAR CON GOOGLE
const provider = new GoogleAuthProvider()

export const entrarConGoogle = () => {
  return signInWithPopup(auth, provider)
}
export const ingresarConCorreoContrasena = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}
export const UsuarioConSesionActiva = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}
export const registoConCorreoContrasena = (email, password) => {
  return fetchSignInMethodsForEmail(auth, email, password)
}
