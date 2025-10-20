import { logout } from './auth.js';
import { preloadModule } from './utils.js';
import { EVENTS, dispatchAccountEvent } from './events.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { navigate } from '@aegisjsproject/router';
import { registerCallback, FUNCS } from '@aegisjsproject/callback-registry/callbacks.js';
import { onClick, signal as signalAttr, registerSignal } from '@aegisjsproject/callback-registry/events.js';
import { ROUTES } from './consts.js';

const signOut = registerCallback('aegis-firebase-account-sign-up', async ({ currentTarget }) => {
	try {
		currentTarget.disabled = true;

		if (dispatchAccountEvent(EVENTS.signOut)) {
			await logout();
			await navigate('/');
		} else {
			currentTarget.disabled = false;
		}
	} catch(err) {
		reportError(err);
		currentTarget.disabled = false;
	}

});

preloadModule('firebase/app');
preloadModule('firebase/auth');

export default  ({ signal }) => {
	const sig = registerSignal(signal);

	return html`<div class="flex row wrap space-evenly">
		<button type="button" class="btn btn-danger" ${onClick}="${signOut}" ${signalAttr}="${sig}">
			<!-- Sign-Out Icon -->
			<span>Sign-Out</span>
		</button>
		<button type="button" class="btn btn-secondary" ${onClick}="${FUNCS.navigate.back}" ${signalAttr}="${sig}">
			<!-- Sign-Out Icon -->
			<span>Back</span>
		</button>
	</div>`;
};

export const title = ROUTES.signOut.title;
export const description = ROUTES.signOut.description;
