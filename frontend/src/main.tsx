import { render } from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import MenuPage from './pages/MenuPage';
import { AvatarProvider } from './contexts/avatarContext';
import SuspectInvestigationPage from './pages/SuspectInvestigationPage';
import { StoryProvider } from './contexts/storyContext';
import EndingPage from './pages/EndingPage';
import { GuessProvider } from './contexts/guessContext';
render(
  <ChakraProvider>
    <StoryProvider>
      <AvatarProvider>
        <GuessProvider>
          <Router>
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/suspects" element={<SuspectInvestigationPage />} />
              <Route path="/ending" element={<EndingPage />} />
            </Routes>
          </Router>
        </GuessProvider>
      </AvatarProvider>
    </StoryProvider>
  </ChakraProvider>,
  document.getElementById('root'),
);
