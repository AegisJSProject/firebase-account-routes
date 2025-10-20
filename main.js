import { ROUTES } from './consts.js';

function _createHandler(req) {
	return async function _handleReq(mod) {
		if (req.signal instanceof AbortSignal && req.signal.aborted) {
			throw req.signal.reason;
		} else if (typeof mod.default === 'function') {
			return await Promise.try(mod.default, req);
		} else if (typeof mod.default !== 'undefined') {
			return mod.default;
		} else {
			throw new TypeError('Module does not have a default export');
		}
	};
}

/**
 * @param {object} req
 * @param {object} req.matches The `matches` from `URLPattern`
 * @param {object} req.params Simplified version from `req.matches`
 * @param {object} req.state Taken from `history.state`
 * @param {number} req.timestamp From `performance.now`
 * @param {AbortSignal} req.signal An `AbortSignal` that aborts when the page is navigated away from
 */
export default async (req) => {
	switch(req.params.page) {
		case ROUTES.signIn.page:
			return await import(ROUTES.signIn.module).then(_createHandler(req));

		case ROUTES.signOut.page:
			return await import(ROUTES.signOut.module).then(_createHandler(req));

		case ROUTES.signUp.page:
			return await import(ROUTES.signUp.module).then(_createHandler(req));

		case ROUTES.resetPassword.page:
			return await import(ROUTES.resetPassword.module).then(_createHandler(req));

		case ROUTES.verifyEmail.page:
			return await import(ROUTES.verifyEmail.module).then(_createHandler(req));

		case ROUTES.verifyReset.page:
			return await import(ROUTES.verifyReset.module).then(_createHandler(req));

		case ROUTES.profile.page:
			return await import(ROUTES.profile.module).then(_createHandler(req));

		default:
			throw new Error(`No handler exists for "${req.params.page}".`);
	}
};

export const title = ({
	params: { page = null }
}) => {
	switch(page) {
		case ROUTES.signIn.page:
			return ROUTES.signIn.title;

		case ROUTES.signOut.page:
			return ROUTES.signOut.title;

		case ROUTES.signUp.page:
			return ROUTES.signUp.title;

		case ROUTES.resetPassword.page:
			return ROUTES.resetPassword.title;

		case ROUTES.verifyEmail.page:
			return ROUTES.verifyEmail.title;

		case ROUTES.verifyReset.page:
			return ROUTES.verifyReset.title;

		case ROUTES.profile.page:
			return ROUTES.profile.title;

		default:
			return 'Not Found';
	}
};

export const description = ({
	params: { page = null }
}) => {
	switch(page) {
		case ROUTES.signIn.page:
			return ROUTES.signIn.description;

		case ROUTES.signOut.page:
			return ROUTES.signOut.description;

		case ROUTES.signUp.page:
			return ROUTES.signUp.description;

		case ROUTES.resetPassword.page:
			return ROUTES.resetPassword.description;

		case ROUTES.verifyEmail.page:
			return ROUTES.verifyEmail.description;

		case ROUTES.verifyReset.page:
			return ROUTES.verifyReset.description;

		case ROUTES.profile.page:
			return ROUTES.profile.description;

		default:
			return 'Page Not Found';
	}
};
