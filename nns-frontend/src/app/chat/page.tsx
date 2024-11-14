"use client";

import axiosClient from "@/apis/axiosClient";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AIChatPage() {
    const router: AppRouterInstance = useRouter();
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    
    const faqQuestions = [
      "Giá cà phê nhân hôm nay?",
      "Giá cà phê tươi hôm nay?",
      "Thời tiết hôm nay?",
      "Giá phân bón?",
      "Lịch sử giá cả?"
    ];
  
    useEffect(() => {
      axiosClient.get("");
    }, []);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      // Filter FAQ questions based on input
      const filteredSuggestions = faqQuestions.filter((question) =>
        question.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    };
  
    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      setSuggestions([]);
    };

  return (
    <div className="w-full overflow-x-hidden">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
          <section className="mb-12">
            {/* Hero Section */}
            <div className="text-center py-28 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Chat với AI
              </h1>
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Chat input box with autocomplete */}
                <div className="w-full max-w-lg relative">
                  <input
                    type="text"
                    placeholder="Message ChatGPT"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {/* Icon for sending or an arrow */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M12 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  {/* Autocomplete suggestions */}
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="p-4 hover:bg-gray-100 cursor-pointer"
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Frequently asked questions as buttons */}
                <div className="flex flex-wrap justify-center space-x-4">
                  {faqQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question)}
                      className="flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-300"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div>
            
            <h1 className="text-2xl md:text-2xl font-bold text-white mb-6">
                Những câu hỏi từ nông dân khác
              </h1>
            <div>
                {/* cards */}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
