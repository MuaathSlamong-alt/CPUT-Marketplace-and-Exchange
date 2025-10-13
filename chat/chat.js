
let currentUserId = null;
let selectedUserId = null;
let socket = null;

// Fetch current user info
async function getCurrentUser() {
  // This endpoint should return { id, username }
  const res = await fetch('/api/me');
  if (res.ok) return res.json();
  return null;
}

// Fetch user list (simulate for now)
async function getUserList() {
  // This endpoint should return [{ id, username }]
  const res = await fetch('/api/users');
  if (res.ok) return res.json();
  return [];
}

// Fetch chat history
async function getChatHistory(userId) {
  const res = await fetch(`/chat/${userId}`);
  if (res.ok) return res.json();
  return [];
}

// Render user list
async function renderUserList() {
  const userList = await getUserList();
  const ul = document.getElementById('user-list');
  ul.innerHTML = '';
  userList.forEach(user => {
    if (user.id === currentUserId) return;
    const li = document.createElement('li');
    li.textContent = user.username;
    li.dataset.userId = user.id;
    li.onclick = () => selectUser(user.id, user.username);
    ul.appendChild(li);
  });
}

// Render chat header
function renderChatHeader(username) {
  const header = document.getElementById('chat-header');
  header.innerHTML = `<strong>${username}</strong>`;
}

// Render chat messages
function renderMessages(messages) {
  const box = document.getElementById('chat-messages');
  box.innerHTML = '';
  messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message ' + (msg.from_user_id === currentUserId ? 'sent' : 'received');
    div.textContent = msg.content;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

// Select a user to chat with
async function selectUser(userId, username) {
  selectedUserId = userId;
  renderChatHeader(username);
  const messages = await getChatHistory(userId);
  renderMessages(messages);
  if (socket) {
    socket.emit('joinRoom', { userA: currentUserId, userB: userId });
  }
}

// Send a message
async function sendMessage() {
  const input = document.getElementById('message-input');
  const messageText = input.value.trim();
  if (!messageText || !selectedUserId) return;
  // Send to backend
  await fetch(`/chat/${selectedUserId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: messageText })
  });
  // Emit real-time event
  socket.emit('chatMessage', { fromUserId: currentUserId, toUserId: selectedUserId, content: messageText });
  // Add to UI
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'message sent';
  div.textContent = messageText;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  input.value = '';
}

// Listen for incoming messages
function setupSocket() {
  socket = io();
  socket.on('chatMessage', ({ fromUserId, toUserId, content }) => {
    if (fromUserId === selectedUserId || toUserId === selectedUserId) {
      const box = document.getElementById('chat-messages');
      const div = document.createElement('div');
      div.className = 'message received';
      div.textContent = content;
      box.appendChild(div);
      box.scrollTop = box.scrollHeight;
    }
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  const me = await getCurrentUser();
  if (!me) return;
  currentUserId = me.id;
  setupSocket();
  await renderUserList();
  document.getElementById('send-btn').onclick = sendMessage;
});
