import { prompt } from "enquirer";
import { RecordOf, List } from "immutable";

import { konservi } from "./legilo";
import { Vortaro, Signifo, Vorto } from "./vortaro";
import { Petilo } from "./agoj";
import { aldoniVorton, aldoniSignifon, kreiVorton } from "./agoj/krei";
import { troviVortojn, troviVorton } from "./agoj/trovi";

export async function ĉefaMenuo(vortaro: RecordOf<Vortaro>, petilo: Petilo, elirejo: string): Promise<void> {
	const {elekto} = await prompt<{elekto: string}>({
		type: "select",
		name: "elekto",
		message: "Kion vi volas fari?",
		choices: [
			"Krei vorton",
			"Trovi vortojn per signifo",
			"Trovi vorton",
			"Redakti vorton",
			"Redakti signifon",
			"Konservi kaj eliri",
		]
	});

	try {
		switch (elekto) {
			case "Krei vorton":
				const {signifo, vorto} = await kreiVorton(vortaro, petilo, console.log);
				const kunSignifo = signifo != null ? aldoniSignifon(vortaro, signifo) : vortaro;
				ĉefaMenuo(aldoniVorton(kunSignifo, vorto), petilo, elirejo);
				console.log(`Vi kreis la vorton ${vorto.vorto}`);
				break;
			case "Trovi vortojn per signifo":
				const rezultoj = await troviVortojn(vortaro, petilo);
				if (rezultoj.length === 0) {
					console.log("Neniun rezulton trovitan.");
				} else {
					console.log("Jen la rezultoj:");
					for (const {vorto} of rezultoj) {
						console.log(vorto);
					}
				}
				await ĉefaMenuo(vortaro, petilo, elirejo);
				break;
			case "Trovi vorton":
				const rezultoj2 = await troviVorton(vortaro, petilo);
				if (rezultoj2 == null) {
					console.log("Neniun vorton trovitan.");
				} else {
					console.log("Jen la rezulto:");
					console.log(`${rezultoj2.vorto}: ${vortaro.signifoj.get(rezultoj2.signifo)}`);
				}
				await ĉefaMenuo(vortaro, petilo, elirejo);
				break;
			case "Konservi kaj eliri":
				await konservi(vortaro, elirejo);
				break;
			default:
				await ĉefaMenuo(vortaro, petilo, elirejo);
				break;
		}
	} catch (e) {
		console.error(e);
		await ĉefaMenuo(vortaro, petilo, elirejo);
	}
}