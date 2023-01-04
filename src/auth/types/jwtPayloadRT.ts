import { JwtPayload } from "./jwtPayload";

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };