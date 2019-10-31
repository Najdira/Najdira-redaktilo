import { RecordOf, List } from 'immutable';

import { Vortaro, Signifo, Vorto } from '../vortaro';
import { Petilo } from '.';

export async function troviVortojn(vortaro: RecordOf<Vortaro>, petilo: Petilo): Promise<RecordOf<Vorto>[]> {
	const signifo = await petilo.petiSignifon(vortaro);
	return Array.from(
		vortaro.vortoj.filter(vorto => {
			const s = vortaro.signifoj.get(vorto.signifo);
			return s != null && s.signifo.indexOf(signifo) >= 0;
		}).values()
	);
}