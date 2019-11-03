import { readFile, writeFile } from "fs";
import { RecordOf, List, Map } from "immutable";

import { Signifo, Vorto, Vortaro, VorttipoNumeroj, VorttipoSignoĉenoj,
	Vorttipo } from "./vortaro";

export function legi(dosiero: string): Promise<RecordOf<Vortaro>> {
	return new Promise((sukcesi, malsukcesi) => {
		readFile(dosiero, (eraro, datumo) => {
			if (eraro != null) {
				malsukcesi(eraro);
				return;
			}

			const enhavo = datumo.toString("utf-8");
			const [signifoVicoj, vortoVicoj] = enhavo.split("\n\n");

			const signifoj = signifoVicoj.split("\n").map(vico => {
				const [signifo, tiponumero, ecoj] = vico.split("|");
				return Signifo({
					signifo,
					tipo: VorttipoNumeroj.get(tiponumero),
					ecoj: parseInt(ecoj),
				});
			});

			const vortoj = vortoVicoj.split("\n").map(vico => {
				const [vorto, signifoNumero, ...radikoj] = vico.split(" ");
				return Vorto({
					vorto,
					signifo: parseInt(signifoNumero),
					radikoj: List(radikoj.map(parseInt).filter(r => !isNaN(r))),
				});
			});
			
			sukcesi(Vortaro({
				signifoj: signifoj.reduce(
					(acc, sekva) => acc.set(acc.size, sekva),
					Map<number, RecordOf<Signifo>>()
				),
				vortoj: vortoj.reduce(
					(acc, sekva) => acc.set(acc.size, sekva),
					Map<number, RecordOf<Vorto>>()
				),
				signifoIndekso: signifoj.reduce(
					(acc, sekva, i) => acc.set(sekva.signifo, i),
					Map<string, number>()
				),
				vortoIndekso: vortoj.reduce(
					(acc, sekva, i) => acc.set(sekva.vorto, i),
					Map<string, number>()
				)
			}));
		});
	});
}

export function legiJSON(dosiero: string): Promise<RecordOf<Vortaro>> {
	return new Promise((sukcesi, malsukcesi) => {
		readFile(dosiero, (eraro, datumo) => {
			if (eraro != null) {
				malsukcesi(eraro);
				return;
			}

			const {signifoj, vortoj} = JSON.parse(datumo.toString("utf-8"));
			const legitajSignifoj: RecordOf<Signifo>[] =
				signifoj.map((s: {signifo: string, ecoj: number, tipo: string}) =>
					Signifo({
						signifo: s.signifo,
						ecoj: s.ecoj,
						tipo: s.tipo as Vorttipo
					})
				);

			const legitajVortoj: RecordOf<Vorto>[] =
				vortoj.map((v: {vorto: string, signifo: number, radikoj: number[]}) =>
					Vorto({
						vorto: v.vorto,
						signifo: v.signifo,
						radikoj: List(v.radikoj),
					})
				);

			sukcesi(Vortaro({
				signifoj: legitajSignifoj.reduce(
					(acc, sekva) => acc.set(acc.size, sekva),
					Map<number, RecordOf<Signifo>>()
				),
				vortoj: legitajVortoj.reduce(
					(acc, sekva) => acc.set(acc.size, sekva),
					Map<number, RecordOf<Vorto>>()
				),
				signifoIndekso: legitajSignifoj.reduce(
					(acc, sekva, i) => acc.set(sekva.signifo, i),
					Map<string, number>()
				),
				vortoIndekso: legitajVortoj.reduce(
					(acc, sekva, i) => acc.set(sekva.vorto, i),
					Map<string, number>()
				)
			}));
		})
	});
}

export function konservi(vortaro: RecordOf<Vortaro>, dosiero: string): Promise<void> {
	return new Promise((sukcesi, malsukcesi) => {
		writeFile(dosiero, JSON.stringify({
			signifoj: Array.from(vortaro.signifoj.entries())
				.sort((a, b) => a[0] < b[0] ? -1 : a[0] === b[0] ? 0 : 1).map(e => e[1]),
			vortoj: Array.from(vortaro.vortoj.entries())
				.sort((a, b) => a[0] < b[0] ? -1 : a[0] === b[0] ? 0 : 1).map(e => e[1]),
		}, null, 3), eraro => {
			if (eraro != null) {
				malsukcesi(eraro);
			} else {
				sukcesi();
			}
		});
	});
}