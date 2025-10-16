import { passwordChangeValidator, confirmPasswordReset } from './auth.js';
import { preloadModule } from './utils.js';
import { dispatchAccountEvent, EVENTS } from './events.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { attr } from '@aegisjsproject/core/stringify.js';
import { registerCallback } from '@aegisjsproject/callback-registry/callbacks.js';
import { onSubmit, onChange, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { navigate } from '@aegisjsproject/router';
// import { ROUTES } from './consts.js';

const ID = 'aegis-firebase-account-verify-reset';

const passwordChange = registerCallback('aegis:firebase:verify-reset:change', passwordChangeValidator);

const submit = registerCallback('aegis:firebase:verify-reset', async event => {
	event.preventDefault();

	try {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = true;
		}

		const data = new FormData(event.target);
		const user = await confirmPasswordReset(data.get('odbcode', data.get('password')));

		if (dispatchAccountEvent(EVENTS.verifyReset, user)) {
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

export default ({ url, signal }) => {
	const sig = registerSignal(signal);
	const searchParams = url.searchParams;

	return html`<form id="${ID}" ${onSubmit}="${submit}" ${signalAttr}="${sig}">
		<fieldset class="no-border">
			<div class="form-group">
				<label for="${ID}-odbcode" class="input-label required">Reset Code</label>
				<input type="text" name="odbcode" id="${ID}-odbcode" class="input" placeholder="abc123" minlength="54" ${attr({ value: searchParams.get('odbCode') })} required="" />
			</div>
			<div class="form-group">
				<label for="${ID}-password" class="input-label required">New Password</label>
				<input type="password" name="password" id="${ID}-password" class="input" autocomplete="new-password" minlength="6" ${onChange}="${passwordChange}" ${signalAttr}="${sig}" required="" />
			</div>
		</fieldset>
		<div class="flex row wrap">
			<button type="submit" class="btn btn-primary">Confirm New Password</button>
		</div>
	</form>`;
};
