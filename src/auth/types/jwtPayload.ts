//Content of JWT token
export type JwtPayload = {
	//Internal user ID
	sub: number;

	//JWT issue at
	iat?: number;

	//Expiration time
	exp?: number;

	displayName?: string;

	githubId: string;

	username: string;

	photo?: string;
};