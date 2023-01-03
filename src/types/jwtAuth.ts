//Content of JWT token
export type JwtPayload = {
	//Internal user ID
	sub: string;

	//JWT issue at
	iat?: number;

	//Expiration time
	exp?: number;

	displayName: string;

    username: string;

	photo?: string;
};