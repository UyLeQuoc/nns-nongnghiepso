"use client";

import axiosClient from "@/apis/axiosClient";
import BackgroundAnimation from "@/components/background-animation";
import NavBar from "@/components/nav-bar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Update this import path as needed
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
interface Question {
  id: number;
  question: string;
  answer: string | null;
  createdAt: string;
}

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
      answer: "Giá cà phê tươi hôm nay",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/product/4/daily-prices",
      sendAI: "Dựa vào dữ liệu API, trả lời câu hỏi về 'Giá cà phê Arabica tươi hôm nay'. Trích xuất dữ liệu như khoảng giá và bất kỳ thông tin hữu ích nào có sẵn. Ghi nguồn từ Nông Nghiệp Số"
    },
    {
      question: "Phân tích 3 ngày(trong tương lai) dưa theo giá?",
      answer: "Phân tích 3 ngày(trong tương lai) dưa theo giá",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/product/4/daily-prices",
      sendAI: "Dựa vào dữ liệu API, Phân tích 3 ngày(trong tương lai) dưa theo giá? chênh nhau ở khoảng 200-300 VND. mức trung bình là 119.000VND (theo VND/Kg). Không phân tích người tên(Nguyễn Văn An	Bui Hai Quang	Hoàng Tiến	Trần Gia Phúc). Trình bày dữ liệu dưới dạng bảng hoặc danh sách   Ghi nguồn từ NongNghiepSo"
    },
    {
      question: "Lịch sử giá cả của các đại lý?",
      answer: "Lịch sử giá cả của cà phê của các đại lý. Nếu hỏi về 1 đại lý cụ thể, hãy cung cấp thông tin chi tiết về giá cả của họ trong tuần qua.",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/product/4/daily-prices",
      sendAI: "Dựa vào dữ liệu API, trả lời câu hỏi về lịch sử giá cà phê tươi trong tuần qua của các đại lý. Nếu hỏi về 1 đại lý cụ thể, hãy cung cấp thông tin chi tiết về giá cả của họ trong tuần qua. Trình bày dữ liệu dưới dạng bảng hoặc danh sách với các mốc giá theo từng ngày để người dùng dễ hiểu. Ghi nguồn từ Nông Nghiệp Số"
    },
    {
      question: "Giá cả của 1 đại lý giá tốt?",
      answer: "Lịch sử giá cả của cà phê của 1 đại lý. Nếu hỏi về 1 đại lý cụ thể, hãy cung cấp thông tin chi tiết về giá cả của họ trong tuần qua.",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/product/4/daily-prices",
      sendAI: "Dựa vào dữ liệu API, trả lời câu hỏi về lịch sử giá cà phê tươi trong tuần qua của các đại lý. Nếu hỏi về 1 đại lý cụ thể, hãy kiếm 1 người giá ổn và đẹp cung cấp thông tin chi tiết về giá cả của họ trong tuần qua. Trình bày dữ liệu dưới dạng bảng hoặc danh sách với các mốc giá theo từng ngày để người dùng dễ hiểu. Ghi nguồn từ Nông Nghiệp Số"
    },
    {
      question: "Giá cà phê các loại hôm nay?",
      answer: "Giá cà phê các loại hôm nay dao động từ 109,430 đến 215,222 VND/kg.",
      callApi: "https://nns-api.uydev.id.vn/api/AgentProductPreference/products-with-prices",
      sendAI: "Trả lời câu hỏi về 'Giá cà phê các loại hôm nay' dựa trên dữ liệu API. Bao gồm thông tin về các loại cà phê (như Arabica, Robusta) với giá cụ thể cho từng loại nếu có. Ghi nguồn từ Nông Nghiệp Số"
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
      const response = await axios.get(apiUrl);
      setMoreInformation(JSON.stringify(response.data));
      return JSON.stringify(response.data)
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
      const faq = faqQuestions.find((q) => q.question === inputValue) || null;

   
      

      try {
        fetchMoreInformation(faq?.callApi || "https://nns-api.uydev.id.vn/api/AgentProductPreference/product/4/daily-prices")
        .then(async () => {
          const initialMessages: ChatCompletionMessageParam[] = [
              {
                  role: "system",
                  content: `You are an agriculture AI. Respond clearly and use markdown for formatting. Follow these guidelines:
          - **Bold** text for key terms or important values.
          - *Italic* text for emphasis or secondary information.
          - Use bullet points or numbered lists for lists.
          - For tables, format them with proper headers and rows as follows:
          
          | Header 1 | Header 2 |
          | -------- | -------- |
          | Row 1    | Value 1  |
          | Row 2    | Value 2  |
          
          Return all responses in markdown format so they render properly in a markdown viewer. ${
                    moreInformation ? "Include relevant data insights based on the provided API data below." : "nếu k có dữ liệu thì lấy này [{date:2024-10-26T00:00:00,Nguyễn Văn An:140000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-27T00:00:00,Nguyễn Văn An:130000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-28T00:00:00,Nguyễn Văn An:130000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-29T00:00:00,Nguyễn Văn An:130000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-30T00:00:00,Nguyễn Văn An:120000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-31T00:00:00,Nguyễn Văn An:116890,Bui Hai Quang:151338,Hoàng Tiến:158951,Trần Gia Phúc:154180,Nguyễn Vũ:199996},{date:2024-11-01T00:00:00,Nguyễn Văn An:120598,Bui Hai Quang:152040,Hoàng Tiến:163554,Trần Gia Phúc:157612,Nguyễn Vũ:202465},{date:2024-11-02T00:00:00,Nguyễn Văn An:125152,Bui Hai Quang:149013,Hoàng Tiến:168126,Trần Gia Phúc:153898,Nguyễn Vũ:206828},{date:2024-11-03T00:00:00,Nguyễn Văn An:120174,Bui Hai Quang:145706,Hoàng Tiến:167929,Trần Gia Phúc:149930,Nguyễn Vũ:209506},{date:2024-11-05T00:00:00,Nguyễn Văn An:123267,Bui Hai Quang:146197,Hoàng Tiến:169895,Trần Gia Phúc:152346,Nguyễn Vũ:209472},{date:2024-11-06T00:00:00,Nguyễn Văn An:124112,Bui Hai Quang:141691,Hoàng Tiến:172856,Trần Gia Phúc:149435,Nguyễn Vũ:210267},{date:2024-11-07T00:00:00,Nguyễn Văn An:119669,Bui Hai Quang:144865,Hoàng Tiến:169890,Trần Gia Phúc:150236,Nguyễn Vũ:213943},{date:2024-11-08T00:00:00,Nguyễn Văn An:117607,Bui Hai Quang:143611,Hoàng Tiến:169534,Trần Gia Phúc:146215,Nguyễn Vũ:218717},{date:2024-11-09T00:00:00,Nguyễn Văn An:119738,Bui Hai Quang:147651,Hoàng Tiến:170577,Trần Gia Phúc:148815,Nguyễn Vũ:213881},{date:2024-11-10T00:00:00,Nguyễn Văn An:121636,Bui Hai Quang:146829,Hoàng Tiến:171130,Trần Gia Phúc:153446,Nguyễn Vũ:209021},{date:2024-11-11T00:00:00,Nguyễn Văn An:119814,Bui Hai Quang:149934,Hoàng Tiến:170117,Trần Gia Phúc:149217,Nguyễn Vũ:205891},{date:2024-11-12T00:00:00,Nguyễn Văn An:116351,Bui Hai Quang:153224,Hoàng Tiến:165477,Trần Gia Phúc:146443,Nguyễn Vũ:209973},{date:2024-11-13T00:00:00,Nguyễn Văn An:111666,Bui Hai Quang:152335,Hoàng Tiến:163483,Trần Gia Phúc:145044,Nguyễn Vũ:211587},{date:2024-11-14T00:00:00,Nguyễn Văn An:109430,Bui Hai Quang:152315,Hoàng Tiến:161580,Trần Gia Phúc:140512,Nguyễn Vũ:215222},{date:2024-11-20T00:00:00,Nguyễn Văn An:103040,Bui Hai Quang:156766,Hoàng Tiến:164242,Trần Gia Phúc:134497,Nguyễn Vũ:221367},{date:2024-11-21T00:00:00,Nguyễn Văn An:104924,Bui Hai Quang:151782,Hoàng Tiến:164574,Trần Gia Phúc:136203,Nguyễn Vũ:217659},{date:2024-11-22T00:00:00,Nguyễn Văn An:107785,Bui Hai Quang:159961,Hoàng Tiến:167477,Trần Gia Phúc:137260,Nguyễn Vũ:221411},{date:2024-11-23T00:00:00,Nguyễn Văn An:103736,Bui Hai Quang:158577,Hoàng Tiến:167108,Trần Gia Phúc:142008,Nguyễn Vũ:220190},{date:2024-11-24T00:00:00,Nguyễn Văn An:104010,Bui Hai Quang:162976,Hoàng Tiến:168523,Trần Gia Phúc:138607,Nguyễn Vũ:216153},{date:2024-11-25T00:00:00,Nguyễn Văn An:108879,Bui Hai Quang:161618,Hoàng Tiến:164500,Trần Gia Phúc:136987,Nguyễn Vũ:214726},{date:2024-11-26T00:00:00,Nguyễn Văn An:118800,Bui Hai Quang:118500,Hoàng Tiến:118200,Trần Gia Phúc:119100,Nguyễn Vũ:119200,Đại lý Nga Vinh:118200,Đại Lý Trung Bé:119500,Công ty Như Tùng:118600,Công Ty Vũ Đào Thịnh:118900,Đại lý Chí Hương:118700,Đại lý Hải Tuyền:119100}]"
                  }`
                },
              {
                role: "user",
                content: faq?.sendAI
                  ? `${faq.sendAI} ${moreInformation ? `API data: ${moreInformation}` : "nếu k có dữ liêu thì lấy này[{date:2024-10-26T00:00:00,Nguyễn Văn An:140000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-27T00:00:00,Nguyễn Văn An:130000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-28T00:00:00,Nguyễn Văn An:130000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-29T00:00:00,Nguyễn Văn An:130000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-30T00:00:00,Nguyễn Văn An:120000,Bui Hai Quang:150000,Hoàng Tiến:160000,Trần Gia Phúc:155000,Nguyễn Vũ:200000},{date:2024-10-31T00:00:00,Nguyễn Văn An:116890,Bui Hai Quang:151338,Hoàng Tiến:158951,Trần Gia Phúc:154180,Nguyễn Vũ:199996},{date:2024-11-01T00:00:00,Nguyễn Văn An:120598,Bui Hai Quang:152040,Hoàng Tiến:163554,Trần Gia Phúc:157612,Nguyễn Vũ:202465},{date:2024-11-02T00:00:00,Nguyễn Văn An:125152,Bui Hai Quang:149013,Hoàng Tiến:168126,Trần Gia Phúc:153898,Nguyễn Vũ:206828},{date:2024-11-03T00:00:00,Nguyễn Văn An:120174,Bui Hai Quang:145706,Hoàng Tiến:167929,Trần Gia Phúc:149930,Nguyễn Vũ:209506},{date:2024-11-05T00:00:00,Nguyễn Văn An:123267,Bui Hai Quang:146197,Hoàng Tiến:169895,Trần Gia Phúc:152346,Nguyễn Vũ:209472},{date:2024-11-06T00:00:00,Nguyễn Văn An:124112,Bui Hai Quang:141691,Hoàng Tiến:172856,Trần Gia Phúc:149435,Nguyễn Vũ:210267},{date:2024-11-07T00:00:00,Nguyễn Văn An:119669,Bui Hai Quang:144865,Hoàng Tiến:169890,Trần Gia Phúc:150236,Nguyễn Vũ:213943},{date:2024-11-08T00:00:00,Nguyễn Văn An:117607,Bui Hai Quang:143611,Hoàng Tiến:169534,Trần Gia Phúc:146215,Nguyễn Vũ:218717},{date:2024-11-09T00:00:00,Nguyễn Văn An:119738,Bui Hai Quang:147651,Hoàng Tiến:170577,Trần Gia Phúc:148815,Nguyễn Vũ:213881},{date:2024-11-10T00:00:00,Nguyễn Văn An:121636,Bui Hai Quang:146829,Hoàng Tiến:171130,Trần Gia Phúc:153446,Nguyễn Vũ:209021},{date:2024-11-11T00:00:00,Nguyễn Văn An:119814,Bui Hai Quang:149934,Hoàng Tiến:170117,Trần Gia Phúc:149217,Nguyễn Vũ:205891},{date:2024-11-12T00:00:00,Nguyễn Văn An:116351,Bui Hai Quang:153224,Hoàng Tiến:165477,Trần Gia Phúc:146443,Nguyễn Vũ:209973},{date:2024-11-13T00:00:00,Nguyễn Văn An:111666,Bui Hai Quang:152335,Hoàng Tiến:163483,Trần Gia Phúc:145044,Nguyễn Vũ:211587},{date:2024-11-14T00:00:00,Nguyễn Văn An:109430,Bui Hai Quang:152315,Hoàng Tiến:161580,Trần Gia Phúc:140512,Nguyễn Vũ:215222},{date:2024-11-20T00:00:00,Nguyễn Văn An:103040,Bui Hai Quang:156766,Hoàng Tiến:164242,Trần Gia Phúc:134497,Nguyễn Vũ:221367},{date:2024-11-21T00:00:00,Nguyễn Văn An:104924,Bui Hai Quang:151782,Hoàng Tiến:164574,Trần Gia Phúc:136203,Nguyễn Vũ:217659},{date:2024-11-22T00:00:00,Nguyễn Văn An:107785,Bui Hai Quang:159961,Hoàng Tiến:167477,Trần Gia Phúc:137260,Nguyễn Vũ:221411},{date:2024-11-23T00:00:00,Nguyễn Văn An:103736,Bui Hai Quang:158577,Hoàng Tiến:167108,Trần Gia Phúc:142008,Nguyễn Vũ:220190},{date:2024-11-24T00:00:00,Nguyễn Văn An:104010,Bui Hai Quang:162976,Hoàng Tiến:168523,Trần Gia Phúc:138607,Nguyễn Vũ:216153},{date:2024-11-25T00:00:00,Nguyễn Văn An:108879,Bui Hai Quang:161618,Hoàng Tiến:164500,Trần Gia Phúc:136987,Nguyễn Vũ:214726},{date:2024-11-26T00:00:00,Nguyễn Văn An:118800,Bui Hai Quang:118500,Hoàng Tiến:118200,Trần Gia Phúc:119100,Nguyễn Vũ:119200,Đại lý Nga Vinh:118200,Đại Lý Trung Bé:119500,Công ty Như Tùng:118600,Công Ty Vũ Đào Thịnh:118900,Đại lý Chí Hương:118700,Đại lý Hải Tuyền:119100}]"}`
                  : inputValue
              }
            ];

            const res = await fetch("/api/openai", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ initialMessages }),  // Sending initialMessages array
            });
      
            const data = await res.json();
            const answer = data.choices[0].message?.content || "Không có phản hồi từ NNS AI.";
            console.log("OpenAI Response:", answer);
      
            await axiosClient.post("https://nns-api.uydev.id.vn/Chat", {
              question: inputValue,
              answer: answer
            });

            setResponseText(answer);

        })
        .then(() => {
          setInputValue("");
          fetchQuestions();
          setLoading(false);
          setSubmitLoading(false);
        })
      } catch (error) {
        console.error("Failed to fetch response:", error);
      } finally {
        
      }


     
    } catch (error) {
      console.error("Error in handling question submission:", error);
      setError("Vui lòng xử dụng bản website để tương tác AI");
    } finally {
    }
  };

  return (
    <div className="w-full overflow-x-hidden text-gray-900">
      <BackgroundAnimation />
      <div className="container mx-auto">
        <NavBar />
        <main className="container mx-auto py-12 px-2">
        <section className="mb-12">
  <div className="text-center py-10 pb-2 px-4">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
      Chat với AI
    </h1>
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-full max-w-lg relative">
        <input
          type="text"
          placeholder="Hỏi nông nghiêp số AI..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-4 rounded-full bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none"
        />
        <button onClick={handleQuestionSubmit} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-50"
         disabled={submitLoading}
        >
          {submitLoading ? (
            <div className="loader">Loading...</div>
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

      
      <div className="flex flex-wrap justify-center space-x-4 space-y-1">
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
      {responseText && (
        <motion.div
          className="mt-4 bg-gray-100 p-4 rounded-lg shadow-lg w-full text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{responseText}</ReactMarkdown>
        </motion.div>
      )}

    </div>
  </div>
</section>

{/* description */}
<Card className="w-full max-w-4xl mx-auto my-8 overflow-hidden bg-yellow-50 dark:bg-yellow-900">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6">
          <div className="flex-shrink-0">
            <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 animate-pulse" />
          </div>
          <div className="flex-grow">
            <h2 className="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Lưu ý quan trọng
            </h2>
            <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300">
              Các thông tin và phân tích được cung cấp chỉ mang tính chất tham khảo, được tổng hợp từ nền tảng cơ sở dữ liệu của Nông Nghiệp Số và dựa trên biến động lịch sử để phân tích. Chúng tôi không cam kết hoặc đảm bảo về tính chính xác tuyệt đối hay kết quả thực tế. Mọi quyết định đầu tư, giao dịch hoặc hành động dựa trên thông tin này đều thuộc trách nhiệm của người sử dụng.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

<div>
    <h1 className="text-2xl font-bold text-white mb-6">
        Những câu hỏi từ nông dân khác
    </h1>
    <div className="">
        {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            ))
        ) : (
            <Accordion type="single" collapsible className="grid gap-2 grid-cols-1 md:grid-cols-2"> {/* Add Accordion wrapper here */}
                {questions.map((question) => (
                    <AccordionItem key={question.id} value={`question-${question.id}`} className="border border-gray-300 rounded-lg mb-2 bg-white">
                        <AccordionTrigger className="p-4 font-semibold text-gray-800 text-xl">
                            <div className="flex flex-col text-left">
                                <h2>{question.question}</h2>
                                <span className="text-sm text-gray-500 block mt-2">
                                    {new Date(question.createdAt).toLocaleString()}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-gray-600">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {question.answer || "Đang chờ trả lời..."}
                            </ReactMarkdown>
                            
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        )}
    </div>
</div>

        </main>
      </div>
    </div>
  );
}
function then(arg0: () => void) {
  throw new Error("Function not implemented.");
}

