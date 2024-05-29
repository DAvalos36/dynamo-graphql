import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "node:process";

const clientLow = new DynamoDB({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_PUBLIC_KEY as string,
		secretAccessKey: env.AWS_SECRET_KEY as string,
	},
});

export const client = DynamoDBDocumentClient.from(clientLow);
