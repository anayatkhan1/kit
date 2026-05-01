import { type Browser, chromium } from "playwright-core";

const ANCHOR_BASE_URL = "https://api.anchorbrowser.io/v1";

export interface AnchorBrowserSession {
	id: string;
	cdp_url: string;
	live_view_url: string;
}

export interface StartAnchorSessionConfig {
	initialUrl?: string;
	headless?: boolean;
	timeout?: {
		maxDuration: number;
		idleTimeout: number;
	};
}

export async function startAnchorSession(
	apiKey: string,
	config: StartAnchorSessionConfig,
): Promise<AnchorBrowserSession> {
	const response = await fetch(`${ANCHOR_BASE_URL}/sessions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"anchor-api-key": apiKey,
		},
		body: JSON.stringify({
			session: {
				recording: { active: true },
				timeout: config.timeout ?? {
					max_duration: 10,
					idle_timeout: 5,
				},
				live_view: { read_only: true },
			},
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(
			`Failed to start Anchor Browser session: ${response.status} ${response.statusText} - ${error}`,
		);
	}

	const data = await response.json();
	return data.data as AnchorBrowserSession;
}

export async function endAnchorSession(
	apiKey: string,
	sessionId: string,
): Promise<void> {
	const response = await fetch(`${ANCHOR_BASE_URL}/sessions/${sessionId}`, {
		method: "DELETE",
		headers: {
			"anchor-api-key": apiKey,
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to end session: ${response.status} ${response.statusText}`,
		);
	}
}

export async function connectToAnchorSession(
	apiKey: string,
	sessionId: string,
): Promise<Browser> {
	const cdpUrl = `wss://connect.anchorbrowser.io?apiKey=${apiKey}&sessionId=${sessionId}`;
	return chromium.connectOverCDP(cdpUrl);
}
