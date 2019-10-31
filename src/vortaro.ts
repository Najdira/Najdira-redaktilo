import { Record, RecordOf, List, Map } from "immutable";

export type Vorttipo = "substantivo" | "verbo" | "helpvorto" | "nekonita";

export const VorttipoNumeroj = Map({
	0: "nekonita" as Vorttipo,
	1: "substantivo" as Vorttipo,
	2: "verbo" as Vorttipo,
	3: "helpvorto" as Vorttipo,
});

export const VorttipoSignoĉenoj = Map({
	nekonita: 0,
	substantivo: 1,
	verbo: 2,
	helpvorto: 3,
});

export interface Signifo {
	signifo: string,
	ecoj: number,
	tipo: Vorttipo,
	extera: boolean,
}

export const Signifo = Record<Signifo>({
	signifo: "",
	ecoj: 0,
	tipo: "nekonita",
	extera: false,
});

export interface Vorto {
	vorto: string,
	signifo: number,
	radikoj: List<number>,
}

export const Vorto = Record<Vorto>({
	vorto: "",
	signifo: 0,
	radikoj: List(),
});

export interface Vortaro {
	signifoj: Map<number, RecordOf<Signifo>>,
	vortoj: Map<number, RecordOf<Vorto>>,
	signifoIndekso: Map<string, number>,
	vortoIndekso: Map<string, number>,
}

export const Vortaro = Record<Vortaro>({
	signifoj: Map(),
	vortoj: Map(),
	signifoIndekso: Map(),
	vortoIndekso: Map(),
});