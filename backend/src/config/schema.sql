DROP TABLE IF EXISTS workout;
DROP TABLE IF EXISTS users;

CREATE TABLE users ( 
		     id 		SERIAL PRIMARY KEY, 
		     name 		VARCHAR(100) NOT NULL,
		     email	 	VARCHAR(100) NOT NULL UNIQUE,	
		     password_hash      VARCHAR(255) NOT NULL,
		     role 		VARCHAR(20) NOT NULL DEFAULT 'member',
		     height_cm 		INTEGER,
		     weight_kg		DECIMAL(5 , 2),
		     trainer_id		INTEGER REFERENCES users(id) ON DELETE SET NULL,
		     created_at		TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		   );


CREATE TABLE workouts (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			name VARCHAR(100) NOT NULL,
			exercises JSONB,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		      );

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
