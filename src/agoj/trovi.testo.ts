import { assert } from 'chai';
import { Map, List, RecordOf } from 'immutable';
import 'mocha';

import { Vortaro, Signifo, Vorto } from '../vortaro';
import { kreiTestanPetilon } from "./testiloj";
import { troviVortojn } from "./trovi";

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

describe('La funkcio "troviVortojn"', function() {
	it('trovas unu vorto per signifo', async function() {
		const testPetilo = kreiTestanPetilon("lumo", "luma", []);
		const rezulto = await troviVortojn(testVortaro, testPetilo);
		assert.equal(1, rezulto.length);
		assert.equal("luma", rezulto[0].vorto);
	});
});