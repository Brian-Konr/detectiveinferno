import { createContext, useState, ReactNode, useEffect } from 'react';
import { IStory } from '../types/Story';
import { getStory } from '../agent';

export type StoryContextType = {
  story: IStory;
  setStory: (story: IStory) => void;
  loading: boolean;
  reset: () => void;
};

const StoryContext = createContext<StoryContextType | undefined>(undefined);

const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState<IStory>({
    background: '',
    title: '',
  });

  const updateStory = (story: IStory) => {
    setStory(story);
  };

  const reset = () => {
    setStory({
      background: '',
      title: '',
    });
    setLoading(true);
  };

  useEffect(() => {
    if (loading) {
      const fetchStory = async () => {
        try {
          const { data: fetchedStory } = await getStory();
          setStory({
            background: fetchedStory.data,
            title: fetchedStory.title,
          });
        } catch (error) {
          console.error(`Filed to fetch story: ${error}`);
        } finally {
          setLoading(false);
        }
      };
      fetchStory();
    }
  }, [loading]);

  return (
    <StoryContext.Provider value={{ story, setStory: updateStory, loading, reset }}>{children}</StoryContext.Provider>
  );
};

export { StoryContext, StoryProvider };
