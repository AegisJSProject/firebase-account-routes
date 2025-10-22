import { NULL_USER } from './consts.js';

const { resolve: resolveApp, reject: rejectApp, promise: getInitializedFirebaseApp } = Promise.withResolvers();
const { resolve: resolveAuth, reject: rejectAuth, promise: getInitializedFirebaseAuth } = Promise.withResolvers();

export const getAuthUser = auth => auth.currentUser ?? NULL_USER;
export const isAuthSignedIn = auth => getAuthUser(auth) !== NULL_USER;

export async function initializeFirebaseApp(config) {
	try {
		const { initializeApp } = await import('firebase/app');
		const app = initializeApp(config);
		resolveApp(app);

		return app;
	} catch(err) {
		rejectApp(err);
	}
}

export async function getPasswordCredential({ mediation = 'optional', signal } = {}) {
	const { resolve, promise } = Promise.withResolvers();

	if ('PasswordCredential' in globalThis) {
		navigator.credentials.get({ password: true, mediation, signal })
			.then(resolve)
			.catch(err => {
				resolve({});
				reportError(err);
			});
	} else {
		resolve({});
	}

	return await promise;
}

export async function getFirebaseAuth(config) {
	try {
		if (typeof config !== 'undefined') {
			// No need to `await`
			initializeFirebaseApp(config);
		}

		const app = await getInitializedFirebaseApp;
		const { getAuth } = await import('firebase/auth');
		const auth = getAuth(app);
		resolveAuth(auth);

		return auth;
	} catch(err) {
		rejectAuth(err);
	}
}

export async function validatePassword(password) {
	const auth = await getFirebaseAuth();
	const { validatePassword } = await import('firebase/auth');

	return await validatePassword(auth, password);
}

export async function passwordChangeValidator(event) {
	if (event.target instanceof HTMLInputElement && event.type === 'change') {
		const auth = await getFirebaseAuth();
		const { validatePassword } = await import('firebase/auth');

		const {
			containsLowercaseLetter = true, containsNonAlphanumericCharacter = true, containsNumericCharacter = true, containsUppercaseLetter = true,
			meetsMaxPasswordLength = true, meetsMinPasswordLength = true, passwordPolicy, isValid,
		} =  await validatePassword(auth, event.target.value);

		if (isValid) {
			event.target.setCustomValidity('');
		} else if (! meetsMinPasswordLength) {
			event.target.setCustomValidity(`Password must be at least ${passwordPolicy.customStrengthOptions.minPasswordLength} characters.`);
		} else if (! meetsMaxPasswordLength) {
			event.target.setCustomValidity(`Password must be at most ${passwordPolicy.customStrengthOptions.maxPasswordLength} characters.`);
		} else if (! containsLowercaseLetter) {
			event.target.setCustomValidity('Password must contain at least one lowercase letter.');
		} else if (! containsUppercaseLetter) {
			event.target.setCustomValidity('Password must contain at least one uppercase letter.');
		} else if (! containsNumericCharacter) {
			event.target.setCustomValidity('Password must contain at least one digit.');
		} else if (! containsNonAlphanumericCharacter) {
			event.target.setCustomValidity(`Password must include at least one non-alphanumeric character [${passwordPolicy.customStrengthOptions.allowedNonAlphanumericCharacters}].`);
		} else {
			event.target.setCustomValidity('Password is invalid for unknown reasons.');
		}
	}
}

export async function login({
	email,
	password,
}) {
	const auth = await getFirebaseAuth();
	const { signInWithEmailAndPassword } = await import('firebase/auth');
	const { user } = await signInWithEmailAndPassword(auth, email, password);

	return user;
}

export async function logout() {
	const auth = await getFirebaseAuth();
	const { signOut } = await import('firebase/auth');

	return signOut(auth);
}

export async function register({
	email,
	password,
	name: displayName,
	image: photoURL,
	verify = true,
	storeCredentials = true,
}) {
	const auth = await getFirebaseAuth();
	const { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } = await import('firebase/auth');
	const { user } = await createUserWithEmailAndPassword(auth, email, password);
	const promises = [];

	if (typeof displayName === 'string' || typeof photoURL === 'string') {
		promises.push(updateProfile(user, { displayName, photoURL }));
	}

	if (verify) {
		promises.push(sendEmailVerification(user));
	}

	if (storeCredentials && 'PasswordCredential' in globalThis) {
		const cred = new PasswordCredential({ id: email, name: displayName, iconURL: photoURL, password });
		promises.push(navigator.credentials.store(cred));
	}

	if (promises.length !== 0) {
		await Promise.allSettled(promises);
	}

	return user;
}

