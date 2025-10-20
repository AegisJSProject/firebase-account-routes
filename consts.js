export const EVENT_TARGET = new EventTarget();

export const signOut = 'aegis:firebase:signout';

export const EVENTS = {
	signIn: 'aegis:account:sign-in',
	signUp: 'aegis:account:sign-up',
	signOut: 'aegis:account:sign-out',
	resetPassword: 'aegis:account:reset-password',
	verifyEmail: 'aegis:account:verify-email',
	verifyReset: 'aegis:account:verify-reset',
};

export const ROUTES = Object.freeze({
	signIn: Object.freeze({
		title: 'Sign-In',
		description: 'Access your account or log in to the application.',
		page: 'sign-in',
		url: './sign-in',
		module: './sign-in.js',
	}),
	signOut: Object.freeze({
		title: 'Sign-Out',
		description: 'Sign out of the application.',
		page: 'sign-out',
		url: './sign-out',
		module: './sign-out.js',
	}),
	signUp: Object.freeze({
		title: 'Sign-Up',
		description: 'Create a new user account to get started.',
		page: 'sign-up',
		url: './sign-up',
		module: './sign-up.js',
	}),
	resetPassword: Object.freeze({
		title: 'Reset Password',
		description: 'Initiate the process to reset your forgotten password.',
		page: 'reset-password',
		url: './reset-password',
		module: './reset-password.js',
	}),
	verifyEmail: Object.freeze({
		title: 'Verify Email',
		description: 'Confirm your email address to complete account activation.',
		page: 'verify-email',
		url: './verify-email',
		module: './verify-email.js',
	}),
	verifyReset: Object.freeze({
		title: 'Verify Password Reset',
		description: 'Complete the final step of changing your password using a verification link.',
		page: 'verify-reset',
		url: './verify-reset',
		module: './verify-reset.js',
	}),
	profile: Object.freeze({
		title: 'Account Profile',
		description: 'View Account Details',
		page: 'profile',
		url: './profile',
		module: './profile.js',
	}),
});

export const NULL_USER = Object.freeze({
	uid: null,
	displayName: null,
	email: null,
	photoURL: null,
	emailVerified: false,
	tenantId: null,
	phoneNumber: null,
	metadata: Object.freeze({}),
	isAnonymous: true,
	providerId: null,
	providerData: Object.freeze([]),
});
