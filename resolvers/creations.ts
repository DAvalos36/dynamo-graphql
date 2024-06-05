import type { PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../clientDynamo";
import { TABLE_NAME } from "..";
import {
	entityPrefix,
	type newTodo as INewTodo,
	type INewContainer,
} from "../types";
import shortUUID from "short-uuid";
import { hash } from "bcrypt";
import { addPrefix } from "../utils";

export async function newUser(username: string, password: string) {
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

export async function newContainer(data: INewContainer) {
	const uuid = shortUUID.generate();
	const sk = addPrefix({ id: uuid, prefix: entityPrefix.container });
	const date = Date.now();
	const input: PutCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: addPrefix({ prefix: entityPrefix.user, id: data.userId }),
			sk: sk,
			title: data.title,
			creationDate: date.toString(),
		},
	};

	const pi = new PutCommand(input);
	try {
		const r = await client.send(pi);
		console.log("Container creado correctamete", r);
		return uuid;
	} catch (error) {
		console.log("Ocurrio un error al crear un contenedor", error);
	}
}

export async function newTodo(data: INewTodo) {
	const uuid = shortUUID.generate();
	const pk = addPrefix({ id: uuid, prefix: entityPrefix.todo });
	const date = Date.now();
	const input: PutCommandInput = {
		TableName: TABLE_NAME,
		Item: {
			pk: pk,
			sk: pk,
			title: data.title,
			content: data.content,
			gs1_pk: addPrefix({
				prefix: entityPrefix.container,
				id: data.containtId,
			}),
			gs1_sk: pk,
			creationDate: date.toString(),
			priority: data.priority ? data.priority.toString() : "0",
		},
	};

	const pi = new PutCommand(input);

	try {
		const r = await client.send(pi);
		console.log("Tara (todo) creada corretamente", r);
		return uuid;
	} catch (error) {
		console.log("ERROR al crear tarea", error);
	}
}
