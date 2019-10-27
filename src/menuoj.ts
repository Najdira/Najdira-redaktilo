import { prompt } from "enquirer";
import { RecordOf, List } from "immutable";

import { Vortaro, Signifo, Vorto } from "./vortaro";
import { Petilo } from "./agoj";
import { aldoniVorton, kreiVorton } from "./agoj/krei";

export async function ĉefaMenuo(vortaro: RecordOf<Vortaro>, petilo: Petilo): Promise<void> {
	const {elekto} = await prompt<{elekto: string}>({
		type: "select",
		name: "elekto",
		message: "Kion vi volas fari?",
		choices: [
			"Krei vorton",
			"Redakti vorton",
			"Redakti signifon",
			"Konservi kaj eliri",
		]
	});

	try {
		switch (elekto) {
			case "Krei vorton":
				const {signifo, vorto} = await kreiVorton(vortaro, petilo, console.log);
				ĉefaMenuo(aldoniVorton(vortaro, vorto), petilo);
				console.log(`Vi kreis la vorton ${vorto.vorto}`);
				break;
			case "Konservi kaj eliri":
				return;
			default:
				await ĉefaMenuo(vortaro, petilo);
				break;
		}
	} catch (e) {
		console.error(e);
		ĉefaMenuo(vortaro, petilo);
	}
}