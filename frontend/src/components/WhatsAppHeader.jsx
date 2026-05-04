import React, { useState, useRef, useEffect } from 'react';
import { MdMarkUnreadChatAlt } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { GrGallery } from "react-icons/gr";



// ---------------- PROFILE UPLOAD COMPONENT ----------------
function ProfileUpload() {
    const profileRef = useRef();
    const [profileImage, setProfileImage] = useState(null);

    // Load initial profile pic from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("chatapp-user");
        console.log("whatsAppHeader.jsx / 21 ",storedUser);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user?.profilePic) {
                setProfileImage(user.profilePic);
            }
        }
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Get user from storage
        const storedData = localStorage.getItem("chatapp-user");
        if (!storedData) {
            alert("No user found. Please login again. ❌");
            return;
        }

        const user = JSON.parse(storedData);
        if (!user._id) {
            alert("User ID missing. Please login again. ❌");
            return;
        }

        // 2. Prepare Form Data
        const formData = new FormData();
        formData.append("profile", file); // Must match backend: upload.single("profile")
        formData.append("userId", user._id);

        try {
            const res = await fetch("http://localhost:5000/api/upload-profile", {
                method: "POST",
                body: formData,
                // Note: Do NOT set Content-Type header manually when sending FormData
            });

            const data = await res.json();

            if (res.ok) {
                // 3. Update local state
                setProfileImage(data.imageUrl);

                // 4. Update localStorage so the change persists on refresh
                const updatedUser = { ...user, profilePic: data.imageUrl };
                localStorage.setItem("chatapp-user", JSON.stringify(updatedUser));
                
                console.log("Profile Updated!");
            } else {
                console.log("Upload failed!");
            }
        } catch (err) {
            console.error("Upload error:", err);
            console.log("Server connection error ❌");
        }
    };

    return (
        <div className="p-2">
            <input
                type="file"
                ref={profileRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div
                onClick={() => profileRef.current.click()}
                className="group relative cursor-pointer w-12 h-12 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 hover:border-yellow-400 transition-all"
            >
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <CgProfile size={25} className="text-zinc-400" />
                )}
            </div>
        </div>
    );
}

// ---------------- MAIN HEADER COMPONENT ----------------
const WhatsAppHeader = () => {
    const [activeTab, setActiveTab] = useState('chats');
    const galleryRef = useRef();

    const navItems = [
        { id: 'chats', icon: <MdMarkUnreadChatAlt size={25} hasBadge={true} /> },
    ];

    return (
        <header className="hidden md:flex flex-col h-screen w-16 bg-chat-panel border-r border-chat-border py-4 items-center justify-between">
            
            {/* Top Navigation */}
            <div className="flex flex-col gap-4 w-full px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`relative w-12 h-12 rounded-full  transition-all cursor-pointer flex justify-center items-center
                        ${activeTab === item.id ? 'bg-chat-iconHover/15 text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                    >
                        {item.icon}
                        {item.hasBadge && (
                            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-green-400 rounded-full" />
                        )}
                    </button>
                ))}
                <hr className="border border-chat-border my-2" />
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 items-center mb-2">
                
                {/* Gallery Button */}
                <input type="file" ref={galleryRef} className="hidden" accept="image/*" />
                <button
                    onClick={() => galleryRef.current.click()}
                    className="text-zinc-400 rounded-full hover:bg-chat-iconHover/15 hover:text-black/70  cursor-pointer p-4 transition-colors "
                >
                    <GrGallery size={22} />
                </button>

                {/* Profile Section */}
                <ProfileUpload />
            </div>
        </header>
    );
};

export default WhatsAppHeader;