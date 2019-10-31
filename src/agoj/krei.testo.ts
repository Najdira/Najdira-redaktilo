import { assert } from 'chai';
import { Map, List, RecordOf } from 'immutable';
import 'mocha';

import { Vortaro, Signifo, Vorto } from '../vortaro';
import { aldoniVorton, kreiVorton } from './krei';
import { Petilo } from '.';
import { kreiTestanPetilon } from "./testiloj";

const testVortaro = Vortaro({
	signifoj: List<RecordOf<Signifo>>([
		Signifo({
			signifo: "lumo",
			tipo: "substantivo",
			ecoj: 116,
		})
	]).toOrderedMap(),
	vortoj: List<RecordOf<Vorto>>([
		Vorto({
			vorto: 'luma',
			signifo: 0,
		})
	]).toOrderedMap(),
	signifoIndekso: Map({
		lumo: 0
	}),
	vortoIndekso: Map({
		luma: 0
	}),
});

describe('La funkcio "aldoniVorton"', function() {
	it('aldonas vorton kun ekzistanta signifo en vortaron', function() {
		let novaVorto = Vorto({
			vorto: "silimana",
			signifo: 0,
		});
		let novaVortaro = aldoniVorton(testVortaro, novaVorto);
		assert.equal(novaVortaro.vortoj.size, 2);
		assert.equal(novaVortaro.vortoIndekso.size, 2);
		assert.equal(novaVortaro.signifoIndekso.size, 1);
	});
});

describe('La funkcio "kreiVorton"', function() {
	it('kreas novan vorton kun ekzistanta signifon', async function() {
		const testaPetilo = kreiTestanPetilon("lumo", "silimana", []);
		const {signifo, vorto} = await kreiVorton(testVortaro, testaPetilo, () => {});
		assert.notExists(signifo);
		assert.equal(vorto.vorto, "silimana");
	})
});