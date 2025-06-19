import { createContext, useContext, useState } from 'react';

import type { Message, Conversation } from '@/types/coach';

interface ChatContextType {
	allConvs: Conversation[];
	currentConv: Conversation | null;
	messages: Message[]; // for current conversation

	setAllConvs: React.Dispatch<React.SetStateAction<Conversation[]>>;
	setCurrentConv: React.Dispatch<React.SetStateAction<Conversation | null>>;
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
	const [allConvs, setAllConvs] = useState<Conversation[]>([]);
	const [currentConv, setCurrentConv] = useState<Conversation | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	return (
		<ChatContext.Provider
			value={{
				allConvs,
				currentConv,
				messages,
				setAllConvs,
				setCurrentConv,
				setMessages
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error('useChat must be used within ChatContext');
	}

	return context;
};
