import '@shgysk8zer0/polyfills';
import { imports } from'@shgysk8zer0/importmap';
import { ROUTES } from './consts.js';

const HOSTNAME = 'localhost';
const PORT = 4040;
const BASE = '/account/';
const url = `http://${HOSTNAME}:${PORT}${BASE}`;
const STYLES = ['properties', 'reset', 'theme', 'button', 'forms', 'misc', 'scrollbar'];
const NONCE = crypto.randomUUID();

const style = sheet => `<link rel="stylesheet" href="https://unpkg.com/@aegisjsproject/styles@0.2.7/css/${sheet}.css" crossorigin="anonymous" referrerpolicy="no-referrer" nonce="${NONCE}" />`;

const favicon = 'data:image/svg+xml;base64,' + new TextEncoder().encode(`<svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
	<rect fill="#${crypto.getRandomValues(new Uint8Array(3)).toHex()}" width="16" height="16" x="0" y="0" rx="1" ry="1"></rect>
</svg>`).toBase64({ alphabet: 'base64' });

const getLink = (path, params) => {
	const result = new URL(path, url);

	if (typeof params === 'object') {
		Object.entries(params).forEach(([key, val]) => result.searchParams.set(key, val));
	}

	return result;
};

const sri = async str => {
	const bytes = new TextEncoder().encode(str);
	const hash = await crypto.subtle.digest('SHA-256', bytes);

	return 'sha256-' + new Uint8Array(hash).toBase64({ alphabet: 'base64' });
};

const importmap = JSON.stringify({ imports });
const importmapHash = await sri(importmap);

const script = `import '@shgysk8zer0/polyfills';
import { init as initRouter } from '@aegisjsproject/router';
import { initializeFirebaseApp } from '/auth.js';
import { observeEvents } from '@aegisjsproject/callback-registry/events.js';
const rootEl = document.getElementById('root');

initRouter({
	'/account/:page': '/main.js',
}, {
	rootEl,
});

observeEvents();

fetch('/creds').then(resp => resp.json()).then(initializeFirebaseApp);`;

const scriptHash = await sri(script);

const doc = `<!DOCTYPE html>
<html data-theme="dark">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<meta name="color-scheme" content="light dark" />
		<script type="importmap" integrity="${importmapHash}">${importmap}</script>
		<script type="module" integrity="${scriptHash}" src="/index.js">${script}</script>
		<link rel="icon" href="${favicon}" type="image/svg+xml" sizes="any" />
		${STYLES.map(style).join('\n')}
	</head>
	<body>
		<nav id="nav">
			<a href="/" class="btn btn-link">Home</a>
			<a href="${getLink(ROUTES.signIn.url, { redirect: '/account/profile' })}"class="btn btn-link">${ROUTES.signIn.title}</a>
			<a href="${getLink(ROUTES.signUp.url)}" class="btn btn-link">${ROUTES.signUp.title}</a>
			<a href="${getLink(ROUTES.resetPassword.url)}" class="btn btn-link">${ROUTES.resetPassword.title}</a>
			<a href="${getLink(ROUTES.verifyEmail.url, { oobCode: globalThis.process.env.oobCode })}" class="btn btn-link">Verify</a>
		</nav>
		<main id="root"></main>
	</body>
</html>`;

const headers = new Headers({
	'Content-Type': 'text/html',
	'Content-Security-Policy': `default-src 'self'; script-src 'self' https://unpkg.com/@shgysk8zer0/ https://unpkg.com/@aegisjsproject/  https://www.gstatic.com/firebasejs/ '${scriptHash}' '${importmapHash}'; img-src 'self' https://secure.gravatar.com/avatar/ data:; style-src 'self' 'nonce-${NONCE}'; connect-src 'self' https://identitytoolkit.googleapis.com/v2/ https://identitytoolkit.googleapis.com/v1/ https://securetoken.googleapis.com/v1/`,
});

export default {
	open: true,
	hostname: HOSTNAME,
	port: PORT,
	routes: {
		'/': () => new Response(doc, { headers }),
		'/account/': () => new Response(doc, { headers }),
		'/index.js': () => new Response(script, { headers: { 'Content-Type': 'application/javascript' }}),
		'/creds': () => Response.json({
			apiKey: globalThis.process?.env?.apiKey,
			authDomain: globalThis.process?.env?.authDomain,
			projectId: globalThis.process?.env?.projectId,
			storageBucket: globalThis.process?.env?.storageBucket,
			messagingSenderId: globalThis.process?.env?.messagingSenderId,
			appId: globalThis.process?.env?.appId,
			measurementId: globalThis.process?.env?.measurementId,
		})
	}
};
