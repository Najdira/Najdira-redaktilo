import { legi, legiJSON } from "./legilo";
import { ĉefaMenuo } from "./menuoj";
import { petilo } from "./agoj";

async function enirejo() {
	const vortaro = await legiJSON(process.argv[2]);
	const elirejo = process.argv[3];
	console.log("Najdira redaktilo");
	await ĉefaMenuo(vortaro, petilo, elirejo);
}

enirejo();