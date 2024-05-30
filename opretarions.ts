import {
	GetCommand,
	GetCommandInput,
	PutCommand,
	PutCommandInput,
	QueryCommand,
	QueryCommandInput,
	DeleteCommand,
	DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { hash } from "bcrypt";
import shortUUID from "short-uuid";

import { client } from "./clientDynamo";
import {
	INewContainer,
	entityPrefix,
	newTodo as INewTodo,
	DynamoUserResponse,
	DynamoContainerResponse,
	DeleteContainer,
	DeleteTodo,
} from "./types";
import { table } from "node:console";

const TABLE_NAME = "todo";

async function newUser(username: string, password: string) {
	const ha = await hash(password, 10);
	const date = Date.now();
	const usname = `${entityPrefix.user}${username}`;

	const input: PutCommandInput = {
		TableName: TABLE_NAME,
		ConditionExpression: "attribute_not_exists(pk)",
		ReturnValuesOnConditionCheckFailure: "ALL_OLD",
		Item: {
			pk: usname,
			sk: "user",
			password: ha,
			creationDate: date.toString(),
		},
	};

	const putIdk = new PutCommand(input);

	try {
		const r = await client.send(putIdk);
		console.log("USUARIO REGISTRADO", r);
	} catch (error) {
		console.log("ERROR", error);
	}
}

async function newContainer(data: INewContainer) {
	const sk = `${entityPrefix.container}${shortUUID.generate()}`;
	const date = Date.now();
	const input: PutCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: data.userId.startsWith("u#") ? data.userId : `u#${data.userId}`, //Quitar esto
			sk: sk,
			title: data.title,
			creationDate: date.toString(),
		},
	};

	const pi = new PutCommand(input);
	try {
		const r = await client.send(pi);
		console.log("Container creado correctamete", r);
		return sk;
	} catch (error) {
		console.log("Ocurrio un error al crear un contenedor", error);
	}
}

async function newTodo(data: INewTodo) {
	const pk = `${entityPrefix.todo}${shortUUID.generate()}`;
	const date = Date.now();
	const input: PutCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: pk,
			sk: pk,
			title: data.title,
			content: data.content,
			gs1_pk: data.containtId.startsWith("#c")
				? data.containtId
				: `#c${data.containtId}`,
			gs1_sk: pk,
			creationDate: date.toString(),
			priority: data.priority ? data.priority.toString() : "0",
		},
	};

	const pi = new PutCommand(input);

	try {
		const r = await client.send(pi);
		console.log("Tara (todo) creada corretamente", r);
		return pk;
	} catch (error) {
		console.log("ERROR al crear tarea", error);
	}
}

async function getUser(username: string) {
	const pk = `${entityPrefix.user}${username}`;
	const input: GetCommandInput = {
		TableName: TABLE_NAME,
		Key: {
			pk: pk,
			sk: "user",
		},
	};
	const gtIt = new GetCommand(input);

	try {
		const r = await client.send(gtIt);
		const info = r.Item as unknown as DynamoUserResponse;
		console.log("User info", info);
	} catch (error) {
		console.log("Error", error);
	}
}

async function getContainers(username: string) {
	const pk = `${entityPrefix.user}${username}`;
	const input: QueryCommandInput = {
		TableName: TABLE_NAME,
		KeyConditionExpression: "pk = :pk AND begins_with(sk, :prefix)",
		ExpressionAttributeValues: {
			":pk": pk, //Aqui se asigna el valor de pk (el que actualmente se encuentra en la constante)
			":prefix": entityPrefix.container,
		},
	};
	const qC = new QueryCommand(input);

	try {
		const r = await client.send(qC);
		console.log("Query response", r.Items);
		return r.Items;
	} catch (error) {
		console.log("Ocurrio un error al intentar query", error);
	}
}

async function getTodos(containtId: string) {
	const pk = `${entityPrefix.container}${containtId}`;
	const input: QueryCommandInput = {
		TableName: TABLE_NAME,
		IndexName: "gsi-todo",
		KeyConditionExpression: "gs1_pk = :gs1_pk ",
		ExpressionAttributeValues: {
			":gs1_pk": pk, //Aqui se asigna el valor de pk (el que actualmente se encuentra en la constante)
		},
	};
	const qC = new QueryCommand(input);

	try {
		const r = await client.send(qC);
		return r.Items;
	} catch (error) {
		console.log("Ocurrio un error al intentar query", error);
	}
}

async function deleteContainer(data: DeleteContainer) {
	const input: DeleteCommandInput = {
		TableName: TABLE_NAME,
		Key: {
			pk: data.userId,
			sk: data.containerId,
		},
	};
	const dd = new DeleteCommand(input);
	const r = await client.send(dd);
	console.log(r);
}
async function deleteTodo(data: DeleteTodo) {
	const input: DeleteCommandInput = {
		TableName: TABLE_NAME,
		Key: {
			pk: data.todoId,
			sk: data.todoId,
		},
	};
	const dd = new DeleteCommand(input);
	const r = await client.send(dd);
	console.log(r);
}

export {
	newUser,
	newContainer,
	newTodo,
	getUser,
	getContainers,
	getTodos,
	deleteContainer,
	deleteTodo,
};
