import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Briefcase, BarChart2, ChevronDown, ChevronUp, Loader2, HelpCircle, Bot, Send, User } from 'lucide-react';

interface Message {
    type: 'user' | 'bot';
    content: string;
}

export const exampleQuestions = [
    "What's my current equity balance?",
    "Show me my holdings details",
    "What's my user profile information?",
    "Do I have any open positions?",
    "Show my recent orders"
];

function ChatbotWithToggle() {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { type: 'bot', content: 'Hello! How can I assist you today?' }
    ]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages((prev) => [...prev, { type: 'user', content: input }]);
            setInput('');
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                className="fixed bottom-10 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                title={isChatbotOpen ? "Close Chatbot" : "Chat with Assistant"}
            >
                <Bot size={24} />
            </motion.button>

            {/* Chatbot Modal */}
            {isChatbotOpen && (
                <div className="fixed bottom-10 right-20 bg-white shadow-lg rounded-lg w-96 h-[32rem] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex items-center gap-2">
                        <Bot className="text-white" size={28} />
                        <h1 className="text-white text-2xl font-semibold">Trading Assistant</h1>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-3 ${
                                    message.type === 'user' ? 'flex-row-reverse' : ''
                                }`}
                            >
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
                                        }`}
                                    >
                                        {message.type === 'user' ? <User size={18} /> : <Bot size={18} />}
                                    </div>
                                </div>
                                <div
                                    className={`p-3 rounded-lg ${
                                        message.type === 'user'
                                            ? 'bg-blue-600 text-white ml-10'
                                            : 'bg-gray-100 text-gray-800 mr-10'
                                    }`}
                                >
                                    <p className="whitespace-pre-line">{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Example Questions */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-3">
                            <HelpCircle size={18} className="text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Try asking:</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto">
                            {exampleQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInput(question)}
                                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question here..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

export default ChatbotWithToggle;