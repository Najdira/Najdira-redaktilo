import {Signifo, Vortaro, Vorto} from "../vortaro";
import { assert } from "chai";
import {List, Map, RecordOf} from "immutable";
import {kreiLigojn} from "./kreiLigojn";
import {kreiTestanPetilon} from "./testiloj";

describe("La funkcio \"kreiLigojn\"", function() {
	it("aldonas S-V-ligojn al vorto, kiu ne havas neniun", async function() {
		const testSignifo = Signifo({
			signifo: "lumo",
			tipo: "substantivo",
			ecoj: 116,
		});
		const testVorto = Vorto({
			vorto: "luma",
			signifo: 0,
		});
		const testVortaro = Vortaro({
			signifoj: List<RecordOf<Signifo>>([
				testSignifo,
				Signifo({
					signifo: "N esti azura",
					tipo: "verbo",
					ecoj: 1
				}),
			]).toOrderedMap(),
			vortoj: List<RecordOf<Vorto>>([testVorto]).toOrderedMap(),
			signifoIndekso: Map({
				lumo: 0
			}),
			vortoIndekso: Map({
				luma: 0
			}),
		});
		const petilo = kreiTestanPetilon({
			ecoj: 0b1,
			svligoj: [1],
		});

		const novaVortaro = await kreiLigojn(testSignifo, testVortaro, petilo);
		const novaSignifo = novaVortaro.signifoj.get(0);
		if (novaSignifo == null) {
			throw "???";
		}
		assert.equal(novaSignifo.svligoj.size, 1);

		const novaLigo = novaSignifo.svligoj.get(1);
		if (novaLigo == null) {
			throw "???";
		}

		assert.equal(novaLigo, 1);
	});
});
