
import { useState } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  read?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  profileImage: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Marc Demo',
      profileImage: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Hi there! I\'d love to connect on that Illustrator skill swap.',
      timestamp: '2 min ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Sarah Chen',
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Great! When can we start the React sessions?',
      timestamp: '1 hour ago',
      unread: 0,
      online: true
    },
    {
      id: '3',
      name: 'David Johnson',
      profileImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Thanks for the photography tips!',
      timestamp: '2 days ago',
      unread: 0,
      online: false
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: 'other',
      content: 'Hi there! I\'d love to connect on that Illustrator skill swap.',
      timestamp: '10:30 AM',
      read: true
    },
    {
      id: '2',
      sender: 'other',
      content: 'I saw your JavaScript skills and would really appreciate learning from you. In return, I can teach you advanced Illustrator techniques and design principles.',
      timestamp: '10:32 AM',
      read: true
    },
    {
      id: '3',
      sender: 'me',
      content: 'That sounds great! I\'ve been wanting to improve my design skills for a while now.',
      timestamp: '10:45 AM',
      read: true
    },
    {
      id: '4',
      sender: 'me',
      content: 'When would be a good time to start? I\'m free most evenings this week.',
      timestamp: '10:46 AM',
      read: true
    },
    {
      id: '5',
      sender: 'other',
      content: 'Perfect! How about we start tomorrow at 7 PM? We can do a video call to plan out our exchange.',
      timestamp: '11:15 AM',
      read: false
    }
  ];

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              {currentConversation && (
                <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentConversation.profileImage} />
                    <AvatarFallback>{currentConversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-lg">{currentConversation.name}</h2>
                    <div className="flex items-center space-x-1">
                      <Circle className={`h-2 w-2 ${currentConversation.online ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`} />
                      <span className="text-xs text-muted-foreground">
                        {currentConversation.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-foreground">Skill Swap Platform</h1>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List - Hidden on mobile when chat is selected */}
        <div className={`w-full md:w-80 border-r border-border bg-background ${selectedConversation ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-lg">Messages</h3>
          </div>
          
          <div className="overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.profileImage} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <Circle className="absolute -bottom-1 -right-1 h-4 w-4 fill-green-500 text-green-500 bg-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">{conversation.name}</h4>
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col ${selectedConversation ? 'block' : 'hidden md:block'}`}>
          {selectedConversation ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome Message */}
                <div className="text-center py-4">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">
                        This is the beginning of your conversation with {currentConversation?.name}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground/70'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
