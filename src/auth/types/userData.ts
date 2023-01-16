//User Data for Tokens 
export interface UserData {
	//Our internal user ID 
	id: number;

	//github ID
	githubId: string;

	//github username
	username: string;

	//github name
	displayName: string;

	//Profile Picture URL 
	photo: { value: string };

	//access token of user
	githubaccessToken: string;
}
