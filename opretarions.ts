import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { hash } from "bcrypt";
import shortUUID from "short-uuid";

import { client } from "./clientDynamo";
import { INewContainer, entityPrefix, newTodo as INewTodo } from "./types";

const TABLE_NAME = "todo";

async function newUser(username: string, password: string) {
	const ha = await hash(password, 10);
	const date = Date.now();
	const usname = `${entityPrefix.user}${username}`;

	const input: PutItemCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: {
				S: usname,
			},
			sk: {
				S: "user",
			},
			password: {
				S: ha,
			},
			creationDate: {
				S: date.toString(),
			},
		},
	};

	const putIdk = new PutItemCommand(input);

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
	const input: PutItemCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: {
				S: data.userId,
			},
			sk: {
				S: sk,
			},
			title: {
				S: data.title,
			},
			creationDate: {
				S: date.toString(),
			},
		},
	};

	const pi = new PutItemCommand(input);
	try {
		const r = await client.send(pi);
		console.log("Container creado correctamete", r);
	} catch (error) {
		console.log("Ocurrio un error al crear un contenedor", error);
	}
}

async function newTodo(data: INewTodo) {
	const pk = `${entityPrefix.todo}${shortUUID.generate()}`;
	const date = Date.now();
	const input: PutItemCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: {
				S: pk,
			},
			sk: {
				S: pk,
			},
			title: {
				S: data.title,
			},
			content: {
				S: data.content,
			},
			gs1_pk: {
				S: data.containtId,
			},
			gs1_sk: {
				S: pk,
			},
			creationDate: {
				S: date.toString(),
			},
			priority: {
				N: data.priority ? data.priority.toString() : "0",
			},
		},
	};

	const pi = new PutItemCommand(input);

	try {
		const r = await client.send(pi);
		console.log("Tara (todo) creada corretamente", r);
	} catch (error) {
		console.log("ERROR al crear tarea", error);
	}
}

export { newUser, newContainer, newTodo };
