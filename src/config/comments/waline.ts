import type { WalineInitOptions } from "@waline/client";

/**
 * Central Waline configuration.
 *
 * Change `serverURL` if you move the Waline backend. Adjust `login` to
 * `'disable' | 'enable' | 'force'` if you want to restrict guest comments in
 * the future.
 */
export const WALINE_SERVER_URL = "https://fuwari-waline.vercel.app/";

export interface WalineClientConfig extends Omit<WalineInitOptions, "el"> {}

export const walineClientConfig: WalineClientConfig = {
	serverURL: WALINE_SERVER_URL,
	login: "enable",
	meta: ["nick", "mail", "link"],
	requiredMeta: ["nick"],
	commentSorting: "latest",
	pageSize: 10,
	dark: "html.dark",
	pageview: true,
	comment: true,
	reaction: true,
	wordLimit: [0, 500],
	lang: "en-US",
	locale: {
		optional: "Optional",
		placeholder: "Comment here...",
		comment: "Comments",
		reactionTitle: "What do you think?",
		sofa: "No comments yet. Be the first to share something!",
	},
};
