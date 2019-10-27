import { legi } from "./legilo";
import { ĉefaMenuo } from "./menuoj";
import { petilo } from "./agoj";

async function enirejo() {
	const vortaro = await legi(process.argv[2]);
	console.log("Najdira redaktilo");
	await ĉefaMenuo(vortaro, petilo);
}

enirejo();