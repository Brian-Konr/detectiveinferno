import { Box, Button, Text, VStack, Heading, HStack } from '@chakra-ui/react';
import { FiSearch, FiHelpCircle } from 'react-icons/fi';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router';

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <Box bgGradient="linear(to-r, blue.900, gray.800)" h="100vh" w="100vw">
      <VStack spacing={8} align="center" justify="center" h="full">
        {/* Info Box */}
        <Box
          bg="whiteAlpha.200"
          borderRadius="lg"
          p={8}
          color="white"
          boxShadow="dark-lg"
          maxWidth="xl"
          w="full"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading as="h1" size="2xl" mb={4}>
            Detective Game
          </Heading>
          <Text>Story Background: [Insert story background here]</Text>
          <Text mt={4}>The Death: [Insert information about the death]</Text>
          <Text mt={4}>
            Method of Murder: [Insert how the death was killed]
          </Text>
          <Text mt={4}>
            Suspects Introduction: [Insert brief intro to suspects]
          </Text>
        </Box>

        <Box w="full" maxW="lg" mx="auto">
          <HStack spacing={4} w="full">
            <Button
              leftIcon={<FiSearch />}
              colorScheme="purple"
              size="lg"
              flex="1"
              onClick={() => navigate('/suspects')}
            >
              調查嫌疑人場景
            </Button>
            <Button
              leftIcon={<FiHelpCircle />}
              colorScheme="green"
              size="lg"
              flex="1"
            >
              給我提示
            </Button>
            <Button
              leftIcon={<AiFillQuestionCircle />}
              colorScheme="orange"
              size="lg"
              flex="1"
            >
              我要猜謎
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default MenuPage;
