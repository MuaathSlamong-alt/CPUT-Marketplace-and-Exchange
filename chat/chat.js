function sendMessage() {
  const input = document.getElementById("message-input");
  const messageText = input.value.trim();
  if (messageText === "") return;

  // Create message bubble
  const message = document.createElement("div");
  message.className = "message sent";
  message.textContent = messageText;

  // Append to chat
  const chatBox = document.getElementById("chat-messages");
  chatBox.appendChild(message);

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  // Clear input
  input.value = "";
}
