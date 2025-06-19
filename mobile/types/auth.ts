export type gender = 'male' | 'female' | 'others' | 'prefer not to say';

export interface User {
	id?: string;
	first_name: string;
	last_name?: string;
	username: string;
	email: string;
	dob?: Date;
	gender?: gender;
	joined_at?: Date;
}
