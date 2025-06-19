import { createContext, useContext, useState } from 'react';

import type { User } from '@/types/auth';

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	authenticated: boolean;
	setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [authenticated, setAuthenticated] = useState<boolean>(false);

	return (
		<AuthContext.Provider
			value={{ user, setUser, authenticated, setAuthenticated }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth can only be used inside AuthProvider.');
	}

	return context;
};
