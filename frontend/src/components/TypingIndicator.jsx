import React from "react";

const TypingIndicator = () => (
  <div className="flex justify-start mb-2 animate-fade-in">
    <div className="msg-bubble msg-received flex items-center gap-1 py-3">
      <span className="w-2 h-2 bg-chat-muted rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-chat-muted rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-chat-muted rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

export default TypingIndicator;
