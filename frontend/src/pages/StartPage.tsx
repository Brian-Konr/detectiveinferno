import { Box, Button, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
  const navigate = useNavigate();
  
  const handleStartGame = () => {
    navigate('/menu');
  };

  return (
    <Box height="100vh" overflow="hidden">
      <Image src="/main_theme.png" alt="Background" objectFit="cover" width="full" height="full" position="absolute" top="0" left="0" />
      <Box position="fixed" bottom="10%" left="0" right="0" width="100%" display="flex" justifyContent="center">
      <Button 
        colorScheme="teal" 
        size="lg" 
        onClick={handleStartGame} 
        opacity="0.9"
        _hover={{ transform: 'scale(1.05)', opacity: '1' }} 
        transition="all 0.2s ease-in-out"
        >
        Start Game
        </Button>
      </Box>
    </Box>
  );
};

export default StartPage;
