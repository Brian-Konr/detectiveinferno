import { Box, Text, Button, Spinner, Heading, Center } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuessContext, GuessContextType } from '../contexts/guessContext';
import { StoryContext, StoryContextType } from '../contexts/storyContext';
import { AvatarContext, IAvatarContextType } from '../contexts/avatarContext';

const EndingPage = () => {
  const [loading, setLoading] = useState(true);
  const [isCorrectGuess, SetIsCorrectGuess] = useState(false);
  const [truth, setTruth] = useState('');
  const navigate = useNavigate();
  const { isValid } = useContext(GuessContext) as GuessContextType;

  const { reset: resetGuess } = useContext(GuessContext) as GuessContextType;
  const { reset: resetStory } = useContext(StoryContext) as StoryContextType;
  const { reset: resetAvatar } = useContext(AvatarContext) as IAvatarContextType;

  useEffect(() => {
    if (isValid) {
      // call API to check if guess is correct
      setTimeout(() => {
        SetIsCorrectGuess(true);
        setTruth('The butler did it!');
        setLoading(false);
      }, 1200);
    } else {
      setTimeout(() => {
        navigate('/menu');
      }, 1000);
    }
  }, [isValid, navigate]);

  return (
    <Box
      bgImage="url('/ending_bg.png')"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      color="white"
      textAlign="center"
    >
      {isValid ? (
        loading ? (
          <Center>
            <Spinner color="black" />
          </Center>
        ) : (
          <Box
            backgroundColor="rgba(0, 0, 0, 0.8)"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            width="fit-content"
            maxWidth="xl"
          >
            <Heading as="h2" mb={4}>
              {isCorrectGuess ? 'Congratulations! You solved the case!' : 'Oh no! Your guess was incorrect.'}
            </Heading>
            <Text fontSize="xl" mb={8}>
              The truth is: {truth}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati voluptates eos sapiente eligendi
              delectus, asperiores est quo, ea libero et minus at, laudantium labore ex. Excepturi harum amet autem
              molestias!
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => {
                resetGuess();
                resetStory();
                resetAvatar();
                navigate('/menu');
              }}
            >
              Play Again
            </Button>
          </Box>
        )
      ) : (
        <Box backgroundColor="rgba(0, 0, 0, 0.8)" p={4} borderRadius="md">
          <Heading as="h2" size="2xl" mb={4}>
            You need to make a guess first!
          </Heading>
          <Spinner />
        </Box>
      )}
    </Box>
  );
};

export default EndingPage;
