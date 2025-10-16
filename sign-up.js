import { register, passwordChangeValidator } from './auth.js';
import { preloadModule } from './utils.js';
import { EVENTS, dispatchAccountEvent } from './events.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { attr } from '@aegisjsproject/core/stringify.js';
import { registerCallback } from '@aegisjsproject/callback-registry/callbacks.js';
import { onSubmit, onChange, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { navigate } from '@aegisjsproject/router';
import { ROUTES } from './consts.js';

const ID = 'aegis-firebase-account-sign-up';

const passwordChange = registerCallback('aegis:firebase:signup:change', passwordChangeValidator);

const signUp = registerCallback('aegis:firebase:signup:submit', async event => {
	event.preventDefault();

	try {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = true;
		}

		const data = new FormData(event.target);

		const user = await register({
			email: data.get('email'),
			password: data.get('password'),
			displayName: data.get('name'),
			verify: true,
			storeCredentials: 'PasswordCredential' in globalThis,
		});

		if (dispatchAccountEvent(EVENTS.signUp, user)) {
			await navigate('/', { user });
		}
	} finally {
		if (event.submitter instanceof HTMLButtonElement && event.submitter.isConnected) {
			event.submitter.disabled = false;
		}
	}
});

preloadModule('firebase/app');
preloadModule('firebase/auth');

export default ({ signal, url }) => {
	const sig = registerSignal(signal);
	const params = url.searchParams;

	return html`<form id="${ID}" ${onSubmit}="${signUp}" ${signalAttr}="${sig}">
		<fieldset class="no-border">
			<legend>Sign-UP</legend>
			<div class="form-group">
				<label for="${ID}-name" class="input-label required">
					<!-- Name Icon -->
					<span>Name</span>
				</label>
				<input type="text" name="name" id="${ID}-name" class="input" placeholder="First Last" ${attr({ value: params.get('name') })} autocomplete="name" required="" />
			</div>
			<div class="form-group">
				<label for="${ID}-email" class="input-label required">
					<!-- Email SVG Icon -->
					<span>Email</span>
				</label>
				<input type="email" name="email" id="${ID}-email" class="input" placeholder="user@example.com" ${attr({ value: params.get('email') })} autocomplete="email" required="" />
			</div>
			<div class="form-group">
				<label for="${ID}-password" class="input-label required">
					<!-- Password SVG Icon -->
					<span>Password</span>
				</label>
				<input type="password" name="password" id="${ID}-password" class="input" ${onChange}="${passwordChange}" placeholder="********" autocomplete="new-password" required="" />
			</div>
		</fieldset>
		<div class="flex row wrap">
			<button type="submit" class="btn btn-primary">
				<!-- Submit Icon -->
				<span>Sign-Up</span>
			</button>
		</div>
		<div class="flex row wrap">
			<p>Already have an account? <a href="${new URL(ROUTES.signIn.url, url)}" class="btn btn-link"><!-- Sign-in Icon -->Sign In</a>.</p>
			<p>Forgot your password? <a href="${new URL(ROUTES.resetPassword.url, url)}" class="btn btn-link"><!-- Reset Icon --> Reset Password</a></p>
		</div>
	</form>`;
};
