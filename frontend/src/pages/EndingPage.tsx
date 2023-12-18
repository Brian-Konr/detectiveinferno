import { Box, Text, Button, Spinner, Heading, Center, useToast } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GuessContext, GuessContextType } from '../contexts/guessContext';
import { StoryContext, StoryContextType } from '../contexts/storyContext';
import { AvatarContext, IAvatarContextType } from '../contexts/avatarContext';
import { postEvaluation } from '../agent';

const EndingPage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [truth, setTruth] = useState('');
  const navigate = useNavigate();
  const { isValid, suspectId, method, motivation } = useContext(GuessContext) as GuessContextType;

  const { reset: resetGuess } = useContext(GuessContext) as GuessContextType;
  const { reset: resetStory } = useContext(StoryContext) as StoryContextType;
  const { reset: resetAvatar } = useContext(AvatarContext) as IAvatarContextType;

  useEffect(() => {
    if (isValid) {
      const getEvaluation = async () => {
        try {
          const { data: evaluationResponse } = await postEvaluation({
            ID: suspectId,
            動機: motivation,
            作案手法: method,
          });
          setIsCorrectGuess(evaluationResponse.data.isCorrect);
          setTruth(evaluationResponse.data.story);
        } catch (error) {
          toast({
            title: '錯誤',
            description: '獲取結局失敗',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        } finally {
          setLoading(false);
        }
      };
      getEvaluation();
    } else {
      setTimeout(() => {
        navigate('/menu');
      }, 1000);
    }
  }, [isValid, navigate, suspectId, method, motivation, toast]);

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
            backgroundColor="rgba(0, 0, 0, 0.75)"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            width="fit-content"
            maxWidth="xl"
          >
            <Heading as="h2" mb={4}>
              {isCorrectGuess ? '恭喜你答對了！' : '很可惜，你答錯了！'}
            </Heading>
            <Text fontSize="xl" mb={8}>
              {truth}
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
