import React, { createContext, useContext, useState, ReactNode } from 'react';

type MyContextType = {
  storyIntroduction: string;
  updateStoryIntroduction: (newIntroduction: string) => void;
};

const MyContext = createContext<MyContextType | undefined>(undefined);

export function useMyContext(): MyContextType {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyContextProvider');
  }
  return context;
}

type MyContextProviderProps = {
  children: ReactNode;
};

export function MyContextProvider({
  children,
}: MyContextProviderProps): JSX.Element {
  const [storyIntroduction, setStoryIntroduction] = useState<string>('');

  const updateStoryIntroduction = (newIntroduction: string): void => {
    setStoryIntroduction(newIntroduction);
  };

  return (
    <MyContext.Provider value={{ storyIntroduction, updateStoryIntroduction }}>
      {children}
    </MyContext.Provider>
  );
}
