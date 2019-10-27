import { RecordOf, List } from 'immutable';

import { Vortaro, Signifo, Vorto } from '../vortaro';
import { Petilo } from '.';

export function aldoniVorton(
	vortaro: RecordOf<Vortaro>,
	vorto: RecordOf<Vorto>,
): RecordOf<Vortaro> {
	const signifo = vortaro.signifoj.get(vorto.signifo);
	if (signifo == null) {
		throw Error(`La signifo de ${vorto.vorto} ne ekzistas`);
	}
	const novaVortoj = vortaro.vortoj.set(vortaro.vortoj.size, vorto);
	const novaIndekso = vortaro.vortoIndekso.set(vorto.vorto, vortaro.vortoj.size);
	return vortaro.set("vortoj", novaVortoj).set("vortoIndekso", novaIndekso);
}

export async function kreiVorton(vortaro: RecordOf<Vortaro>, petilo: Petilo, elirilo: (m: string) => void): Promise<{
	signifo?: RecordOf<Signifo>,
	vorto: RecordOf<Vorto>,
}> {
	const signifo = await petilo.petiSignifon(vortaro);
	const signifoIndekso = vortaro.signifoIndekso.get(signifo);
	if (signifoIndekso != null) {
		elirilo("Ĉi tiu signifo jam ekzistas. Jen la vortoj:");
		for (let vorto of vortaro.vortoj
			.filter(v => v.signifo === vortaro.signifoIndekso.get(signifo)).valueSeq()) {
			elirilo(vorto.vorto);
		}
		const vorto = await petilo.petiVorton();
		if (vortaro.vortoIndekso.has(vorto)) {
			throw `La vorto ${vorto} jam ekzistas`;
		}
		const radikoj = await petilo.petiRadikojn(vortaro);
		return {
			vorto: Vorto({
				vorto,
				signifo: signifoIndekso,
				radikoj: List(radikoj.map(r => vortaro.vortoIndekso.get(r) as number))
			})
		}
	} else {
		elirilo("Vi kreos novan signifon.");
		const vorto = await petilo.petiVorton();
	}
	throw "123";
}