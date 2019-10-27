import { readFile, writeFile } from "fs";
import { RecordOf, List, Map } from "immutable";

import { Signifo, Vorto, Vortaro, VorttipoNumeroj, VorttipoSignoĉenoj } from "./vortaro";

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
			}));
		});
	});
}

export function konservi(vortaro: RecordOf<Vortaro>, dosiero: string): Promise<void> {
	return new Promise((sukcesi, malsukcesi) => {
		const signifoVicoj = Array.from(Array(vortaro.signifoj.size).keys()).map(i => {
			const signifo = vortaro.signifoj.get(i);
			if (signifo == null) {
				throw `Signifo ne trovita ${i}`;
			}
			return `${signifo.signifo}|${VorttipoSignoĉenoj.get(signifo.tipo)}|${signifo.ecoj}`;
		});

		const vortoVicoj = Array.from(Array(vortaro.vortoj.size).keys()).map(i => {
			const vorto = vortaro.vortoj.get(i);
			if (vorto == null) {
				throw `Vorto ne trovita ${i}`;
			}
			return `${vorto.vorto} ${vorto.signifo} ${vorto.radikoj.join(" ")}`;
		});

		const enhavo = `${signifoVicoj.join("\n")}\n\n${vortoVicoj.join("\n")}`;
		writeFile(dosiero, enhavo, eraro => {
			if (eraro != null) {
				malsukcesi(eraro);
			} else {
				sukcesi();
			}
		});
	});
}