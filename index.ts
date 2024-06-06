//
import "dotenv/config";

import { getContainers, getTodos, getUser } from "./resolvers/querys";
import { newContainer, newTodo, newUser } from "./resolvers/creations";
import { deleteContainer, deleteTodo } from "./resolvers/deletes";

import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { graphql, GraphQLError } from "graphql";
import { jwtVerify } from "jose";
import { env } from "node:process";

const typeDefs = readFileSync("./graphql/schema.graphql", {
	encoding: "utf-8",
});

const textEncoder = new TextEncoder();

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
			if (contextValue.user === undefined) return null;
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
	const { url } = await startStandaloneServer(server, {
		context: async ({ req }) => {
			const token = req.headers.authorization || "";

			try {
				const e = await jwtVerify(token, textEncoder.encode(env.JWT_SECRET));
				console.log("JWT TODO BIEN", { e });
				return { user: e.payload };
			} catch (error) {
				return { user: undefined };
			}
		},
	});
}

main();
