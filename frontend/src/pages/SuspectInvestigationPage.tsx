import React, { useContext, useState, useEffect } from 'react';
import { keyframes } from '@chakra-ui/react';
import {
  Box,
  Avatar,
  HStack,
  VStack,
  Text,
  Button,
  Flex,
  useTheme,
  Input,
} from '@chakra-ui/react';
import { AvatarContext } from '../contexts/avatarContext';
import { IAvatarContextType, Sender } from '../types/Avatar';
import { useNavigate } from 'react-router';

const SuspectInvestigationPage: React.FC = () => {
  const navigate = useNavigate();
  const { avatars, updateChatHistory } = useContext(
    AvatarContext,
  ) as IAvatarContextType;
  const theme = useTheme();
  const [inputFieldMessages, setInputFieldMessages] = useState<{
    [key: number]: string;
  }>({});
  const [chatEndRefs, setChatEndRefs] = useState<{
    [key: number]: React.RefObject<HTMLDivElement>;
  }>({});
  const [focusedBox, setFocusedBox] = useState<number | null>(null);

  useEffect(() => {
    setChatEndRefs(() =>
      avatars.reduce(
        (acc, avatar) => {
          acc[avatar.id] = React.createRef();
          return acc;
        },
        {} as { [key: number]: React.RefObject<HTMLDivElement> },
      ),
    );
  }, [avatars]);

  useEffect(() => {
    avatars.forEach((avatar) => {
      chatEndRefs[avatar.id]?.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [avatars, chatEndRefs]);

  const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  return (
    <Box
      bgGradient="linear(to-r, blue.900, gray.800)"
      minH="100vh"
      sx={{
        backgroundSize: '200% 200%',
        animation: `${gradient} 5s linear infinite`,
      }}
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <HStack spacing={6} align="stretch">
          {avatars.map((avatar) => (
            <Box
              key={avatar.id}
              w="full"
              maxW="lg"
              p={4}
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              bg={focusedBox === avatar.id ? 'blue.700' : 'gray.700'}
              ml={4}
              mr={4}
              boxShadow="0px 10px 15px rgba(0, 0, 0, 0.1)"
            >
              <HStack spacing={4} p={4}>
                <Avatar
                  name={avatar.name}
                  src={
                    avatar.id === 4 // 4 is the bot
                      ? '/theme_bot_icon.png'
                      : '/suspect_woman.png'
                  }
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" color="white">
                    {avatar.name}
                  </Text>
                  <Text fontWeight="bold" color="gray.200">
                    {avatar.relationship}
                  </Text>
                </VStack>
              </HStack>
              {/* Scrollable chat history */}
              <Box
                borderWidth="1px"
                p={2}
                borderRadius="md"
                minH="40vh"
                maxH="40vh"
                maxW="50vw"
                overflowY="auto"
                bg={theme.colors.gray[50]}
              >
                {avatar.chatHistory.map((chatMessage, index) => (
                  <Flex
                    key={index}
                    justifyContent={
                      chatMessage.sender === Sender.Player
                        ? 'flex-end'
                        : 'flex-start'
                    }
                  >
                    <Text
                      bg={
                        chatMessage.sender === Sender.Player
                          ? theme.colors.blue[100]
                          : theme.colors.gray[200]
                      }
                      p={2}
                      borderRadius="md"
                      m={1}
                      maxW="70%"
                    >
                      {`${chatMessage.content}`}
                    </Text>
                  </Flex>
                ))}
                <div ref={chatEndRefs[avatar.id]} />
              </Box>
              {/* Input field and Send button */}
              <Box mt={2}>
                <HStack
                  mt={2}
                  p={2}
                  spacing={3}
                  bg="gray.800"
                  borderRadius="md"
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!inputFieldMessages[avatar.id]) return;
                      updateChatHistory(
                        {
                          id: avatar.chatHistory.length + 1,
                          sender: Sender.Player,
                          content: inputFieldMessages[avatar.id] || '',
                        },
                        avatar.id,
                      );
                      updateChatHistory(
                        {
                          id: avatar.chatHistory.length + 1,
                          sender: Sender.Npc,
                          content: inputFieldMessages[avatar.id] || '',
                        },
                        avatar.id,
                      );
                      setInputFieldMessages((prev) => ({
                        ...prev,
                        [avatar.id]: '',
                      }));
                    }}
                  >
                    <HStack spacing={4}>
                      <Input
                        color="gray.50"
                        placeholder="Type a message..."
                        _placeholder={{ color: 'gray.400' }}
                        value={inputFieldMessages[avatar.id] || ''}
                        onChange={(e) =>
                          setInputFieldMessages((prev) => ({
                            ...prev,
                            [avatar.id]: e.target.value,
                          }))
                        }
                        onFocus={() => setFocusedBox(avatar.id)}
                        onBlur={() => setFocusedBox(null)}
                      />
                      <Button
                        bg="blue.500"
                        color="white"
                        _hover={{ bg: 'blue.600' }}
                        type="submit"
                        isDisabled={!inputFieldMessages[avatar.id]}
                      >
                        送出
                      </Button>
                    </HStack>
                  </form>
                </HStack>
              </Box>
            </Box>
          ))}
        </HStack>
        <Box mt={4}>
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => {
              navigate('/menu');
            }}
          >
            回到主選單
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default SuspectInvestigationPage;