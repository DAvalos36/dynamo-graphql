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
	pk: { S: string };
	sk: { S: string };
	password: { S: string };
	creationDate: { S: string };
}

export interface DynamoContainerResponse {
	pk: { S: string };
	sk: { S: string };
	creationDate: { S: string };
	title: { S: string };
}
