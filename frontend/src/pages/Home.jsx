import React, { useState } from "react";
import WhatsAppHeader from "../components/WhatsAppHeader";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobileView, setMobileView] = useState("sidebar"); // "sidebar" | "chat"

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMobileView("chat");
  };

  const handleBack = () => {
    setMobileView("sidebar");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-chat-bg">
      <WhatsAppHeader />

      {/* Sidebar — full width on mobile, fixed width on desktop */}
      <div className={`
        ${mobileView === "chat" ? "hidden" : "flex"}
         w-full lg:w-80 shrink-0
      `}>
        <Sidebar selectedUser={selectedUser} onSelectUser={handleSelectUser} />
      </div>

      {/* Chat Window — hidden on mobile when sidebar is shown */}
      <div className={`
        ${mobileView === "sidebar" ? "hidden" : "flex"}
        lg:flex flex-1
      `}>
        <ChatWindow selectedUser={selectedUser} onBack={handleBack} />
      </div>
    </div>
  );
};

export default Home;