import { prompt } from "enquirer";
import { RecordOf } from "immutable";

import { Vortaro } from "./vortaro";

export async function ĉefaMenuo(vortaro: RecordOf<Vortaro>): Promise<void> {
	const {elekto} = await prompt<{elekto: string}>({
		type: "select",
		name: "elekto",
		message: "Kion vi volas fari?",
		choices: [
			"Krei vorton",
			"Redakti vorton",
			"Redakti signifon",
		]
	});

	switch (elekto) {
		case "Krei vorton":
			break;
		default:
			await ĉefaMenuo(vortaro);
			break;
	}
}