import { navigate } from '@aegisjsproject/router';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { registerCallback } from '@aegisjsproject/callback-registry/callbacks.js';
import { onSubmit, onClick, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { login, getPasswordCredential } from './auth.js';
import { dispatchAccountEvent, EVENTS } from './events.js';
import { ROUTES } from './consts.js';
import { preloadModule, sanitizeUserObject } from './utils.js';
// I'd import some icons as strings too, but do not have them yet

export async function autoSignIn({ mediation = 'optional', signal } = {}) {
	const cred = await getPasswordCredential({ mediation, signal });

	if (typeof cred.id === 'string') {
		return await login(cred.id, cred.password);
	}
}

const ID = 'aegis-firebase-account-sign-in';
// Do not `await`... It'll load once the app is initialized.
// getFirebaseAuth();

const submit = registerCallback('aegis:firebase:signin', async event => {
	event.preventDefault();

	try {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = true;
		}

		const data = new FormData(event.target);
		const user = await login({ email: data.get('email'), password: data.get('password') });

		if (dispatchAccountEvent(EVENTS.signIn, user)) {
			const params = new URLSearchParams(location.search);
			const url = URL.parse(params.has('redirect') ? params.get('redirect') : '/', document.baseURI);

			if (url.origin === location.origin) {
				await navigate(url, { user: sanitizeUserObject(user) });
			} else {
				await navigate('/', { user: sanitizeUserObject(user) });
			}
		}
	} catch(err) {
		reportError(err);
	} finally {
		if (event.submitter instanceof HTMLButtonElement && event.submitter.isConnected) {
			event.submitter.disabled = false;
		}
	}
});

const autoLogin = registerCallback('aegis:firebase:signIn:auto', autoSignIn);
preloadModule('firebase/app');
preloadModule('firebase/auth');

export default function({ signal, url }) {
	const sig = registerSignal(signal);

	return html`<form id="${ID}" ${onSubmit}="${submit}" ${signalAttr}="${sig}">
		<fieldset class="no-border">
			<legend>Sign-In</legend>
			<div class="form-group">
				<label for="${ID}-email" class="input-label required">
					<!-- Email SVG Icon -->
					<span>Email</span>
				</label>
				<input type="email" name="email" id="${ID}-email" class="input" placeholder="user@example.com" autocomplete="email" required="" />
			</div>
			<div class="form-group">
				<label for="${ID}-password" class="input-label required">
					<!-- Password SVG Icon -->
					<span>Password</span>
				</label>
				<input type="password" name="password" id="${ID}-password" class="input" placeholder="********" autocomplete="current-password" required="" />
			</div>
		</fieldset>
		<div class="flex row wrap">
			<button type="submit" class="btn btn-primary">
				<!-- Submit Icon -->
				<span>Sign-In</span>
			</button>
		</div>
		<div class="flex row wrap">
			<p>Need an account? <a href="${new URL(ROUTES.signUp.url, url)}" class="btn btn-link"><!-- Sign-up Icon -->Sign Up</a>.</p>
			<p>Forgot your password? <a href="${new URL(ROUTES.resetPassword.url, url)}" class="btn btn-link"><!-- Reset Icon --> Reset Password</a></p>
			<button type="button" class="btn btn-secondary" ${onClick}="${autoLogin}" ${signalAttr}="${sig}"${'PasswordCredential' in globalThis ? '' : ' disabled=""'}>Auto Sign-In</button>
		</div>
	</form>`;
};

export const title = ROUTES.signIn.title;
export const description = ROUTES.signIn.description;
