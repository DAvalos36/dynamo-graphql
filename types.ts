export interface INewContainer {
	userId: string;
	title: string;
}

export interface newTodo {
	containtId: string;
	title: string;
	content: string;
	priority?: number;
}

export enum entityPrefix {
	user = "u#",
	container = "c#",
	todo = "t#",
}
