
export interface ISignup {
	name : string;
	email : string;
	passwords : {
		password : string;
		passwordConfirm : string;
	};
}

export interface ILogin {
	login : string;
	password : string;
}

export interface IReset {
	email : string;
}

export interface IRAuth {
	token ?: string;
}

/* User Service */
export interface IUser {
	_id : string;
	nickname : string;
	email : string;
	created_at : string;
}
export interface IRUser {
	user : IUser;
}
