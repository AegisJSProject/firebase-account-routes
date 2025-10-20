import { NULL_USER, ROUTES } from './consts.js';
import { html } from '@aegisjsproject/core/parsers/html.js';
import { back } from '@aegisjsproject/router';

export default async function({
	url,
	state: {
		user: {
			uid = null,
			displayName = null,
			email = null,
			photoURL = null,
			// emailVerified = false,
			phoneNumber = null,
			isAnonymous = true,
		} = NULL_USER,
	}
}) {
	if (isAnonymous) {
		back();
	} else {
		return html`<div data-user="${uid}">
			<div>${displayName}</div>
			<div>${email}</div>
			<div>${phoneNumber}</div>
			<img src="${photoURL}" crossorigin="anonymous" referrerpolicy="no-referrer" alt="${displayName} avatar" loading="lazy" />
			<a href="${new URL(ROUTES.signOut.url, url)}" class="btn btn-danger"><!-- Sign-out Icon -->Sign-Out</a>
		</div>`;
	}
}
