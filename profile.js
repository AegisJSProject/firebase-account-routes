import { NULL_USER } from './consts.js';
import { logout } from './auth.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { navigate, back } from '@aegisjsproject/router';
import { registerCallback } from '@aegisjsproject/callback-registry/callbacks.js';
import { onClick, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';

const signOut = registerCallback('aegis:firebase:signout', ({ currentTarget }) => {
	if (currentTarget instanceof HTMLButtonElement) {
		currentTarget.disabled = true;
	}

	logout().finally(() => {
		navigate('/');

		if (currentTarget instanceof HTMLButtonElement && currentTarget.isConnected) {
			currentTarget.disabled = false;
		}
	});
});

export default function({
	signal,
	state: {
		user: {
			uid = null,
			displayName = null,
			// email = null,
			photoURL = null,
			// emailVerified = false,
			// phoneNumber = null,
			isAnonymous = true,
		} = NULL_USER
	}
}) {
	if (isAnonymous) {
		back();
	} else {
		const sig = registerSignal(signal);
		return html`<div data-user="${uid}">
			<div>${displayName}</div>
			<img src="${photoURL}" crossorigin="anonymous" referrerpolicy="no-referrer" alt="${displayName} avatar" loading="lazy" />

			<button type="button" class="btn btn-danger" ${onClick}="${signOut}" ${signalAttr}="${sig}">
				<!-- Logout Icon -->
				<span>Sign-Out</span>
			</button>
		</div>`;
	}
}
