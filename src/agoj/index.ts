import { prompt } from "enquirer";
import { RecordOf } from "immutable";

import { Vortaro, Signifo, Vorto, Vorttipo } from "../vortaro";

export interface Petilo {
	petiSignifon: (vortaro: RecordOf<Vortaro>) => Promise<string>,
	petiVorton: () => Promise<string>,
	petiRadikojn: (vortaro: RecordOf<Vortaro>) => Promise<string[]>,
	petiEcojn: (vorttipo: Vorttipo) => Promise<number>,
	petiĈuEkstera: () => Promise<boolean>,
}

const uziNovan = "<Uzi novan>";
const sEcoj = ["sur", "super", "sub", "apud", "en", "al", "kontraŭ"];

export const petilo: Petilo = {
	async petiSignifon(vortaro) {
		const {eniro} = await prompt<{eniro: string}>({
			type: "input",
			name: "eniro",
			message: "Kio estas la signifo?",
		});
		const ekzistantaj = vortaro.signifoj.valueSeq()
			.filter(s => s.signifo.indexOf(eniro) >= 0)
			.map(s => s.signifo)
			.toJSON();
		if (ekzistantaj.length > 0) {
			const {signifo} = await prompt<{signifo: string}>({
				type: "autocomplete",
				name: "signifo",
				message: "Ĉu vi volas uzi ekzistantan signifon?",
				choices: ekzistantaj.concat([uziNovan]),
			});
			if (signifo === uziNovan) {
				return eniro;
			} else {
				return signifo;
			}
		} else {
			console.log("Vi kreos novan signifon");
			return eniro;
		}
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
	},
	async petiEcojn(vorttipo: Vorttipo) {
		if (vorttipo === "substantivo") {
			const {elektoj} = await prompt<{elektoj: string[]}>({
				type: "multiselect",
				message: "Kiujn prepoziciojn la substantivo akceptas?",
				name: "elektoj",
				choices: sEcoj,
			});
			return elektoj.reduce((acc, sekva) => acc | 1 << sEcoj.indexOf(sekva), 0);
		}
		throw "La vorttipo estas nekonita";
	},
	async petiĈuEkstera() {
		return await prompt<boolean>({
			type: "confirm",
			message: "Ĉu ĉi tiu vorto estas ekstera?",
			name: "_"
		});
	}
}