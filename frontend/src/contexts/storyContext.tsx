import { createContext, useState, ReactNode, useEffect } from 'react';
import { IStory } from '../types/Story';

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
    if (story.title === '') {
      setTimeout(() => {
        setStory({
          title: '巴黎古堡的謀殺案',
          background:
            '2023年6月15日的晚上，在巴黎一座宏偉的古堡內，富有的藝術收藏家阿爾貝托·德拉羅沙被發現被毒死。死者的身上沒有明顯的外傷，死因初步確定為中毒，毒物為氰化物。',
        });
        setLoading(false);
      }, 1000);
    }
  }, [story]);

  return (
    <StoryContext.Provider value={{ story, setStory: updateStory, loading, reset }}>{children}</StoryContext.Provider>
  );
};

export { StoryContext, StoryProvider };
