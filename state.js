import { Signal } from '@shgysk8zer0/signals';
import { getInitializedFirebaseAuth } from './auth.js';
import { NULL_USER } from './consts.js';

// Private state to hold user data & initialization
const $userState = new Signal.State(NULL_USER);
const $initialized = new Signal.State(false);

// Exported computed... Prevents externally setting the state
export const $user = new Signal.Computed(() => $userState.get());
export const $isLoggedIn = new Signal.Computed(() => $userState.get() !== NULL_USER);
export const $uid = new Signal.Computed(() => $user.get().uid);
export const $displayName = new Signal.Computed(() => $user.get().displayName);
export const $photoURL = new Signal.Computed(() => $user.get().photoURL);
export const $email = new Signal.Computed(() => $user.get().email);
export const $isAnonymous = new Signal.Computed(() => $user.get().isAnonymous);
export const $authInitialized = new Signal.Computed(() => $initialized.get());

// `getInitializedFirebaseAuth` is a `Promise` that resolves when Firebase Auth is imported and configured... Lazy loading...
getInitializedFirebaseAuth.then(async auth => {
	$initialized.set(true);
	$userState.set(auth.currentUser ?? NULL_USER);
	const { onAuthStateChanged } = await import('firebase/auth');

	onAuthStateChanged(auth, user => {
		user === null ? $userState.set(NULL_USER) : $userState.set(user);
	});
});
