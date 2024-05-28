import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { env } from "process";

export const client = new DynamoDB({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_PUBLIC_KEY as string,
		secretAccessKey: env.AWS_SECRET_KEY as string,
	},
});
