//
import "dotenv/config";
import { client } from "./clientDynamo";
import {
	newContainer,
	newUser,
	newTodo,
	getUser,
	getContainers,
	getTodos,
} from "./opretarions";

import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const typeDefs = readFileSync("./graphql/schema.graphql", {
	encoding: "utf-8",
});

const resolvers = {
	Query: {
		hello: () => {
			return "Hello word";
		},
		getContainers: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: { userId: string },
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			contextValue: any,
		) => {
			const r = await getContainers(args.userId);
			return r;
		},
		getTodos: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: { containerId: string },
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			contextValue: any,
		) => {
			console.log("Container id: ", args.containerId);
			const r = await getTodos(args.containerId);
			return r;
		},
	},

	Mutation: {
		newContainer: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: { userId: string; title: string },
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			contextValue: any,
		) => {
			const pk = await newContainer({ title: args.title, userId: args.userId });
			return pk;
		},
	},
};
const server = new ApolloServer({
	typeDefs,
	resolvers,
});
async function main() {
	const { url } = await startStandaloneServer(server);
}

main();