export async function resetPassword(email) {
	const auth = await getFirebaseAuth();
	const { sendPasswordResetEmail } = await import('firebase/auth');

	return sendPasswordResetEmail(auth, email);
}

export async function deleteUser(password) {
	if (await reauthenticate(password)) {
		const [auth, { deleteUser: deleteAccount }] = await Promise.all([getFirebaseAuth(), import('firebase/auth')]);

		await deleteAccount(getAuthUser(auth));
	}
}

export async function reauthenticate(password) {
	const auth = await getFirebaseAuth();

	if (isAuthSignedIn(auth)) {
		const { EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
		const currentUser = getAuthUser(auth);
		const credential = EmailAuthProvider.credential(currentUser.email, password);
		const { user } = await reauthenticateWithCredential(currentUser, credential)
			.catch(() => ({ user: NULL_USER }));

		return user !== NULL_USER;
	} else {
		return false;
	}
}

export async function changePassword(newPassword, oldPassword) {
	if (await reauthenticate(oldPassword)) {
		const auth = await getFirebaseAuth();
		const { updatePassword } = await import('firebase/auth');
		await updatePassword(getAuthUser(auth), newPassword);
	}
}

export async function getCurrentUser() {
	const auth = await getFirebaseAuth();

	return getAuthUser(auth);
}

export async function getIdToken() {
	const user = await getCurrentUser();

	if (user === NULL_USER) {
		return null;
	} else {
		return user.getIdToken();
	}
}

export async function addAuthHeader(req) {
	if (req instanceof Headers) {
		const token = await getIdToken();

		if (typeof token === 'string') {
			req.set('Authorization', `Bearer ${token}`);
		}

		return req;
	} else if (req instanceof Request) {
		const token = await getIdToken();

		if (typeof token === 'string') {
			req.headers.set('Authorization', `Bearer ${token}`);
		}

		return req;
	} else {
		throw new TypeError('Can only add Auth header to a `Request` or `Headers` object.');
	}
}

export async function isLoggedIn() {
	const user = await getCurrentUser();

	return typeof user === 'object' && user !== NULL_USER;
}

export async function onStateChanged(callback) {
	const auth = await getFirebaseAuth();
	const { onAuthStateChanged } = await import('firebase/auth');

	onAuthStateChanged(auth, callback);
}

export async function whenLoggedIn() {
	const { resolve, promise } = Promise.withResolvers();
	const auth = await getFirebaseAuth();

	if (isAuthSignedIn(auth)) {
		const { onStateChanged } = await import('firebase/auth');
		onStateChanged(auth, () => resolve());
	} else {
		resolve();
	}

	return promise;
}

export async function verifyEmail(oobCode) {
	const auth = await getFirebaseAuth();
	const { applyActionCode } = await import('firebase/auth');
	await applyActionCode(auth, oobCode);
}

export async function verifyPasswordResetCode(oobCode) {
	const auth = await getFirebaseAuth();
	const { verifyPasswordResetCode } = await import('firebase/auth');
	return await verifyPasswordResetCode(auth, oobCode);
}

export async function confirmPasswordReset(oobCode, newPassword) {
	const auth = await getFirebaseAuth();
	const { confirmPasswordReset } = await import('firebase/auth');
	await confirmPasswordReset(auth, oobCode, newPassword);
}

export async function isEmailVerified() {
	const user = await getCurrentUser();
	return Boolean(user?.emailVerified);
}

export async function updateProfileData({ displayName, photoURL }) {
	const auth = await getFirebaseAuth();
	if (isAuthSignedIn(auth)) {
		const { updateProfile } = await import('firebase/auth');
		const user = await getCurrentUser();
		await updateProfile(user, { displayName, photoURL });
	}
}

export async function setPhoneNumber(phoneNumber) {
	const auth = await getFirebaseAuth();

	if (isAuthSignedIn(auth)) {
		const { updateProfile } = await import('firebase/auth');
		await updateProfile(getAuthUser(auth), { phoneNumber });
	}
}

export async function setPhotoURL(photoURL) {
	const auth = await getFirebaseAuth();

	if (isAuthSignedIn(auth)) {
		const { updateProfile } = await import('firebase/auth');
		await updateProfile(getAuthUser(auth), { photoURL });
	}
}

export { getInitializedFirebaseAuth, getInitializedFirebaseApp };
