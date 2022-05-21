import { MarinaProvider } from 'marina-provider';

const MAX_TRY = 60;
const INTERVAL_MS = 1000;

export async function getMarina(): Promise<MarinaProvider> {
	for (let i = 0; i < MAX_TRY; i++) {
		const isInstalled = typeof (window as any).marina !== "undefined";
		if (!isInstalled) {
			await new Promise<void>((resolve) => setTimeout(() => resolve(), INTERVAL_MS))
			continue;
		}

		const marina: MarinaProvider = (window as any).marina;
		return marina;
	}

	throw new Error("Marina needs to be installed");
}
