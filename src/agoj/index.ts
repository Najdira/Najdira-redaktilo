import { prompt } from "enquirer";
import { RecordOf } from "immutable";

import { Vortaro, Signifo, Vorto } from "../vortaro";

export interface Petilo {
	petiSignifon: (vortaro: RecordOf<Vortaro>) => Promise<string>,
	petiVorton: () => Promise<string>,
	petiRadikojn: (vortaro: RecordOf<Vortaro>) => Promise<string[]>,
}

export const petilo: Petilo = {
	async petiSignifon(vortaro) {
		const {signifo} = await prompt<{signifo: string}>({
			type: "autocomplete",
			name: "signifo",
			message: "Kio estas la signifo?",
			choices: Array.from(vortaro.signifoIndekso.keys()),
		});
		return signifo;
	},
	async petiVorton() {
		const {vorto} = await prompt<{vorto: string}>({
			type: "input",
			message: "Kio estas la vorto?",
			name: "vorto"
		});
		return vorto;
	},
	async petiRadikojn(vortaro) {
		const {radikoj} = await prompt<{radikoj: string[]}>({
			type: "list",
			message: "Kio estas la radikoj?",
			name: "radikoj"
		});
		for (let r of radikoj) {
			if (!vortaro.vortoIndekso.has(r)) {
				throw `La radiko ${r} ne ekzistas`;
			}
		}
		return radikoj;
	}
}