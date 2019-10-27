import { assert } from 'chai';
import { Map, List, RecordOf } from 'immutable';
import 'mocha';

import { Vortaro, Signifo, Vorto } from '../vortaro';
import { aldoniVorton } from './krei';

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
});

describe('Krei', function() {
	it('aldonas vorton kun ekzistanta signifo en vortaron', function() {
		let novaVorto = Vorto({
			vorto: "silimana",
			signifo: 0,
		});
		let novaVortaro = aldoniVorton(testVortaro, novaVorto);
		assert.equal(novaVortaro.vortoj.size, 2);
	});
});