import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchChatEligibleUsers, chatActions } from '../../redux/slice/chatSlice';
import Spinner from '../publilc/Spinner';

const ChatPage = () => {
    const dispatch = useDispatch();
    const [activeContact, setActiveContact] = useState(null); 
    const [messageInput, setMessageInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);

    const { contacts, messages, isConnected, loading } = useSelector(state => state.chat);
    const currentUser = useSelector(state => state.auth.user);

    // Fetch contacts once on mount
    useEffect(() => {
        dispatch(FetchChatEligibleUsers());
    }, [dispatch]);

    // Scroll to bottom whenever messages array updates
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle WebSocket Connection
    useEffect(() => {
        if (activeContact?.chat_token && activeContact?.room_name) {
            // Connect to the new room
            dispatch({
                type: 'chat/connect',
                payload: {
                    roomName: activeContact.room_name,
                    chatToken: activeContact.chat_token
                }
            });
        }

        // Cleanup: Disconnect when switching users or unmounting
        return () => { 
            dispatch({ type: 'chat/disconnect' }); 
        };
    }, [activeContact?.room_name, dispatch]); // Only trigger when the room_name changes

    const handleSend = (e) => {
        e.preventDefault();
        const trimmedMsg = messageInput.trim();
        if (trimmedMsg && isConnected) {
            dispatch({ type: 'chat/sendMessage', payload: trimmedMsg });
            setMessageInput("");
        }
    };

    const formatTime = (timeData) => {
        if (!timeData) return "Just now";
        const date = new Date(timeData);
        return isNaN(date.getTime()) 
            ? "Just now" 
            : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const filteredContacts = contacts?.filter(c => 
        c.other_party_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (loading && (!contacts || contacts.length === 0)) return <Spinner />;


    return (
        <div className="flex h-screen overflow-hidden bg-[#f8f8f5] font-[Manrope]">
        {/* Conversation List */}
        <div className="w-[380px] border-r border-[#e5e5e0] bg-white flex flex-col">
            <div className="p-6 border-b border-[#e5e5e0]">
                <h2 className="text-2xl font-bold mb-4 text-[#181811]">Messages</h2>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c5f] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        className="w-full bg-[#f5f5f0] border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#8ad007] focus:outline-none"
                        placeholder="Search conversations..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-[#8c8c5f] text-sm">
                        No conversations found
                    </div>
                ) : (
                    filteredContacts.map(contact => {
                        const contactId = contact.room_name; // Use room_name as the unique key
                        const isActive = activeContact?.room_name === contactId;
                        
                        const userImage = contact.other_party_profile_image; 
                        const displayName = contact.other_party_name || 'Unknown User';
    
                        return (
                            <div
                                key={contactId}
                                onClick={() => setActiveContact(contact)}
                                className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${
                                    isActive
                                        ? 'bg-[#8ad007]/5 border-l-4 border-[#8ad007]'
                                        : 'hover:bg-[#f5f5f0]'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    {userImage ? (
                                        <img 
                                            src={userImage} 
                                            alt={displayName}
                                            className="w-12 h-12 rounded-full object-cover border border-[#e5e5e0]"
                                            onError={(e) => { e.target.style.display='none'; }} 
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8ad007] to-[#6fb005] flex items-center justify-center text-white font-bold text-lg">
                                            {displayName[0].toUpperCase()}
                                        </div>
                                    )}
    
                                    {/* Status dot: Only show active green if this specific contact is the one we are connected to */}
                                    {isConnected && isActive && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                    )}
                                </div>
    
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-sm truncate text-[#181811]">
                                            {displayName}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-[#8c8c5f] truncate">
                                        {contact.last_message || "Click to start chatting"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    
        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
            {activeContact ? (
                <>
                    {/* Chat Header */}
                    <header className="h-20 border-b border-[#e5e5e0] flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                                {activeContact.other_party_profile_image ? (
                                    <img 
                                        src={activeContact.other_party_profile_image} 
                                        alt={activeContact.other_party_name}
                                        className="w-12 h-12 rounded-full object-cover border border-[#e5e5e0]"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8ad007] to-[#6fb005] flex items-center justify-center text-white font-bold text-lg">
                                        {(activeContact?.other_party_name || 'U')[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-[#181811]">
                                    {activeContact.other_party_name || 'Unknown User'}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="text-[10px] text-[#8c8c5f] font-medium uppercase tracking-tight">
                                        {isConnected ? 'Connected' : 'Connecting...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-[#8c8c5f] hover:bg-[#f5f5f0] rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </button>
                            <button className="p-2 text-[#8c8c5f] hover:bg-[#f5f5f0] rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <button className="p-2 text-[#8c8c5f] hover:bg-[#f5f5f0] rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </header>
    
                    {/* Message Thread */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {!isConnected && messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8ad007] mb-4"></div>
                                    <p className="text-[#8c8c5f] text-sm">Loading chat history...</p>
                                </div>
                            </div>
                        ) : isConnected && messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#f5f5f0] flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-[#8c8c5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-[#181811] font-semibold mb-1">No messages yet</p>
                                    <p className="text-[#8c8c5f] text-sm">Say hello to start the conversation!</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center">
                                    <span className="bg-[#f5f5f0] px-3 py-1 rounded-full text-[10px] font-bold text-[#8c8c5f] uppercase tracking-wider">
                                        Chat History
                                    </span>
                                </div>
    
                                {messages.map((m, i) => {
                                    // Match against current user ID from auth state
                                    const isMe = Number(m.sender_id) === Number(currentUser?.id || currentUser?.user_id);
                                    const displayMessage = m.message || m.content || "";
    
                                    return (
                                        <div 
                                            key={m.id || i} 
                                            className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[70%] w-full`}
                                        >
                                            <div className={`p-4 rounded-xl text-sm leading-relaxed ${
                                                isMe 
                                                    ? 'bg-[#8ad007] text-white rounded-br-sm font-medium' 
                                                    : 'bg-[#f1f1f1] text-[#181811] rounded-bl-sm'
                                            } break-all whitespace-pre-wrap`}>
                                                {displayMessage}
                                            </div>
                                            
                                            <div className={`flex items-center gap-1 mt-1.5 ${isMe ? 'mr-1' : 'ml-1'}`}>
                                                <span className="text-[10px] text-[#8c8c5f]">
                                                    {formatTime(m.timestamp)}
                                                </span>
                                                {isMe && (
                                                    <svg className="w-3.5 h-3.5 text-[#8ad007]" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
    
                    {/* Message Composer */}
                    <div className="p-6 bg-white border-t border-[#e5e5e0]">
                        <form onSubmit={handleSend}>
                            <div className="flex items-center gap-4 bg-[#f5f5f0] rounded-2xl p-2 pl-4 pr-2">
                                <button 
                                    type="button"
                                    className="p-2 text-[#8c8c5f] hover:text-[#8ad007] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>
                                <input
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-sm placeholder:text-[#8c8c5f]"
                                    placeholder={isConnected ? "Type a message..." : "Connecting..."}
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    disabled={!isConnected}
                                />
                                <button 
                                    type="button"
                                    className="p-2 text-[#8c8c5f] hover:text-[#8ad007] transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <button 
                                    type="submit"
                                    disabled={!isConnected || !messageInput.trim()}
                                    className="bg-[#8ad007] hover:opacity-90 transition-opacity w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#8ad007]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                        <div className="flex justify-center mt-3">
                            <p className="text-[10px] text-[#8c8c5f] font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Messages are encrypted and professional standards apply.
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-[#f5f5f0] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-[#8c8c5f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-[#181811] font-bold text-lg mb-2">Select a conversation</h3>
                        <p className="text-[#8c8c5f] text-sm">Choose a user from the list to start chatting</p>
                    </div>
                </div>
            )}
        </div>
    </div>
    );
};

export default ChatPage;