"use client";

import React, { useEffect, useState } from "react";
import axiosClient from "@/apis/axiosClient";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { useRouter } from "next/navigation";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { motion } from "framer-motion";

interface Question {
  id: number;
  question: string;
  answer: string | null;
  createdAt: string;
}

const openai = new OpenAI({
  project: process.env.NEXT_PUBLIC_OPENAI_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function AIChatPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>("");
  const [moreInformation, setMoreInformation] = useState<string | null>("");

  const faqQuestions: {
    question: string;
    answer: string;
    callApi?: string;
    sendAI?: string;
  }[] = [
    {
      question: "Giá cà phê tươi hôm nay?",
      answer: "Giá cà phê tươi hôm nay dao động từ 109,430 đến 215,222 VND/kg.",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/products-with-prices",
      sendAI: "Hãy dựa vào dữ liệu API để trả lời rõ ràng và ngắn gọn về 'Giá cà phê tươi hôm nay'. Trích xuất dữ liệu như khoảng giá và bất kỳ thông tin hữu ích nào có sẵn."
    },
    {
      question: "Giá phân bón?",
      answer: "Giá phân bón dao động từ 100,000 đến 200,000 VND/kg.",
      sendAI: "Hãy cung cấp giá trị phân bón random trong khoảng 100,000 đến 200,000 VND"
    },
    {
      question: "Lịch sử giá cả?",
      answer: "Lịch sử giá cả của cà phê tươi trong 1 tuần qua.",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/product/4/daily-prices",
      sendAI: "Dựa vào dữ liệu API, trả lời câu hỏi về lịch sử giá cà phê tươi trong tuần qua. Trình bày dữ liệu dưới dạng bảng hoặc danh sách với các mốc giá theo từng ngày để người dùng dễ hiểu."
    },
    {
      question: "Giá cà phê các loại hôm nay?",
      answer: "Giá cà phê các loại hôm nay dao động từ 109,430 đến 215,222 VND/kg.",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/products-with-prices",
      sendAI: "Trả lời câu hỏi về 'Giá cà phê các loại hôm nay' dựa trên dữ liệu API. Bao gồm thông tin về các loại cà phê (như Arabica, Robusta) với giá cụ thể cho từng loại nếu có."
    }
  ];

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get<Question[]>("https://nns-api.uydev.id.vn/Chat");
      setQuestions(response.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchMoreInformation = async (apiUrl: string) => {
    try {
      const response = await axiosClient.get(apiUrl);
      setMoreInformation(JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch additional information", error);
      setMoreInformation(null); // Ensure `moreInformation` is reset on error
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setError(null);
    const filteredSuggestions = faqQuestions.filter((question) =>
      question.question.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions.map((question) => question.question));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  const handleQuestionSubmit = async () => {
    if (inputValue.length < 2 || inputValue.length > 50) {
      setError("Câu hỏi phải có từ 2 đến 50 ký tự.");
      return;
    }

    setSubmitLoading(true);
    setError(null);
    setResponseText(null);
    setMoreInformation(null);

    try {
      const faq = faqQuestions.find((q) => q.question === inputValue);

      // If the question is a FAQ and has a `callApi`, fetch additional information first
      if (faq && faq.callApi) {
        await fetchMoreInformation(faq.callApi);
      }

      // Construct the message for the AI
      const initialMessages: ChatCompletionMessageParam[] = [
        {
          role: "system",
          content: `You are an agriculture AI. Answer questions clearly and briefly in markdown format with lists, bold text for key details, and structured information. ${
            moreInformation ? "Include relevant data insights from the provided API data below." : ""
          }`
        },
        {
          role: "user",
          content: faq?.sendAI
            ? `${faq.sendAI} ${moreInformation ? `API data: ${moreInformation}` : ""}`
            : inputValue
        }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: initialMessages
      });

      const answer = response.choices[0].message?.content || "Không có phản hồi từ NNS AI.";
      console.log("OpenAI Response:", answer);

      await axiosClient.post("https://nns-api.uydev.id.vn/Chat", {
        question: inputValue,
        answer: answer
      });

      setResponseText(answer);
      setInputValue("");
      fetchQuestions();
    } catch (error) {
      console.error("Error in handling question submission:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden text-gray-900">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
          <section className="mb-12">
            <div className="text-center py-28 px-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Chat với AI
              </h1>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full max-w-lg relative">
                  <input
                    type="text"
                    placeholder="Message ChatGPT"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none"
                  />
                  <button onClick={handleQuestionSubmit} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {submitLoading ? (
                      <div className="loader">
                        Loading...
                      </div>
                    ) : (
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
                    )}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
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
                {responseText && (
                  <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-lg w-full max-w-lg">
                    {responseText.split(" ").map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="inline-block mr-1"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap justify-center space-x-4">
                  {faqQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(question.question)}
                      className="flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 border border-green-300"
                    >
                      {question.question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">
              Những câu hỏi từ nông dân khác
            </h1>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="p-4 border border-gray-300 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                questions.map((question) => (
                  <div key={question.id} className="p-4 border border-gray-300 bg-white rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800">{question.question}</h2>
                    <p className="text-gray-600">{question.answer || "Đang chờ trả lời..."}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(question.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
