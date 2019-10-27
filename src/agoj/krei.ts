import { RecordOf } from 'immutable';

import { Vortaro, Signifo, Vorto } from '../vortaro';

export function aldoniVorton(
	vortaro: RecordOf<Vortaro>,
	vorto: RecordOf<Vorto>,
): RecordOf<Vortaro> {
	const signifo = vortaro.signifoj.get(vorto.signifo);
	if (signifo == null) {
		throw Error(`La signifo de ${vorto.vorto} ne ekzistas`);
	}
	return vortaro.set("vortoj", vortaro.vortoj.set(vortaro.vortoj.size, vorto));
}