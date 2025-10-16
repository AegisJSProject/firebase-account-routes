import { NULL_USER } from './consts.js';

const PRELOADED = new Map();

/**
 * Strips a Firebase User object of sensitive security data (tokens) and makes is clonable (no methods)
 */
export function sanitizeUserObject(user = NULL_USER) {
	if (typeof user !== 'object' || user === NULL_USER || user === null) {
		return NULL_USER;
	} else {
		const {
			uid = null, displayName = null, email = null, photoURL = null, emailVerified = false, tenantId = null,
			phoneNumber = null, metadata = {}, isAnonymous = true, providerId = null, providerData = [],
		} = user;

		return Object.freeze({
			uid, displayName, email, photoURL, emailVerified, phoneNumber, metadata: Object.freeze(metadata),
			isAnonymous, tenantId, providerId, providerData: Object.freeze(providerData.map(d => Object.freeze(d))),
		});
	}
}

export async function preloadModule(module, {
	crossOrigin = 'anonymous',
	referrerPolicy = 'no-referrer',
	priority = 'auto',
	integrity = null,
	target = document.head,
	signal,
} = {}) {
	const { resolve, reject, promise } = Promise.withResolvers();

	if (signal instanceof AbortSignal && signal.aborted) {
		reject(signal.reason);
	} else if (! PRELOADED.has(module)) {
		PRELOADED.set(module, promise);
		const controller = new AbortController();

		try {
			const link = document.createElement('link');
			const sig = signal instanceof AbortSignal ? AbortSignal.any([signal, controller.signal]) : controller.signal;

			link.crossOrigin = crossOrigin;
			link.referrerPolicy = referrerPolicy;
			link.priority = priority;
			link.relList.add('modulepreload');

			if (typeof integrity === 'string') {
				link.integrity = integrity;
			}

			link.href = import.meta.resolve(module);
			target.append(link);

			link.addEventListener('load', event => {
				resolve(event.target.href);
				controller.abort();
				event.target.remove();
			}, { singal: sig });

			link.addEventListener('error', event => {
				const err = new DOMException(`Error loading ${event.target.href}`, 'NetworkError');
				reject(err);
				PRELOADED.delete(module);
				controller.abort(err);
				event.target.remove();
			}, { signal: sig });

			if (signal instanceof AbortSignal) {
				signal.addEventListener('abort', ({ target }) => {
					reject(target.reason);
					PRELOADED.delete(module);

					if (link.isConnected) {
						link.remove();
					}
				}, { signal: controller.signal, once: true });
			}
		} catch(err) {
			reject(err);

			PRELOADED.delete(module);

			if (! controller.signal.aborted) {
				controller.abort(err);
			}
		}
	} else {
		const result = await PRELOADED.get(module);
		resolve(result);
	}

	return await promise;
}
