import { DeleteCommand, type DeleteCommandInput } from "@aws-sdk/lib-dynamodb";
import { TABLE_NAME } from "..";
import { entityPrefix, type DeleteContainer, type DeleteTodo } from "../types";
import { client } from "../clientDynamo";
import { addPrefix } from "../utils";

export async function deleteContainer(data: DeleteContainer) {
	const input: DeleteCommandInput = {
		TableName: TABLE_NAME,
		Key: {
			pk: addPrefix({ prefix: entityPrefix.user, id: data.userId }),
			sk: addPrefix({ prefix: entityPrefix.container, id: data.containerId }),
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
			pk: addPrefix({ prefix: entityPrefix.todo, id: data.todoId }),
			sk: addPrefix({ prefix: entityPrefix.todo, id: data.todoId }),
		},
	};
	const dd = new DeleteCommand(input);
	const r = await client.send(dd);
	console.log(r);
}
