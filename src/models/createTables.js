#! /usr/bin/env node

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
	equipment VARCHAR ( 255 ),
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
	speed INTEGER,
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
	category_id INTEGER REFERENCES category (id)
);
`;

const populateTables = `
INSERT INTO user_data (user_name, display_name)
VALUES ('default', 'Default');

INSERT INTO exercise (exercise_name)
VALUES 
	('Shoulder External Rotation'), 
	('Flat Dumbbell Bench Press'), 
	('Dumbbell Row'), 
	('Lateral Dumbbell Raise'), 
	('Lat Pulldown'), 
	('Cable Push Down (single arm)'), 
	('Dumbbell Curl'), 
	('Inclined Treadmill'), 
	('Romanian Deadlift'), 
	('Barbell Squat'), 
	('Bulgarian Split Squat'), 
	('Single-leg Hip Thrusts'), 
	('Standing Calf Raise');

INSERT INTO category (category_name)
VALUES 
	('Shoulders'),
	('Chest'),
	('Back'),
	('Triceps'),
	('Biceps'),
	('Cardio'),
	('Legs'),
	('Core');

INSERT INTO program (user_id, program_name)
VALUES
	(1, 'Upper'),
	(1, 'Lower');

INSERT INTO set (user_id, program_id, exercise_id)
VALUES
	(1, 1, 1), (1, 1, 2), (1, 1, 3), (1, 1, 4), (1, 1, 5), (1, 1, 6), (1, 1, 7),
	(1, 2, 9), (1, 2, 10), (1, 2, 11), (1, 2, 12), (1, 2, 13);

INSERT INTO exercise_category (exercise_id, category_id)
VALUES
	(1, 1),
	(1, 3),
	(2, 2),
	(2, 4),
	(3, 3),
	(3, 5),
	(4, 1),
	(5, 3),
	(5, 5),
	(6, 4),
	(7, 5),
	(8, 6),
	(9, 3),
	(9, 7),
	(10, 7),
	(10, 3),
	(11, 7),
	(12, 7),
	(13, 7);
`;

const host = process.env.DATABASE_URL;
const user = process.env.DATABASE_USER;
const database = process.env.DATABASE_NAME;
const password = process.env.DATABASE_PASSWORD;
const port = process.env.DATABASE_PORT;

async function main() {
	const client = new Client({
		connectionString: `postgresql://${user}:${password}@${host}:${port}/${database}`,
	});
	console.log("Creating tables if they don't exist...");
	await client.connect();
	await client.query(createTables);
	console.log("Tables created.");
	console.log("Populating tables if empty...");
	const { rows } = await client.query('SELECT * FROM user_data;');
	if (rows.length === 0) {
		await client.query(populateTables)
		await client.end();
		console.log("Tables populated with new data.");
	} else {
		await client.end();
		console.log("Tables already populated with data. Nothing changed.");
	};
};

main();
