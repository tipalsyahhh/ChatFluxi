const API_KEY = "AIzaSyAsmLvXFmR4Wcq7Vm20Lyijf3SFeSg6kQg";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
const botName = "ChatFluxi";
let conversationHistory = [];
let recognition;
let isMuted = false;

function cleanResponse(text) {
    return text.replace(/[*_~`<>{}]/g, "");
}

async function sendMessage(userMessage) {
    if (userMessage.trim() === "") return;

    appendMessage("You", userMessage, "user");
    conversationHistory.push(`You: ${userMessage}`);

    if (userMessage.toLowerCase().includes("siapa namamu") ||
        userMessage.toLowerCase().includes("apa nama kamu")) {
        const responseMessage = `Namaku adalah ${botName}.`;
        appendMessage(botName, responseMessage, "bot");
        conversationHistory.push(`${botName}: ${responseMessage}`);
        speak(responseMessage);
        return;
    }

    if (userMessage.toLowerCase().includes("apa yang saya tanyakan sebelumnya") ||
        userMessage.toLowerCase().includes("sebutkan pertanyaan pertama saya")) {
        const previousQuestions = conversationHistory.filter(msg => msg.startsWith("You:"));
        const responseMessage = previousQuestions.length > 0
            ? `Pertanyaan sebelumnya: "${previousQuestions[0].replace("You: ", "")}"`
            : "Saya tidak memiliki pertanyaan sebelumnya yang bisa saya sebutkan.";
        appendMessage(botName, responseMessage, "bot");
        conversationHistory.push(`${botName}: ${responseMessage}`);
        speak(responseMessage);
        return;
    }

    const requestBody = {
        contents: [
            { parts: [{ text: conversationHistory.join('\n') }] }
        ]
    };

    document.getElementById("user-input").value = "";

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const botMessage = cleanResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak dapat menghasilkan respon.");

        if (userMessage.toLowerCase().includes("code") || userMessage.toLowerCase().includes("coding")) {
            appendMessage(botName, `<pre class="code"><code>${highlightCode(botMessage)}</code></pre>`, "code");
        } else {
            const formattedBotMessage = botMessage.replace(/\n/g, '<br>');
            conversationHistory.push(`${botName}: ${botMessage}`);
            setTimeout(() => {
                appendMessage(botName, formattedBotMessage, "bot");
                speak(botMessage);
            }, 1000);
        }

    } catch (error) {
        console.error("Error:", error);
        appendMessage(botName, "Maaf, terjadi kesalahan.", "bot");
    }
}
function startRecording() {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Browser ini tidak mendukung Speech Recognition.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function (event) {
        const userMessage = event.results[0][0].transcript;
        sendMessage(userMessage);
    };

    recognition.onerror = function (event) {
        console.error("Error occurred in recognition: " + event.error);
    };

    recognition.start();
}
function speak(text) {
    if (isMuted) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.onend = function () {
        console.log('Finished speaking.');
    };
    speechSynthesis.speak(utterance);
}
function toggleMute() {
    isMuted = !isMuted;
    const muteButton = document.getElementById("mute-button");
    muteButton.innerHTML = isMuted ? '<i class="bi bi-volume-mute" style="font-size: 20px;"></i>' : '<i class="bi bi-volume-up" style="font-size: 20px;"></i>';
    if (!isMuted && conversationHistory.length > 0) {
        const lastBotMessage = conversationHistory[conversationHistory.length - 1].replace(`${botName}: `, '');
        speak(lastBotMessage);
    } else if (isMuted) {
        speechSynthesis.cancel();
    }
}

function highlightCode(code) {
    return code
        .replace(/(const|let|var|if|else|return|function|async|await)/g, '<span class="keyword">$1</span>')
        .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
        .replace(/(\d+)/g, '<span class="number">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/|\/\/.*?$)/gm, '<span class="comment">$1</span>');
}

function appendMessage(sender, message, type) {
    const chatBox = document.getElementById("chat-box");

    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", type);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content", type);
    messageContent.innerHTML = message;

    const timeElement = document.createElement("div");
    timeElement.classList.add("message-time");
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (type === "bot") {
        const muteButton = document.createElement("button");
        muteButton.id = "mute-button";
        muteButton.onclick = toggleMute;
        muteButton.style.background = "none";
        muteButton.style.border = "none";
        muteButton.style.cursor = "pointer";
        muteButton.innerHTML = isMuted ? '<i class="bi bi-volume-mute" style="font-size: 20px;"></i>' : '<i class="bi bi-volume-up" style="font-size: 20px;"></i>';

        timeElement.innerHTML = `(${timeNow}) `;
        timeElement.appendChild(muteButton);
    } else {
        timeElement.innerHTML = `(${timeNow})`;
    }

    messageContent.appendChild(timeElement);
    messageElement.appendChild(messageContent);
    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight;
}
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage(document.getElementById("user-input").value);
    }
});
document.getElementById("record-button").addEventListener("click", startRecording);