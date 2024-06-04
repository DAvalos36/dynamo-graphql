import { DeleteCommand, type DeleteCommandInput } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "..";
import type { DeleteContainer, DeleteTodo } from "../types";
import { client } from "../clientDynamo";

export async function deleteContainer(data: DeleteContainer) {
	console.log({ data });
	const input: DeleteCommandInput = {
		TableName: TABLE_NAME,
		Key: {
			pk: data.userId,
			sk: data.containerId,
		},
	};
	const dd = new DeleteCommand(input);
	try {
		const r = await client.send(dd);
		console.log(r);
		return "Ok";
	} catch (error) {
		console.log("Errpr al eliminar container", error);
	}
}
export async function deleteTodo(data: DeleteTodo) {
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
