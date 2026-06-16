import { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  Spinner,
  Badge,
  useToast,
  Container,
  Heading,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { BsRobot, BsPersonFill } from "react-icons/bs";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AGENT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const QUICK_PROMPTS = [
  { label: "Add 1 pineapple to my cart", text: "Add 1 pineapple to my cart" },
  { label: "What addresses do I have?", text: "What addresses do I have?" },
  { label: "View my cart items", text: "What is currently in my cart?" },
  { label: "Tell me more about red chilli powder", text: "Tell me more about red chilli powder" },
];

export default function ShelfMatesAI() {
  const { getCart } = useCart();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I am your Shelf-mates AI assistant. I can help you search for products, manage your cart, update your addresses, and place orders. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;

    const userMessage = textToSend.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);
    
    setIsStreaming(true);

    try {
      const token = getCookie("token");
      console.log("COOKIE EXTRACTED: ", token);
      

      const response = await fetch(`${AGENT_API_URL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: history.length > 0 ? history : null,
          token: token,
        }),
        credentials: "include", // Essential to send the 'token' cookie
      });

      if (!response.ok) {
        let errMsg = "Failed to connect to AI assistant";
        if (response.status === 401) {
          errMsg = "You are not authenticated. Please log in again.";
        }
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      if (!reader) {
        throw new Error("Failed to read server response stream");
      }

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Save trailing incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const dataStr = trimmed.slice(6).trim();
          if (!dataStr) continue;

          try {
            const event = JSON.parse(dataStr);

            setMessages((prev) => {
              const updated = [...prev];
              const activeMsg = { ...updated[updated.length - 1] };

              if (event.type === "content") {
                activeMsg.content += event.delta;
              } else if (event.type === "error") {
                toast({
                  title: "Agent Error",
                  description: event.content,
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              } else if (event.type === "done") {
                if (event.history) {
                  setHistory(event.history);
                }
                activeMsg.content = event.response;
              }

              updated[updated.length - 1] = activeMsg;
              return updated;
            });
          } catch (e) {
            console.error("SSE parse error", e);
          }
        }
      }

      try {
        await getCart();
      } catch (err) {
        console.error("Failed to refetch cart:", err);
      }
    } catch (error: any) {
      console.error("Agent communication error", error);
      toast({
        title: "Connection Failed",
        description: error.message || `Could not connect to the AI Agent API at ${AGENT_API_URL}. Make sure it is running.`,
        status: "error",
        duration: 7000,
        isClosable: true,
      });

      // Update the placeholder message with error
      setMessages((prev) => {
        const updated = [...prev];
        const activeMsg = { ...updated[updated.length - 1] };
        activeMsg.content = `⚠️ Sorry, I encountered a connection issue. Please make sure the backend AI Agent is running on ${AGENT_API_URL}.\n\nError details: ${error.message}`;
        updated[updated.length - 1] = activeMsg;
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Flex direction="column" h="100vh" bg="gray.50">
      <Navbar />
      
      <Container maxW="container.lg" flex={1} display="flex" flexDirection="column" py={4} h="calc(100vh - 64px)" overflow="hidden">
        {/* Header Section */}
        <Flex justify="space-between" align="center" bg="white" p={4} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" mb={4}>
          <HStack spacing={3}>
            <Avatar bg="orange.400" icon={<BsRobot size={22} />} color="white" />
            <VStack align="start" spacing={0}>
              <Heading size="md" color="gray.800">Shelf-mates AI</Heading>
              <HStack spacing={1.5}>
                <Box w={2} h={2} bg="green.400" borderRadius="full" className="pulse-dot" />
                <Text fontSize="xs" color="gray.500">Autonomous Assistant Online</Text>
              </HStack>
            </VStack>
          </HStack>
          
          <Badge colorScheme="orange" variant="subtle" px={2} py={1} borderRadius="md">
            Beta
          </Badge>
        </Flex>

        {/* Chat Feed */}
        <Box flex={1} bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" p={4} overflowY="auto" mb={4} display="flex" flexDirection="column">
          <VStack spacing={4} align="stretch" flex={1}>
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <MotionBox
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}
                  maxW="85%"
                >
                  <HStack align="start" spacing={3} flexDirection={msg.role === "user" ? "row-reverse" : "row"}>
                    <Avatar
                      size="sm"
                      bg={msg.role === "user" ? "orange.400" : "teal.500"}
                      icon={msg.role === "user" ? <BsPersonFill size={16} /> : <BsRobot size={16} />}
                      color="white"
                    />
                    
                    <VStack align={msg.role === "user" ? "flex-end" : "flex-start"} spacing={2}>
                      {/* Message Bubble */}
                      <Box
                        bg={msg.role === "user" ? "orange.400" : "gray.50"}
                        color={msg.role === "user" ? "white" : "gray.800"}
                        px={4}
                        py={3}
                        borderRadius="2xl"
                        borderTopRightRadius={msg.role === "user" ? "none" : "2xl"}
                        borderTopLeftRadius={msg.role === "user" ? "2xl" : "none"}
                        boxShadow="xs"
                        whiteSpace="pre-wrap"
                        fontSize="sm"
                      >
                        {msg.content ? (
                          msg.content
                        ) : (
                          isStreaming &&
                          idx === messages.length - 1 && (
                            <HStack spacing={2} py={1}>
                              <Spinner size="xs" color="teal.500" />
                              <Text fontSize="xs" color="gray.500">Connecting to agent...</Text>
                            </HStack>
                          )
                        )}
                      </Box>
                    </VStack>
                  </HStack>
                </MotionBox>
              ))}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </VStack>
        </Box>

        {/* Quick Suggestions */}
        {messages.length === 1 && !isStreaming && (
          <Flex flexWrap="wrap" gap={2} mb={3} px={1}>
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <Button
                key={pIdx}
                size="sm"
                variant="outline"
                colorScheme="orange"
                borderRadius="full"
                fontWeight="normal"
                bg="white"
                onClick={() => handleSend(prompt.text)}
                _hover={{ bg: "orange.50", transform: "scale(1.02)" }}
                transition="all 0.2s"
              >
                {prompt.label}
              </Button>
            ))}
          </Flex>
        )}

        {/* Input Bar */}
        <Box bg="white" borderRadius="xl" shadow="sm" border="1px" borderColor="gray.100" p={3}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
          >
            <HStack spacing={3}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Shelf-mates AI to search, add items to cart, place an order..."
                disabled={isStreaming}
                bg="gray.50"
                border="none"
                _focus={{ bg: "white", shadow: "inner", border: "1px", borderColor: "orange.300" }}
                borderRadius="lg"
                size="lg"
                fontSize="sm"
              />
              <Button
                type="submit"
                colorScheme="orange"
                isLoading={isStreaming}
                disabled={!input.trim()}
                borderRadius="lg"
                px={6}
                size="lg"
                rightIcon={<ArrowForwardIcon />}
              >
                Send
              </Button>
            </HStack>
          </form>
        </Box>
      </Container>

      {/* Styled pulse dot keyframes */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 6px rgba(72, 187, 120, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
          }
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
      `}</style>
    </Flex>
  );
}
