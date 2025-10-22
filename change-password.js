import { navigate, back } from '@aegisjsproject/router';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { registerCallback, FUNCS } from '@aegisjsproject/callback-registry/callbacks.js';
import { onSubmit, onClick, onChange, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { passwordChangeValidator, changePassword, getCurrentUser } from './auth.js';

const ID = 'aegis-firebase-account-change-password';

const submit = registerCallback('aegis:firebase:change-password:submit', async event => {
	event.preventDefault();

	try {
		if (event.submitter instanceof HTMLButtonElement) {
			event.submitter.disabled = true;
		}

		const data = new FormData(event.target);

		await changePassword(data.get('newPassword'), data.get('oldPassword'));
		await navigate('/');
	} finally {
		if (event.submitter instanceof HTMLButtonElement && event.submitter.isConnected) {
			event.submitter.disabled = false;
		}
	}
});

const passwordChange = registerCallback('aegis:firebase:change-password:change', passwordChangeValidator);

export default async ({ signal }) => {
	const user = await getCurrentUser();

	if (user.isAnonymous) {
		await back();
	} else {
		const sig = registerSignal(signal);

		return html`<form id="${ID}" ${onSubmit}="${submit}" ${signalAttr}="${sig}">
			<fieldset class="no-border">
				<legend>Change Password</legend>
				<div class="form-group">
					<label for="${ID}-old-password" class="input-label required">Current Password</label>
					<input type="password" name="oldPassword" id="${ID}-old-password" class="input" autocomplete="current-password" placeholder="********" minlength="6" required="" />
				</div>
				<div class="form-group">
					<label for="${ID}-new-password" class="input-label required">New Password</label>
					<input type="password" name="newPassword" id="${ID}-new-password" class="input" autocomplete="new-password" placeholder="********" minlength="6" ${onChange}="${passwordChange}" ${signalAttr}="${sig}" required="" />
				</div>
			</fieldset>
			<div class="flex row wrap">
				<button type="submit" class="btn btn-success">
					<!-- Check Icon -->
					<span>Change Password</span>
				</button>
				<button type="button" class="btn btn-danger" ${onClick}="${FUNCS.navigate.back}" ${signalAttr}="${sig}">
					<!-- X Icon -->
					<span>Cancel</span>
				</button>
			</div>
		</form>`;
	}
};
