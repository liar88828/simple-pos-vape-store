import 'server-only';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { SESSION, UserPayload } from "@/interface/actionType";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-access");
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "your-secret-key-secret");

/**
 * Signs a JWT access token with a given payload and expiration time.
 * @param payload Object containing the payload claims
 * @param expiresIn Expiration string, e.g. '15m', '7d'. Defaults to 15 minutes.
 * @returns Signed JWT string
 */
export async function signJwt(payload: UserPayload, expiresIn: string = "15m"): Promise<string> {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

/**
 * Signs a JWT refresh token with a given payload and expiration time.
 * @param payload Object containing the payload claims
 * @param expiresIn Expiration string, e.g. '7d'. Defaults to 7 days.
 * @returns Signed JWT string
 */
export async function signRefreshJwt(payload: { userId: string }, expiresIn: string = "7d"): Promise<string> {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_REFRESH_SECRET);
}

export async function verifyJwt(token: string): Promise<SESSION | null>
// : Promise<(JWTPayload & { userId: number }) | null>
{
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            algorithms: [ 'HS256' ],
        });

        // if (typeof payload.userId === "string") {
        return payload as SESSION
        // }

        // console.warn("JWT payload does not contain a valid userId.");
        // return null;
    } catch (error) {
        console.error("Failed to verify JWT:", error);
        return null;
    }
}

export async function verifyRefreshJwt(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET, {
            algorithms: [ 'HS256' ],
        });
        return payload as JWTPayload & { userId: string, };
    } catch (error) {
        console.log('Failed to verify refresh JWT:', error);
        return null;
    }
}