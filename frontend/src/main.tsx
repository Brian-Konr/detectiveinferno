import React from 'react';
import { render } from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import StartPage from './pages/StartPage';

render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/start" element={<StartPage />} />
      </Routes>
    </Router>
  </ChakraProvider>,
  document.getElementById('root')
);
