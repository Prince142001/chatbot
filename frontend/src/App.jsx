import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css"; // Import SimpleBar's CSS
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [botTyping, setBotTyping] = useState("");

  // Function to format the current time
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedTime = `${hours % 12 || 12}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
    return formattedTime;
  };

  useEffect(() => {
    // Load chat history from local storage when the component mounts
    const savedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    if (Array.isArray(savedChats)) {
      setChats(savedChats);
    }
  }, []);

  useEffect(() => {
    // Save chat history to local storage whenever chats state changes
    if (chats.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(chats));
    }
  }, [chats]);

  const simulateTyping = (text, callback) => {
    let index = 0;
    setBotTyping("");
    const typingInterval = setInterval(() => {
      setBotTyping((prev) => prev + text.charAt(index));
      index += 1;
      if (index === text.length) {
        clearInterval(typingInterval);
        callback();
      }
    }, 50); // Adjust typing speed by changing the interval
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newChat = { user: query, bot: null, time: formatTime(new Date()) };

    // Add the new chat to the chat history
    setChats((prevChats) => [...prevChats, newChat]);
    setIsTyping(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chatbot/query", {
        query,
      });
      const botResponse = res.data.answer;

      // Simulate typing effect
      simulateTyping(botResponse, () => {
        newChat.bot = botResponse;

        // Update the latest chat in the history
        setChats((prevChats) =>
          prevChats.map((chat, index) =>
            index === prevChats.length - 1 ? newChat : chat
          )
        );
        setIsTyping(false);
      });
    } catch (error) {
      console.error(error);
      newChat.bot = "Error connecting to the chatbot.";

      // Update the latest chat in the history
      setChats((prevChats) =>
        prevChats.map((chat, index) =>
          index === prevChats.length - 1 ? newChat : chat
        )
      );
      setIsTyping(false);
    }

    // Reset the query state
    setQuery("");
  };

  const handleStartChat = () => {
    setShowChat(true);
    if (isFirstOpen) {
      setChats((prevChats) => [
        ...prevChats,
        {
          user: null,
          bot: "Hi, I'm your chatbot assistant. I'm here to help you. You can ask anything to me about this site.",
          time: formatTime(new Date()),
        },
      ]);
      setIsFirstOpen(false);
    }
  };

  return (
    <div className="fixed right-20 bottom-20">
      {!showChat ? (
        <button
          onClick={handleStartChat}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Start Chat
        </button>
      ) : (
        <div className="p-4 max-w-sm mx-auto rounded bg-[#181C14] p-3 pb-20 w-[360.732px] h-[456px] relative overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setShowChat(false)}
            className="absolute -right-2 -top-2 z-10 p-1 bg-[#9EC8B9] rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
            >
              <path
                fill="#ffffff"
                d="m12 13.4l-2.9 2.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l2.9-2.9l-2.9-2.875q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.9 2.9l2.875-2.9q.275-.275.7-.275t.7.275q.3.3.3.713t-.3.687L13.375 12l2.9 2.9q.275.275.275.7t-.275.7q-.3.3-.712.3t-.688-.3z"
              />
            </svg>
          </button>

          {/* Chat Header */}
          <h1 className="text-2xl font-bold mb-4 text-[#ECDFCC]">Chatbot</h1>

          {/* Chat Messages (Scrollable) */}
          <SimpleBar className="space-y-2 h-[350px] pr-2">
            {chats.map((chat, index) => (
              <div key={index}>
                <div className="text-center text-[#ECDFCC] text-xs font-bold mb-2 relative">
                  <div className="relative z-10 inline-block px-3 py-1 bg-[#ECDFCC] text-[#181C14] rounded-full">
                    {chat.time}
                  </div>
                  <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-full h-1 bg-[#ECDFCC] rounded-full"></div>
                  </div>
                </div>
                {chat.user && (
                  <p className="text-[#9EC8B9] font-semibold text-sm">
                    User: {chat.user}
                  </p>
                )}
                <p className="text-[#ECDFCC] font-semibold text-sm">
                  Bot: {chat.bot ? chat.bot : botTyping}
                </p>
              </div>
            ))}
            {isTyping && (
              <p className="text-[#9EC8B9] font-bold text-sm">Bot: ...</p>
            )}
          </SimpleBar>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[96%]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me something..."
              className="w-full py-1 px-4 border border-[#ECDFCC] bg-[#9EC8B9] outline-none rounded-full mb-2 text-[#092635] font-semibold text-sm"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#1B4242] text-white rounded border-none outline-none rounded-full p-1 block absolute right-3 top-1/2 -translate-y-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#ffffff"
                  d="M20.04 2.323c1.016-.355 1.992.621 1.637 1.637l-5.925 16.93c-.385 1.098-1.915 1.16-2.387.097l-2.859-6.432l4.024-4.025a.75.75 0 0 0-1.06-1.06l-4.025 4.024l-6.432-2.859c-1.063-.473-1-2.002.097-2.387z"
                />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
