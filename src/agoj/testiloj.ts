import { Petilo } from ".";

export function kreiTestanPetilon(
	opcioj : {
		signifo?: string,
		vorto?: string,
		radikoj?: string[],
		ecoj?: number,
		ĉuEkstera?: boolean,
		svligoj?: number[],
	}
): Petilo {
	return {
		petiSignifon() {
			if (opcioj.signifo != null) {
				return Promise.resolve(opcioj.signifo);
			}
			throw "Neniu valuo en la testa petilo";
		},
		petiVorton() {
			if (opcioj.vorto != null) {
				return Promise.resolve(opcioj.vorto);
			}
			throw "Neniu valuo en la testa petilo";
		},
		petiRadikojn() {
			if (opcioj.radikoj != null) {
				return Promise.resolve(opcioj.radikoj);
			}
			throw "Neniu valuo en la testa petilo";
		},
		petiEcojn() {
			if (opcioj.ecoj != null) {
				return Promise.resolve(opcioj.ecoj);
			}
			throw "Neniu valuo en la testa petilo";
		},
		petiĈuEkstera() {
			if (opcioj.ĉuEkstera != null) {
				return Promise.resolve(opcioj.ĉuEkstera);
			}
			throw "Neniu valuo en la testa petilo";
		},
		petiVerbojnPorSVLigoj() {
			if (opcioj.svligoj != null) {
				return Promise.resolve(opcioj.svligoj);
			}
			throw "Neniu valuo en la testa petilo";
		}
	};
}
