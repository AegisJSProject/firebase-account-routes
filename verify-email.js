import { html } from '@aegisjsproject/core/parsers/html.js';
import { attr } from '@aegisjsproject/core/stringify.js';
import { registerCallback } from '@aegisjsproject/callback-registry/callbacks.js';
import { onSubmit, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { navigate } from '@aegisjsproject/router';
import { verifyEmail } from './auth.js';
import { ROUTES } from './consts.js';
import { preloadModule } from './utils.js';
import { dispatchAccountEvent, EVENTS } from './events.js';

const ID = 'aegis-firebase-account-verify-email';

const submit = registerCallback('aegis:firebase:verify-email', async event => {
	event.preventDefault();
	try {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = true;
		}

		const data = new FormData(event.target);
		const user = await verifyEmail(data.get('oobcode'));

		if (dispatchAccountEvent(EVENTS.verifyEmail, user)) {
			await navigate('/', { user });
		}
	} catch(err) {
		reportError(err);
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
	const searchParams = url.searchParams;

	return html`<form id="${ID}" ${onSubmit}="${submit}" ${signalAttr}="${sig}">
		<fieldset class="no-border">
			<legend>Sign-In</legend>
			<div class="form-group">
				<label for="${ID}-oobcode" class="input-label required">
					<!-- Email SVG Icon -->
					<span>Code</span>
				</label>
				<input type="text" name="oobcode" id="${ID}-oobcode" class="input" placeholder="abc123" minlength="54" ${attr({ value: searchParams.get('oobCode') })} required="" />
			</div>
		</fieldset>
		<div class="flex row wrap">
			<button type="submit" class="btn btn-primary">
				<!-- Submit Icon -->
				<span>Verify Email</span>
			</button>
		</div>
		<div class="flex row wrap">
			<p>Need an account? <a href="${new URL(ROUTES.signUp.url, url)}" class="btn btn-link"><!-- Sign-up Icon -->Sign Up</a>.</p>
			<p>Already have an account? <a href="${new URL(ROUTES.signIn.url, url)}" class="btn btn-link"><!-- Sign-in Icon -->Sign In</a>.</p>
		</div>
	</form>`;
};

export const title = ROUTES.verifyEmail.title;
export const description = ROUTES.verifyEmail.description;
