import {List, RecordOf} from "immutable";

import {Signifo, Vortaro, Vorttipo} from "../vortaro";
import {verboEcoj} from "../gramatiko";

export interface Petilo {
	petiSignifon: (vortaro: RecordOf<Vortaro>) => Promise<string>,
	petiVorton: () => Promise<string>,
	petiRadikojn: (vortaro: RecordOf<Vortaro>) => Promise<string[]>,
	petiEcojn: (vorttipo: Vorttipo) => Promise<number>,
	petiĈuEkstera: () => Promise<boolean>,
	petiVerbojnPorSVLigoj: (vortaro: RecordOf<Vortaro>, verboj: List<RecordOf<Signifo>>)
		=> Promise<number[]>,
}

export function ecojDeVerbo(signifo: string) {
	return verboEcoj.reduce((acc, sekva, i) => {
		const re = new RegExp(`\\W*${sekva}\\W*`);
		if (re.test(signifo)) {
			return acc | (1 << i);
		} else {
			return acc;
		}
	}, 0);
}

