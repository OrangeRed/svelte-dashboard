/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	daisyui: {
		themes: ['synthwave']
	},
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')]
};
