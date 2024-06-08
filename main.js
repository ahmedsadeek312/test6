import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";
import "./style.css"

// Initialize the model
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let history = [];

async function getResponse(prompt) {
  const chat = await model.startChat({ history: history });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  console.log(text);
  return text;
}

// user chat div
export const userDiv = (data) => {
  // <div class="flex items-center gap-2 justify-start">
  //   <img
  //     src="./public/Profile-picture-created-with-ai.jpeg"
  //     alt="user icon"
  //     class="w-10 h-10 rounded-full"
  //   />
  //   <p class="bg-gemDeep text-white p-1 rounded-md shadow-md  ">
  //     ${data}
  //   </p>
  // </div>
  return `
  <!-- User Chat -->
          <div class="notification">
            <div class="notiglow"></div>
            <div class="notiborderglow"></div>
            <div class="notititle">User</div>
            <div class="notibody">${data}</div>
          </div>
  `;
};

// AI Chat div
export const aiDiv = (data) => {
  return `
  <!-- AI Chat -->
           <div id="chat_container" class="flex gap-2 justify-end">
             <pre id="AI_Theme" class="bg-gemRegular/40 text-gemDeep p-1 rounded-md shadow-md whitespace-pre-wrap">
               ${data}
             </pre>
             <img
               src="./public/istockphoto-543190650-612x612.jpg"
               alt="user icon"
              class="w-10 h-10 rounded-full"
             />
             </div>
            
  `;
};
const chatArea = document.getElementById("chat-container");
async function handleSubmit(event) {
  event.preventDefault();

  let userMessage = document.getElementById("prompt");
  
  var prompt = userMessage.value.trim();

  if (prompt === "") {
    return;
  }

  console.log("user message", prompt);

  chatArea.innerHTML += userDiv(prompt);
  userMessage.value = "";
  const aiResponse = await getResponse(prompt);
  let md_text = md().render(aiResponse);
  chatArea.innerHTML += aiDiv(md_text);
chatArea.style.scrollBehavior = "smooth";
console.log(chatArea.scrollHeight)
  let newUserRole = {
    role: "user",
    parts: prompt,
  };
  let newAIRole = {
    role: "model",
    parts: aiResponse,
  };

  history.push(newUserRole);
  history.push(newAIRole);
if(history.length >= 4 ){
  console.log("do it bro");
  
}
  console.log(history);

}
const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) handleSubmit(event);
  // chatArea.scrollTop = chatArea.scrollHeight;
});
