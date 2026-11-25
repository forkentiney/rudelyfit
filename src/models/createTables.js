const { Client } = require('pg');

const createTables = `
CREATE TABLE IF NOT EXISTS user_data (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_name VARCHAR ( 255 ) NOT NULL UNIQUE,
	display_name VARCHAR ( 255 ),
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS program (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id INTEGER REFERENCES user_data (id),
	program_name VARCHAR ( 255 ) NOT NULL,
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS exercise (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	exercise_name VARCHAR ( 255 ) NOT NULL,
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS set (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id INTEGER REFERENCES user_data (id),
	program_id INTEGER REFERENCES program (id),
	exercise_id INTEGER REFERENCES exercise (id),
	weight INTEGER,
	reps INTEGER,
	duration INTEGER,
	distance INTEGER,
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS category (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	category_name VARCHAR ( 255 ) NOT NULL,
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS exercise_category (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	exercise_id INTEGER REFERENCES exercise (id),
	category_id INTEGER REFERENCES category (id),
	created DATE NOT NULL DEFAULT CURRENT_DATE,
	last_update DATE NOT NULL DEFAULT CURRENT_DATE
);
`;

const populateTables = `
INSERT INTO user_data (user_name, display_name)
VALUES ('default', 'Default');
`;

const host = process.env.DATABASE_URL;
const user = process.env.DATABASE_USER;
const database = process.env.DATABASE_NAME;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT;

async function main() {
	console.log("Creating tables if they don't exist...");
	const client = new Client({
		connectionString: `postgresql://${user}:${password}@${host}:${port}/${database}`,
	});
	await client.connect();
	await client.query(createTables);
	console.log("Tables created.");
	console.log("Populating tables if empty...");
	const { response } = client.query(`SELECT * FROM user_data;`);
	if (!response) {
		await client.query(populateTables)
		await client.end();
		console.log("Tables populated with new data.");
	} else {
		await client.end();
		console.log("Tables already populated with data. Nothing changed.");
	};
};

main();
