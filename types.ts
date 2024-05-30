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
export interface DynamoUserResponse {
	pk: string;
	sk: string;
	password: string;
	creationDate: string;
}

export interface DynamoContainerResponse {
	pk: string;
	sk: string;
	creationDate: string;
	title: string;
}

export interface DynamoTodoResponse {
	pk: string;
	sk: string;
	creationDate: string;
	title: string;
	content: string;
	priority: string;
	gs1_pk: string;
	gs1_sk: string;
}

export interface DeleteContainer {
	userId: string;
	containerId: string;
}
export interface DeleteTodo {
	todoId: string;
}
