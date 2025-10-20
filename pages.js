import { html } from '@aegisjsproject/core/parsers/html.js';
import { ROUTES } from './consts.js';

export default ({ url }) => html`<div class="flex row wrap">
	<a href="${new URL(ROUTES.signIn.url, url)}" class="btn btn-link">Sign-In</a>
	<a href="${new URL(ROUTES.signUp.url, url)}" class="btn btn-link">Sign-Up</a>
	<a href="${new URL(ROUTES.resetPassword.url, url)}" class="btn btn-link">Forgot Password</a>
</div>`;

export const title = ROUTES.account.title;
export const description = ROUTES.account.description;
