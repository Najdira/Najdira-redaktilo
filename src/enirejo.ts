import { legiJSON } from "./legilo";
import { ĉefaMenuo } from "./menuoj";

async function enirejo() {
	const vortaro = await legiJSON(process.argv[2]);
	const elirejo = process.argv[3];
	console.log(`
██    ██ ████████       ██ ██████   ██████ ████████ ████████
████  ██ ██    ██       ██ ██    ██   ██   ██    ██ ██    ██
██  ████ ████████ ██    ██ ██    ██   ██   ████████ ████████
██    ██ ██    ██ ████████ ██████   ██████ ██  ██   ██    ██

████████ ████████ ██████   ████████ ██  ████ ████████ ██████ ██       ████████
██    ██ ██       ██    ██ ██    ██ ██████       ██     ██   ██       ██    ██
████████ ████     ██    ██ ████████ ██  ██       ██     ██   ██       ██    ██
██  ██   ████████ ██████   ██    ██ ██  ████     ██   ██████ ████████ ████████
`);
	await ĉefaMenuo(vortaro, elirejo);
}

enirejo();
