import { render } from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import MenuPage from './pages/MenuPage';
import { AvatarProvider } from './contexts/avatarContext';
import SuspectInvestigationPage from './pages/SuspectInvestigationPage';
render(
  <ChakraProvider>
    <AvatarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/suspects" element={<SuspectInvestigationPage />} />
        </Routes>
      </Router>
    </AvatarProvider>
  </ChakraProvider>,
  document.getElementById('root'),
);
