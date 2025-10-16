export const EVENT_TARGET = new EventTarget();

export const EVENTS = {
	signIn: 'aegis:account:sign-in',
	signUp: 'aegis:account:sign-up',
	signOut: 'aegis:account:sign-out',
	resetPassword: 'aegis:account:reset-password',
	verifyEmail: 'aegis:account:verify-email',
	verifyReset: 'aegis:account:verify-reset',
};

export class AegisAccountEvent extends CustomEvent {
	constructor(type, { cancelable = true, bubbles = false, composed = false, detail } = {}) {
		super(type, { cancelable, bubbles, detail, composed });
	}
}

export function dispatchAccountEvent(type, user = null, { cancelable = true, bubbles = false, composed = false } = {}) {
	const event = new AegisAccountEvent(type, { detail: user, cancelable, bubbles, composed });
	EVENT_TARGET.dispatchEvent(event);

	return ! event.defaultPrevented;
}
