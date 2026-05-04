import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import LogOut from './LogOut'; // The component above

const Sidebar = ({ selectedUser, onSelectUser }) => {
  const { user, logout, onlineUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  console.log("-----------------------------");
  console.log("sidebar.jsx / 14",selectedUser);// selecteduser is what i choose to contact
  console.log("sidebar.jsx / 16",onSelectUser);// onSelectUser is the function to select the user


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/users");
        setUsers(data);
        console.log("sidebar.jsx / 21",user);// user is now arjun
        console.log("sidebar.jsx / 22",users); // users is now list of all users
      } catch (err) {
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const isOnline = (userId) => onlineUsers.includes(userId);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="p-2 md:p-1 w-full h-full  bg-chat-sidebar border-r border-chat-border">
      {/* Header */}
      <div className="p-5 md:p-5">

        <div className="flex justify-between items-center">
          
          <div className="flex justify-center items-center">
            <p className="text-2xl block md:hidden font-semibold text-chat-text">TalkApp</p>
            <p className="text-xl hidden md:block font-semibold text-chat-text">Chats</p>
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout"
              className="p-2 rounded-lg cursor-pointer text-chat-muted hover:text-chat-text hover:bg-chat-surface transition-all"
            >
              <svg className="w-6 h-6 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            {/* Modal Component */}
            <LogOut 
                isOpen={isLogoutModalOpen} // show or hide the modal
                onClose={() => setIsLogoutModalOpen(false)} 
            />

          </div>
          
        </div>
        {/* Search */}
        <div className="relative top-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chat-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-chat-panel border border-chat-border rounded-full pl-9 pr-4 py-2.5 text-chat-text placeholder-chat-muted focus:outline-none focus:border-chat-accent/50 text-sm transition-all"
          />
        </div>
      </div>

      {/* Contacts label */}
      <div className="px-5 py-4">
        <span className="text-md md:text-lg font-semibold text-chat-muted uppercase tracking-wider">
          Contacts ({filteredUsers.length})
        </span>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-11 h-11 rounded-full bg-chat-surface animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-chat-surface rounded animate-pulse w-2/3" />
                  <div className="h-2 bg-chat-surface rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-chat-muted">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
            <p className="text-sm">No contacts found</p>
          </div>
        ) : (
          <div className="px-2 pb-4">
            {filteredUsers.map((u) => (
              <button
                key={u._id}
                onClick={() => {onSelectUser(u); console.log("sidebar.jsx / 123",u)}}
                className={`w-full flex items-center cursor-pointer gap-5 p-3 rounded-xl mb-1 text-left transition-all duration-150 ${selectedUser?._id === u._id
                    ? "bg-chat-accent/30 border border-chat-accent/50"
                    : "hover:bg-chat-surface"
                  }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={u.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                    alt={u.name}
                    className="w-11 h-11 rounded-full bg-chat-surface border border-chat-border"
                  />
                  {isOnline(u._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-chat-online rounded-full border-2 border-chat-sidebar" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-chat-text text-sm truncate">{u.name}</p>
                  </div>
                  <p className="text-xs text-chat-muted truncate mt-0.5">
                    {isOnline(u._id) ? (
                      <span className="text-chat-online">● Active now</span>
                    ) : u.lastSeen ? (
                      `Last seen ${formatDistanceToNow(new Date(u.lastSeen), { addSuffix: true })}`
                    ) : (
                      u.email
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
