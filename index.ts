//
import "dotenv/config";

import { getContainers, getTodos, getUser } from "./resolvers/querys";
import { newContainer, newTodo, newUser } from "./resolvers/creations";
import { deleteContainer, deleteTodo } from "./resolvers/deletes";

import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { jwtVerify, SignJWT } from "jose";
import { env } from "node:process";
import cors from "cors";
import bcrypt from "bcrypt";

import express from "express";
import { graphql, GraphQLError, parse } from "graphql";

import type { DynamoUserResponse } from "./types";
import { createJwt } from "./createJwt";

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
		) => {
			const r = await getContainers(args.userId);
			return r;
		},
		getTodos: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: { containerId: string },
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
		) => {
			const pk = await deleteTodo({
				todoId: args.pk,
			});
			return pk;
		},
		login: async (
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			_: any,
			args: {
				username: string;
				password: string;
			},
		) => {
			try {
				const u = (await getUser(args.username)) as unknown as
					| DynamoUserResponse
					| undefined;
				if (u === undefined) {
					throw GraphQLError;
				}
				const pc = bcrypt.compare(args.password, u.password);
				if (u === undefined) {
					throw GraphQLError;
				}
				return await createJwt({ username: u.pk }, textEncoder);
			} catch (error) {}
		},
	},
};
const server = new ApolloServer({
	typeDefs,
	resolvers,
});
async function startGraphQL() {
	await server.start();

	app.use(
		"/graphql",
		cors<cors.CorsRequest>(),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const parsedQuery = parse(req.body.query);
				const operationName =
					//@ts-expect-error
					parsedQuery.definitions[0].selectionSet.selections[0].name.value;

				if (["login", "signin", "__schema"].includes(operationName)) return {};
				try {
					let token = req.headers.authorization || "";
					token = token.split(" ")[1];
					const e = await jwtVerify(token, textEncoder.encode(env.JWT_SECRET));
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

startGraphQL();

app.listen(3000, () => {
	console.log("Corriendo");
});
