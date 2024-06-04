import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "..";
import { client } from "../clientDynamo";
import type { IUpdateContainer, IUpdateTodo } from "../types";

export async function updateContainer(data: IUpdateContainer) {
	const upD = new UpdateCommand({
		TableName: TABLE_NAME,
		Key: {
			pk: data.reqUserId,
			sk: data.reqSk,
		},
		UpdateExpression: "set titlte = :title",
		ExpressionAttributeValues: {
			":title": data.title,
		},
		ReturnValues: "ALL_NEW",
	});

	try {
		const r = await client.send(upD);
		console.log(r);
		return r;
	} catch (error) {
		console.log("Hubo un error al actualizar container", error);
	}
}
export async function updateTodo(data: IUpdateTodo) {
	const expressionAttributes: { [key: string]: string | number } = {};
	const updateExpressions = [];

	for (const [key, value] of Object.entries(data)) {
		if (key !== "reqPk") {
			expressionAttributes[`:${key}`] = value;
			updateExpressions.push(`${key} = :${key}`);
		}
	}

	const upD = new UpdateCommand({
		TableName: TABLE_NAME,
		Key: {
			pk: data.reqPk,
			sk: data.reqPk,
		},
		UpdateExpression: `SET ${updateExpressions.join(", ")}`,
		ExpressionAttributeValues: expressionAttributes,
		ReturnValues: "ALL_NEW",
	});

	try {
		const r = await client.send(upD);
		console.log(r);
		return r;
	} catch (error) {
		console.log("Hubo un error al actualizar todo", error);
	}
}
