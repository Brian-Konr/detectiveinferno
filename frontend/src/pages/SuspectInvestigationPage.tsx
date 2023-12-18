import React, { useContext, useState, useEffect } from 'react';
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
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { AvatarContext, IAvatarContextType } from '../contexts/avatarContext';
import { Sender, Sex } from '../types/Avatar';
import { useNavigate } from 'react-router';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { PushMessageResponse, SceneResponse, pushMessage, pushSceneQuery } from '../agent';

const SuspectInvestigationPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { avatars, updateChatHistory, loading } = useContext(AvatarContext) as IAvatarContextType;
  const theme = useTheme();
  const [inputFieldMessages, setInputFieldMessages] = useState<{
    [key: number]: string;
  }>({});
  const [chatEndRefs, setChatEndRefs] = useState<{
    [key: number]: React.RefObject<HTMLDivElement>;
  }>({});
  const [focusedBox, setFocusedBox] = useState<number | null>(null);
  const [isNpcThinking, setIsNpcThinking] = useState([false, false, false, false]);

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

  const getAvatarResponseAndUpdateChatHistory = async (avatarId: number, query: string) => {
    setIsNpcThinking((prev) => prev.map((_, index) => (index === avatarId ? true : _)));
    try {
      let avatarResponse: SceneResponse | PushMessageResponse;
      if (avatars[avatarId].isSuspect) {
        avatarResponse = (await pushMessage(avatarId, { 目標: avatars[avatarId].name, 行動: query })).data;
      } else {
        avatarResponse = (await pushSceneQuery({ 目標: avatars[avatarId].name, 行動: query })).data;
      }
      const avatar = avatars[avatarId];
      updateChatHistory(
        {
          id: avatar.chatHistory.length + 1,
          sender: Sender.Npc,
          content: avatarResponse.data,
        },
        avatar.id,
      );
      return avatarResponse.data;
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to fetch data.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsNpcThinking((prev) => prev.map((_, index) => (index === avatarId ? false : _)));
    }
  };
  return (
    <Box bgImage="url('/inquiry_bg.png')">
      {loading ? (
        <Center height="100vh">
          <Spinner />
        </Center>
      ) : (
        <Flex justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
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
                      avatar.isSuspect // 4 is the bot
                        ? avatar.sex === Sex.Male
                          ? '/suspect_man.png'
                          : '/suspect_woman.png'
                        : '/theme_bot_icon.png'
                    }
                  />
                  <Box display="flex" justifyContent="space-between" w="full">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" color="white">
                        {avatar.name}
                      </Text>
                      <Text fontWeight="bold" color="gray.200">
                        {avatar.relationship}
                      </Text>
                    </VStack>
                    {isNpcThinking[avatar.id] && <Spinner color="white" />}
                  </Box>
                </HStack>
                {/* Scrollable chat history */}
                <Box
                  borderWidth="1px"
                  p={2}
                  borderRadius="md"
                  minH="40vh"
                  maxH="40vh"
                  maxW="full"
                  overflowY="auto"
                  bg={theme.colors.gray[50]}
                >
                  {avatar.chatHistory.map((chatMessage, index) => (
                    <Flex key={index} justifyContent={chatMessage.sender === Sender.Player ? 'flex-end' : 'flex-start'}>
                      <Text
                        bg={chatMessage.sender === Sender.Player ? theme.colors.blue[100] : theme.colors.gray[200]}
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
                <Box mt={2} display="flex" justifyContent="space-between">
                  <HStack mt={2} p={2} spacing={3} bg="gray.800" borderRadius="md" w="full">
                    <form
                      style={{ width: '100%' }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!inputFieldMessages[avatar.id]) return;
                        updateChatHistory(
                          {
                            id: avatar.chatHistory.length + 1,
                            sender: Sender.Player,
                            content: inputFieldMessages[avatar.id],
                          },
                          avatar.id,
                        );
                        getAvatarResponseAndUpdateChatHistory(avatar.id, inputFieldMessages[avatar.id]);

                        setInputFieldMessages((prev) => ({
                          ...prev,
                          [avatar.id]: '',
                        }));
                      }}
                    >
                      <HStack spacing={4}>
                        <Input
                          color="gray.50"
                          placeholder="請輸入你的問題"
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
                          isDisabled={!inputFieldMessages[avatar.id] || isNpcThinking[avatar.id]}
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
              leftIcon={<FiArrowLeftCircle />}
              mt={4}
              colorScheme="gray"
              onClick={() => {
                navigate('/menu');
              }}
            >
              回到主選單
            </Button>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default SuspectInvestigationPage;
