import { createContext, useContext, useState } from 'react';

import type { Scenario } from '@/types/coach';

interface ScenarioContextType {
	scenarios: Scenario[];
	setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(
	undefined
);

export const ScenarioProvider = ({
	children
}: {
	children: React.ReactNode;
}) => {
	const [scenarios, setScenarios] = useState<Scenario[]>([]);

	return (
		<ScenarioContext.Provider value={{ scenarios, setScenarios }}>
			{children}
		</ScenarioContext.Provider>
	);
};

export const useScenario = () => {
	const context = useContext(ScenarioContext);
	if (!context) {
		throw new Error(
			'useScenario must be used inside ScenarioProvider only.'
		);
	}

	return context;
};
