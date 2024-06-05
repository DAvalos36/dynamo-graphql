import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "..";
import { client } from "../clientDynamo";
import type {
	DynamoContainerResponse,
	DynamoTodoResponse,
	IUpdateContainer,
	IUpdateTodo,
} from "../types";
import { entityPrefix } from "../types";
import { addPrefix, quitMultiplePrefix } from "../utils";

export async function updateContainer(data: IUpdateContainer) {
	const upD = new UpdateCommand({
		TableName: TABLE_NAME,
		Key: {
			pk: data.reqUserId,
			sk: addPrefix({ prefix: entityPrefix.container, id: data.reqSk }),
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
		return quitMultiplePrefix({
			object: r.Attributes as DynamoContainerResponse,
			indexes: ["pk", "sk"],
		});
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
			pk: addPrefix({ prefix: entityPrefix.todo, id: data.reqPk }),
			sk: addPrefix({ prefix: entityPrefix.todo, id: data.reqPk }),
		},
		UpdateExpression: `SET ${updateExpressions.join(", ")}`,
		ExpressionAttributeValues: expressionAttributes,
		ReturnValues: "ALL_NEW",
	});

	try {
		const r = await client.send(upD);
		console.log(r);
		return quitMultiplePrefix({
			object: r.Attributes as DynamoTodoResponse,
			indexes: ["gs1_pk", "gs1_sk", "pk", "sk"],
		});
	} catch (error) {
		console.log("Hubo un error al actualizar todo", error);
	}
}
