import { createContext, useState, ReactNode, useEffect } from 'react';

export type GuessContextType = {
  suspectId: number;
  setSuspectId: (suspectId: number) => void;
  method: string;
  setMethod: (method: string) => void;
  motivation: string;
  setMotivation: (motivation: string) => void;
  isValid: boolean;
  reset: () => void;
};

const GuessContext = createContext<GuessContextType | undefined>(undefined);

const GuessProvider = ({ children }: { children: ReactNode }) => {
  const [suspectId, setSuspectId] = useState(0);
  const [method, setMethod] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isValid, setIsValid] = useState(false);

  const reset = () => {
    // Define the reset function
    setSuspectId(-1);
    setMethod('');
    setMotivation('');
    setIsValid(false);
  };

  useEffect(() => {
    if (suspectId !== -1 && method !== '' && motivation !== '') {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [suspectId, method, motivation]);

  return (
    <GuessContext.Provider
      value={{ suspectId, setSuspectId, method, setMethod, motivation, setMotivation, isValid, reset }}
    >
      {children}
    </GuessContext.Provider>
  );
};

export { GuessContext, GuessProvider };
