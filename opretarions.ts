import { PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { client } from "./clientDynamo";
import { hash } from "bcrypt";

const TABLE_NAME = "todo";

async function newUser(username: string, password: string) {
	const ha = await hash(password, 10);
	const date = Date.now();
	const usname = `u#${username}`;

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

export { newUser };
