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

function easyQuitPrefix(pk: string): string {
	if (pk.includes("#")) {
		return pk.split("#")[1];
	}
	return pk;
}

export function quitMultiplePrefix<T>({object,indexes}:{object: T, indexes: (keyof T)[]}){
	indexes.forEach((index) => {
		if (object[index] && typeof object[index] === "string") {
			object[index] = easyQuitPrefix(
				object[index] as unknown as string,
			) as unknown as T[keyof T];
		}
	});
}

export function arrayQuitPrefix<T>({
	arr,
	indexes,
}: { arr: T[]; indexes: (keyof T)[] }): T[] {
	return arr.map((item) => {
		const newItem = { ...item };
		indexes.forEach((index) => {
			if (newItem[index] && typeof newItem[index] === "string") {
				newItem[index] = easyQuitPrefix(
					newItem[index] as unknown as string,
				) as unknown as T[keyof T];
			}
		});
		return newItem;
	});
}
