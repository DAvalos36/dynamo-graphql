import { SignJWT } from "jose";
import { env } from "node:process";

export async function createJwt(
	data: { username: string },
	textEncoder: TextEncoder,
) {
	const secret = textEncoder.encode(env.JWT_SECRET);
	const token = await new SignJWT(data) // details to  encode in the token
		.setProtectedHeader({ alg: "HS256" }) // algorithm
		.setIssuedAt()
		.setExpirationTime("1 day") // token expiration time, e.g., "1 day"
		.sign(secret); // secretKey generated from previous step
	return token;
}
