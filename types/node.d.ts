declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production";
		TESTING_SERVER_ID: string;
		CLIENT_ID: string;
		TOKEN: string;
		PREFIX: string;
	}
}
