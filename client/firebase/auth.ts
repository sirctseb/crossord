import { atom } from 'recoil';
import firebase from './app';

export interface UnloadedAuth {
  isLoaded: false;
  isEmpty: true;
}
export interface LoadedEmptyAuth {
  isLoaded: true;
  isEmpty: true;
}
export interface LoadedAuth extends firebase.UserInfo {
  isLoaded: true;
  isEmpty: false;
}

export type AuthState = UnloadedAuth | LoadedEmptyAuth | LoadedAuth;

export const firebaseAuth = atom<AuthState>({
  key: 'firebase-auth',
  default: { isLoaded: false, isEmpty: true },
  effects_UNSTABLE: [
    ({ setSelf }) => {
      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          return { isLoaded: true, isEmpty: true };
        }
        const { displayName, email, phoneNumber, photoURL, providerId, uid } = user;
        setSelf({ displayName, email, phoneNumber, photoURL, providerId, uid, isLoaded: true, isEmpty: false });
      });
    },
  ],
});
