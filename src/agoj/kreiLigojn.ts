import {Map, RecordOf} from "immutable";
import {Signifo, Vortaro} from "../vortaro";
import {Petilo} from "./index";

export async function kreiLigojn(signifo: RecordOf<Signifo>, vortaro: RecordOf<Vortaro>, petilo: Petilo) {
	const si = vortaro.signifoIndekso.get(signifo.signifo);
	if (si == null) {
		throw `La signifo ${signifo.signifo} ne ekzistas?!`;
	}
	switch (signifo.tipo) {
	case "substantivo": {
		const kazoj = await petilo.petiEcojn("verbo");
		const kapablajVerboj = vortaro.signifoj
			.filter(signifo => signifo.tipo === "verbo" && ((signifo.ecoj & kazoj) === kazoj))
			.valueSeq()
			.toList();
		const elektitaVerboj = await petilo.petiVerbojnPorSVLigoj(vortaro, kapablajVerboj);
		const ligoj = elektitaVerboj.reduce((acc, sekva) => acc.set(sekva, kazoj), Map<number, number>());
		const kunLigoj = signifo.set("svligoj",
			signifo.svligoj.mergeWith((malnova, nova) => malnova | nova, ligoj));
		return vortaro.set("signifoj", vortaro.signifoj.set(si, kunLigoj));
	}
	default:
		throw `La tipo ${signifo.tipo} ne povas enhavi S-V-ligojn`;
	}
}
