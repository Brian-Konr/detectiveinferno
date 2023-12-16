import { render } from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import MenuPage from './pages/MenuPage';
import { AvatarProvider } from './contexts/avatarContext';
render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <AvatarProvider>
          <Route path="/menu" element={<MenuPage />} />
        </AvatarProvider>
      </Routes>
    </Router>
  </ChakraProvider>,
  document.getElementById('root'),
);
