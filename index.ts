//
import "dotenv/config";
import { updateTodo, deleteContainer, deleteTodo } from "./opretarions";

import { getContainers, getTodos, getUser } from "./resolvers/querys";
import { newContainer, newTodo, newUser } from "./resolvers/creations";

import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const typeDefs = readFileSync("./graphql/schema.graphql", {
	encoding: "utf-8",
});

export const TABLE_NAME = "todo";

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
		newTodo: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: {
				containtId: string;
				title: string;
				content: string;
				priority?: number;
			},
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			contextValue: any,
		) => {
			const pk = await newTodo(args);
			return pk;
		},
		deleteContainer: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: {
				userId: string;
				containerId: string;
			},
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			contextValue: any,
		) => {
			const pk = await deleteContainer({
				userId: args.userId,
				containerId: args.containerId,
			});
			return pk;
		},
		deleteTodo: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: {
				pk: string;
			},
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			contextValue: any,
		) => {
			const pk = await deleteTodo({
				todoId: args.pk,
			});
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
