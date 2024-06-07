import type { GetCommandInput, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "../clientDynamo";
import { TABLE_NAME } from "..";
import {
	DynamoContainerResponse,
	entityPrefix,
	type DynamoTodoResponse,
	type DynamoUserResponse,
} from "../types";
import { addPrefix, arrayQuitPrefix, quitPrefix } from "../utils";

export async function getUser(username: string) {
	const pk = addPrefix({ prefix: entityPrefix.user, id: username });
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
		return info
	} catch (error) {
		console.log("Error", error);
	}
}

export async function getContainers(username: string) {
	const pk = addPrefix({ prefix: entityPrefix.user, id: username });
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
		return arrayQuitPrefix({arr: r.Items as DynamoContainerResponse[], indexes: ["pk", "sk"]});
	} catch (error) {
		console.log("Ocurrio un error al intentar query", error);
	}
}

export async function getTodos(containtId: string) {
	const pk = addPrefix({ prefix: entityPrefix.container, id: containtId });
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
		return arrayQuitPrefix({
			arr: r.Items as DynamoTodoResponse[],
			indexes: ["pk", "sk", "gs1_pk", "gs1_sk"],
		});
	} catch (error) {
		console.log("Ocurrio un error al intentar query", error);
	}
}
