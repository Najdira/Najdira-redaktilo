import { Petilo } from ".";

export function kreiTestanPetilon(signifo: string, vorto: string, radikojn: string[]): Petilo {
	return {
		petiSignifon(vortaro) {
			return Promise.resolve(signifo);
		},
		petiVorton() {
			return Promise.resolve(vorto);
		},
		petiRadikojn(vortaro) {
			return Promise.resolve(radikojn);
		}
	}
}