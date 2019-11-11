import {prompt} from "enquirer";
import {RecordOf} from "immutable";

import {konservi} from "./legilo";
import {Vortaro, Vorttipo} from "./vortaro";
import {Petilo} from "./agoj";
import {aldoniSignifon, aldoniVorton, kreiVorton} from "./agoj/krei";
import {troviVortojn, troviVorton} from "./agoj/trovi";
import {kreiLigojn} from "./agoj/kreiLigojn";
import {substantivoEcoj, verboEcoj} from "./gramatiko";

export async function ĉefaMenuo(vortaro: RecordOf<Vortaro>, elirejo: string): Promise<void> {
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
		case "Krei vorton": {
			const {signifo, vorto} = await kreiVorton(vortaro, petilo, console.log);
			const kunSignifo = signifo != null ? aldoniSignifon(vortaro, signifo) : vortaro;
			await ĉefaMenuo(aldoniVorton(kunSignifo, vorto), elirejo);
			console.log(`Vi kreis la vorton ${vorto.vorto}`);
			break;
		}
		case "Trovi vortojn per signifo": {
			const rezultoj = await troviVortojn(vortaro, petilo);
			if (rezultoj.length === 0) {
				console.log("Neniun rezulton trovitan.");
			} else {
				console.log("Jen la rezultoj:");
				for (const {vorto} of rezultoj) {
					console.log(vorto);
				}
			}
			await ĉefaMenuo(vortaro, elirejo);
			break;
		}
		case "Trovi vorton": {
			const rezultoj = await troviVorton(vortaro, petilo);
			if (rezultoj == null) {
				console.log("Neniun vorton trovitan.");
			} else {
				console.log("Jen la rezulto:");
				console.log(`${rezultoj.vorto}: ${vortaro.signifoj.get(rezultoj.signifo)}`);
			}
			await ĉefaMenuo(vortaro, elirejo);
			break;
		}
		case "Redakti signifon":
			await ĉefaMenuo(await redaktiSignifon(vortaro, petilo), elirejo);
			break;
		case "Konservi kaj eliri":
			await konservi(vortaro, elirejo);
			break;
		default:
			await ĉefaMenuo(vortaro, elirejo);
			break;
		}
	} catch (e) {
		console.error(e);
		await ĉefaMenuo(vortaro, elirejo);
	}
}

async function redaktiSignifon(vortaro: RecordOf<Vortaro>, petilo: Petilo): Promise<RecordOf<Vortaro>> {
	const s = await petilo.petiSignifon(vortaro);
	const si = vortaro.signifoIndekso.get(s);
	if (si == null) {
		throw `La signifo ${s} ne ekzistas`;
	}
	const signifo = vortaro.signifoj.get(si);
	if (signifo == null) {
		throw `La signifo ${s} ne ekzistas?!`;
	}
	const {elekto} = await prompt<{elekto: string}>({
		type: "select",
		name: "elekto",
		message: `Kion vi volas fari kun "${signifo}"?`,
		choices: [
			"Aldoni S-V-ligojn",
			"Eliri",
		]
	});
	switch (elekto) {
	case "Aldoni S-V-ligojn":
		return kreiLigojn(signifo, vortaro, petilo);
	default:
		return vortaro;
	}
}

const uziNovan = "<Uzi novan>";
const petilo: Petilo = {
	async petiSignifon(vortaro) {
		const {eniro} = await prompt<{ eniro: string }>({
			type: "input",
			name: "eniro",
			message: "Kio estas la signifo?",
		});
		const ekzistantaj = vortaro.signifoj.valueSeq()
			.filter(s => s.signifo.indexOf(eniro) >= 0)
			.map(s => s.signifo)
			.toJSON();
		if (ekzistantaj.length > 0) {
			const {signifo} = await prompt<{ signifo: string }>({
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
		const {vorto} = await prompt<{ vorto: string }>({
			type: "input",
			message: "Kio estas la vorto?",
			name: "vorto"
		});
		return vorto;
	},
	async petiRadikojn(vortaro) {
		const {radikoj} = await prompt<{ radikoj: string[] }>({
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
		switch (vorttipo) {
		case "substantivo": {
			const {elektoj} = await prompt<{ elektoj: string[] }>({
				type: "multiselect",
				message: "Kiujn prepoziciojn la substantivo akceptas?",
				name: "elektoj",
				choices: Array.from(substantivoEcoj),
			});
			return elektoj.reduce((acc, sekva) => {
				return acc | (1 << substantivoEcoj.indexOf(sekva));
			}, 0);
		}
		case "verbo": {
			const {elektoj2} = await prompt<{ elektoj2: string[] }>({
				type: "multiselect",
				message: "Kiujn kazojn por la verbo?",
				name: "elektoj2",
				choices: Array.from(verboEcoj),
			});
			return elektoj2.reduce((acc, sekva) => {
				return acc | (1 << verboEcoj.indexOf(sekva));
			}, 0);
		}
		case "helpvorto":
			return 0;
		default:
			throw "La vorttipo estas nekonita";
		}
	},
	async petiĈuEkstera() {
		const {ekstera} = await prompt<{ ekstera: boolean }>({
			type: "confirm",
			message: "Ĉu ĉi tiu vorto estas ekstera?",
			name: "ekstera"
		});
		return ekstera;
	},
	async petiVerbojnPorSVLigoj(vortaro, verboj) {
		const {elektoj} = await prompt<{ elektoj: string[] }>({
			type: "multiselect",
			message: "Aldoni ligojn kun kiuj verboj?",
			name: "elektoj",
			choices: verboj.map(v => v.signifo).toJSON(),
		});
		return elektoj.map(e => {
			const nombro = vortaro.signifoIndekso.get(e);
			if (nombro == null) {
				throw `La signifo ${e} ne ekzistas?!`;
			} else {
				return nombro;
			}
		});
	}
};
