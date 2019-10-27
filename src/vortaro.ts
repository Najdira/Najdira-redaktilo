import { Record, RecordOf, List, Map } from "immutable";

export type Vorttipo = "substantivo" | "verbo" | "nekonita";

export const VorttipoNumeroj = Map({
	0: "nekonita" as Vorttipo,
	1: "substantivo" as Vorttipo,
	2: "verbo" as Vorttipo,
});

export const VorttipoSignoĉenoj = Map({
	nekonita: 0,
	substantivo: 1,
	verbo: 2,
});

export interface Signifo {
	signifo: string,
	ecoj: number,
	tipo: Vorttipo
}

export const Signifo = Record<Signifo>({
	signifo: "",
	ecoj: 0,
	tipo: "nekonita",
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
}

export const Vortaro = Record<Vortaro>({
	signifoj: Map(),
	vortoj: Map(),
});