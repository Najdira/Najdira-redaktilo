import { legi } from "./legilo";
import { ĉefaMenuo } from "./menuoj";

async function enirejo() {
	const vortaro = await legi(process.argv[2]);
	console.log("Najdira redaktilo");
	await ĉefaMenuo(vortaro);
}

enirejo();