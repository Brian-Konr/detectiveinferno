import React from 'react';
import { Box, Button, Text, VStack, Heading } from '@chakra-ui/react';
import { FiSearch, FiHelpCircle, FiEye } from 'react-icons/fi';

const MenuPage = () => {
  return (
    <Box
      h="100vh"
      w="100vw"
      bg="gray.900" // Dark background
      color="whiteAlpha.900" // Light text for contrast
    >
      <VStack spacing={8} align="center" justify="center" h="full">
        {/* Info Box */}
        <Box
          bg="whiteAlpha.200"
          borderRadius="lg"
          p={8}
          color="white"
          boxShadow="dark-lg"
          maxWidth="container.md"
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

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={4} w="full">
          <Button
            leftIcon={<FiSearch />}
            colorScheme="purple"
            size="lg"
            width="200px"
          >
            詢問嫌疑人
          </Button>
          <Button
            leftIcon={<FiEye />}
            colorScheme="green"
            size="lg"
            width="200px"
          >
            調查場景及線索
          </Button>
          <Button
            leftIcon={<FiHelpCircle />}
            colorScheme="orange"
            size="lg"
            width="200px"
          >
            給我提示
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default MenuPage;
