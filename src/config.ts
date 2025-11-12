import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Aneeq in the Matrix",
	subtitle: "Cats, Code, and Syscall Stories",
	lang: "en", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 265, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/wallbg.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "bottom", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 3, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/favicon/favicon-32x32.png",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-16x16.png",
			sizes: "16x16",
		},
		{
			src: "/favicon/apple-touch-icon.png",
			sizes: "180x180",
		},
		{
			src: "/favicon/android-chrome-192x192.png",
			sizes: "192x192",
		},
		{
			src: "/favicon/android-chrome-512x512.png",
			sizes: "512x512",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.Series,
		LinkPreset.About,
		{
			name: "GitHub",
			url: "https://github.com/Aneeqasif", // Internal links should not include the base path, as it is automatically added
			external: true, // Show an external link icon and will open in a new tab
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/os16.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Aneeq Asif Azad",
	bio: "Cats, Code, and Syscall Stories",
	// bio: "Engage with a tapestry of algorithms, physics, and subtle threads of personal reflections.",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://twitter.com/AneeqAzad",
		},
		{
			name: "LinkedIn",
			icon: "fa6-brands:linkedin",
			url: "https://www.linkedin.com/in/aneeqazad",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Aneeqasif",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
