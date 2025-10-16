import { html } from '@aegisjsproject/core/parsers/html.js';
import { registerCallback } from '@aegisjsproject/callback-registry/callbacks.js';
import { onSubmit, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { navigate } from '@aegisjsproject/router';
import { resetPassword } from './auth.js';
import { ROUTES } from './consts.js';
import { preloadModule } from './utils.js';
import { dispatchAccountEvent, EVENTS } from './events.js';

const ID = 'aegis-firebase-account-password-reset';

const submit = registerCallback('aegis:firebase:password-reset', async event => {
	event.preventDefault();
	try {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = true;
		}

		const data = new FormData(event.target);
		const user = await resetPassword(data.get('email'));

		if (dispatchAccountEvent(EVENTS.resetPassword, user)) {
			await navigate('/', { user });
		}
	} catch(err) {
		reportError(err);
	} finally {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = false;
		}
	}
});

preloadModule('firebase/app');
preloadModule('firebase/auth');

export default ({ signal, url }) => {
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
		</fieldset>
		<div class="flex row wrap">
			<button type="submit" class="btn btn-primary">
				<!-- Submit Icon -->
				<span>Sign-In</span>
			</button>
		</div>
		<div class="flex row wrap">
			<p>Need an account? <a href="${new URL(ROUTES.signUp.url, url)}" class="btn btn-link"><!-- Sign-up Icon -->Sign Up</a>.</p>
			<p>Rember your password? <a href="${new URL(ROUTES.signIn.url, url)}" class="btn btn-link"><!-- Sign-In Icon --> Sign-In</a></p>
		</div>
	</form>`;
};

export const title = ROUTES.resetPassword.title;
export const description = ROUTES.resetPassword.description;
