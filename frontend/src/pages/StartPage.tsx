import { Box, Button, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
  const navigate = useNavigate();
  
  const handleStartGame = () => {
    navigate('/');
  };

  return (
    <Box height="100vh" overflow="hidden">
      <Image src="/main_theme.png" alt="Background" objectFit="cover" width="full" height="full" position="absolute" top="0" left="0" />
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Button colorScheme="teal" onClick={handleStartGame}>
          Start Game
        </Button>
      </Box>
    </Box>
  );
};

export default StartPage;
