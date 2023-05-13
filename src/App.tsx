import CodeDisplay from "./components/CodeDisplay";
import MessagesDisplay from "./components/MessagesDisplay";
import { useState } from "react";
import useCopyToClipboard from "./copyToClipboard";

interface ChatData {
  role: string;
  content: string;
}

const App = () => {
  const [value, setValue] = useState<string>('');
  const [chat, setChat] = useState<ChatData[]>([]);
  const [copy, copyToClipboard] = useCopyToClipboard();
  const [isLoading, setIsLoading] = useState(false); // Loading state
  
  const getQuery = async () => {
    try {
      setIsLoading(true); // Start loading
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: value })
      };
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      console.log(data);
      const userMessage = {
        role: 'user',
        content: value
      };
      setChat(oldChat => [...oldChat, data, userMessage]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  const clearChat = () => {
    setValue("");
    setChat([]);
  };

  const filteredUserMessages = chat.filter(message => message.role === 'user');
  const latestCode = chat.filter(message => message.role === 'assistant').pop();

  return (
    <div className="app"> 
      <MessagesDisplay userMessages={filteredUserMessages}/>
      <input value={value} onChange={e => setValue(e.target.value)}/>
      {isLoading ? (
        <CodeDisplay text={"Loading..." }/>) : (
        <CodeDisplay text={latestCode?.content || ""}/> // Render code content
      )}
      <div className="button-container">
        <button id="get-query" onClick={getQuery}>Get Query!</button>
        <button id="clear-chat" onClick={clearChat}>Clear Chat</button>
        <button id="copy-code" onClick={() => copyToClipboard(latestCode?.content || "")}>Copy Code</button>
      </div>
    </div>
  );
}

export default App;
