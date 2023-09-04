export interface AuthResponse {
	body: {
		user: User;
		accessToken: string;
		refreshToken: string;
	};
}

export interface AuthResponseError {
	body: {
		error: string;
	};
}

export interface User {
	_id: string;
	name: string;
	user: string;
}

export interface accessTokenResponse {
	statusCode: string;
	body: {
        accessToken: string
    };
	error?: string;
}
