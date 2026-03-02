import React, { createContext, useContext } from 'react';

interface FeatureFlags {
    enableCouplesQuiz: boolean;
    enableAI: boolean;
}

const defaultFlags: FeatureFlags = {
    enableCouplesQuiz: import.meta.env.VITE_ENABLE_COUPLES_QUIZ === 'true',
    enableAI: import.meta.env.VITE_ENABLE_AI === 'true',
};

const FeatureToggleContext = createContext<FeatureFlags>(defaultFlags);

export const FeatureToggleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <FeatureToggleContext.Provider value={defaultFlags}>
            {children}
        </FeatureToggleContext.Provider>
    );
};

export const useFeatureToggle = () => useContext(FeatureToggleContext);
