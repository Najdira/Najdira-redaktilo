import {Vorttipo} from "./vortaro";

const substantivoFinaĵoj = new Set(["ma", "mE", "na", "to", "ri", "ju", "ka"]);
const verboFinaĵoj = new Set(["be", "vi", "sa", "nA", "zɔ", "lu", "ko"]);
const helpvortoFinaĵoj = new Set(["mi", "no", "ta", "ti", "se", "so", "li", "ja", "gi", "ku"]);

export function tipo(vorto: string): Vorttipo {
	const finaĵo = vorto.slice(vorto.length - 2);
	if (substantivoFinaĵoj.has(finaĵo)) {
		return "substantivo";
	} else if (verboFinaĵoj.has(finaĵo)) {
		return "verbo";
	} else if (helpvortoFinaĵoj.has(finaĵo)) {
		return "helpvorto";
	} else {
		return "nekonita";
	}
}

export const substantivoEcoj = ["sur", "super", "sub", "apud", "en", "al", "kontraŭ"];
export const verboEcoj = ["N", "A", "D", "Lo", "La", "I", "E"];
