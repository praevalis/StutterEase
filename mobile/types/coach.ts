export type messageSource = 'USER' | 'BOT';

export interface Scenario {
	id?: string;
	title: string;
	description: string;
}

export interface Message {
	id?: string;
	source: messageSource;
	conversation_id: string;
	content: string;
	sent_at?: Date;
}

export interface Conversation {
	id?: string;
	user_id: string;
	scenario_id?: string;
	created_at?: Date;
	updated_at?: Date;
}
