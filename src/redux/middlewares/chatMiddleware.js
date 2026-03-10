import { chatActions } from '../slice/chatSlice';

let socket = null;

const chatMiddleware = store => next => action => {
  const { type, payload } = action;

  switch (type) {
    case 'chat/connect':
      // 1. Pass action to the slice to clear state/set loading
      next(action); 

      // 2. Clean up existing connection
      if (socket !== null) {
        socket.close();
      }

      // 3. Destructure the Ticket data from the payload
      // We expect: payload = { roomName: "...", chatToken: "..." }
      const { roomName, chatToken } = payload; 

      if (!roomName || !chatToken) {
        console.error("Middleware Error: Missing roomName or chatToken in connection request.");
        return;
      }
      
      // 4. Connect using the Signed Ticket
      // The WebSocket service will verify this specific ticket for this specific room
      const socketUrl = `ws://localhost/ws/chat/${roomName}/?token=${chatToken}`;
      socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        store.dispatch(chatActions.setConnected(true));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_history') {
          store.dispatch(chatActions.setHistory(data.messages));
        } else {
          store.dispatch(chatActions.receiveMessage(data));
        }
      };

      socket.onclose = () => {
        store.dispatch(chatActions.setConnected(false));
      };

      socket.onerror = (err) => {
        store.dispatch(chatActions.setError("WebSocket Connection Failed"));
      };
      break;

    case 'chat/sendMessage':
      if (socket && socket.readyState === WebSocket.OPEN) {
        // We wrap the message in a JSON object as expected by the Consumer
        socket.send(JSON.stringify({ message: payload }));
      }
      break;

    case 'chat/disconnect':
      if (socket !== null) {
        socket.close();
        socket = null;
      }
      break;

    default:
      return next(action);
  }
};

export default chatMiddleware;