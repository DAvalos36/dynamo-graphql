import { entityPrefix } from "./types";

export function addPrefix({
	prefix,
	id,
}: { prefix: entityPrefix; id: string }) {
	return `${prefix}${id}`;
}

export function quitPrefix({
	prefix,
	id,
}: { prefix: entityPrefix; id: string }) {
	if (id.startsWith(prefix)) {
		return id.slice(prefix.length);
	}

	return id;
}
