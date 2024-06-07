//
import "dotenv/config";

import { getContainers, getTodos, getUser } from "./resolvers/querys";
import { newContainer, newTodo, newUser } from "./resolvers/creations";
import { deleteContainer, deleteTodo } from "./resolvers/deletes";

import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { jwtVerify } from "jose";
import { env } from "node:process";
import cors from "cors";

import express from "express";
import { GraphQLError } from "graphql";

const app = express();

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
	await server.start();

	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				try {
					let token = req.headers.authorization || "";
					token = token.split(" ")[1];
					const e = await jwtVerify(token, textEncoder.encode(env.JWT_SECRET));
					console.log(e.payload);
					return { user: e.payload };
				} catch (error) {
					throw new GraphQLError("User is not authenticated", {
						extensions: {
							code: "UNAUTHENTICATED",
							http: { status: 401 },
						},
					});
				}
			},
		}),
	);
}

main();

app.listen(3000, () => {
	console.log("Corriendo");
});
