import {
  Box,
  Button,
  Text,
  VStack,
  Heading,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';

import { FiSearch, FiHelpCircle } from 'react-icons/fi';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { StoryContext, StoryContextType } from '../contexts/storyContext';
import { AvatarContext, IAvatarContextType } from '../contexts/avatarContext';
import { GuessContext, GuessContextType } from '../contexts/guessContext';
import { MdSend } from 'react-icons/md';
import { getHints } from '../agent';

const MenuPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isFetchingHint, setIsFetchingHint] = useState(false);
  const { isOpen: isHintOpen, onOpen: onHintOpen, onClose: onHintClose } = useDisclosure();

  const { isOpen: isGuessOpen, onOpen: onGuessOpen, onClose: onGuessClose } = useDisclosure();

  const { story, loading } = useContext(StoryContext) as StoryContextType;

  const { avatars, loading: avatarLoading } = useContext(AvatarContext) as IAvatarContextType;

  const [hintText, setHintText] = useState('');

  const { suspectId, motivation, method, setMethod, setMotivation, setSuspectId, isValid } = useContext(
    GuessContext,
  ) as GuessContextType;

  useEffect(() => {
    if (isFetchingHint) {
      const fetchHint = async () => {
        try {
          const hint = (await getHints()).data.data;
          setHintText(hint);
          onHintOpen();
        } catch (error) {
          console.error(`Filed to fetch hint: ${error}`);
          toast({
            title: '錯誤',
            description: '獲取提示失敗',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        } finally {
          setIsFetchingHint(false);
        }
      };
      fetchHint();
    }
  }, [isFetchingHint, onHintOpen, toast]);

  const MenuButton = ({
    leftIcon,
    colorScheme,
    onClick,
    children,
  }: {
    leftIcon: React.ReactElement;
    colorScheme: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <Button leftIcon={leftIcon} colorScheme={colorScheme} size="lg" flex="1" minW="0" onClick={onClick}>
      {children}
    </Button>
  );

  return (
    <Box bgImage="url('./menu_bg.png')" h="100vh" w="100vw">
      {loading ? (
        <Center height="100vh">
          <Spinner />
        </Center>
      ) : (
        <VStack spacing={8} align="center" justify="center" h="full">
          {/* Info Box */}
          <Box
            backgroundColor="rgba(119, 119, 119, 0.8)"
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
              {story.title}
            </Heading>
            <Text>{story.background}</Text>
          </Box>
          {/* Button Box */}
          <Box w="full" maxW="xl" mx="auto">
            <HStack spacing={4} w="full">
              <MenuButton leftIcon={<FiSearch />} colorScheme="purple" onClick={() => navigate('/suspects')}>
                調查嫌疑人＆場景
              </MenuButton>
              <MenuButton
                leftIcon={isFetchingHint ? <Spinner /> : <FiHelpCircle />}
                colorScheme="green"
                onClick={() => setIsFetchingHint(true)}
              >
                給我提示
              </MenuButton>
              <MenuButton leftIcon={<AiFillQuestionCircle />} colorScheme="orange" onClick={() => onGuessOpen()}>
                我要猜謎
              </MenuButton>
            </HStack>
          </Box>
          {/* Popover */}
          <Popover isOpen={isHintOpen} onClose={onHintClose}>
            <PopoverTrigger>
              <Box />
            </PopoverTrigger>
            <PopoverContent maxW="100%">
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Hint</PopoverHeader>
              <PopoverBody>{hintText}</PopoverBody>
            </PopoverContent>
          </Popover>
          {/* Guess Modal */}
          <Modal isOpen={isGuessOpen} onClose={onGuessClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>請填入你的猜測</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {avatarLoading ? (
                  <Center>
                    <Spinner />
                  </Center>
                ) : (
                  <>
                    <Select
                      placeholder="選擇兇手"
                      mb={3}
                      value={suspectId}
                      onChange={(e) => setSuspectId(Number(e.target.value))}
                    >
                      {avatars.map(
                        (avatar) =>
                          avatar.isSuspect && (
                            <option key={avatar.id} value={avatar.id}>
                              {avatar.name}
                            </option>
                          ),
                      )}
                    </Select>
                    <Input
                      placeholder="動機"
                      mb={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                    />
                    <Input placeholder="作案手法" mb={3} value={method} onChange={(e) => setMethod(e.target.value)} />
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  rightIcon={<MdSend />}
                  colorScheme="blue"
                  mr={3}
                  onClick={() => navigate('/ending')}
                  isDisabled={!isValid}
                >
                  送出
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      )}
    </Box>
  );
};

export default MenuPage;
