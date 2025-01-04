import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useChatMessages } from './hooks/useChatMessages'
import { useSendMessage } from './hooks/useSendMessage'
import { ChatMessages } from './components/ChatMessages'
import { ChatInput } from './components/ChatInput'

// Créer une nouvelle instance de QueryClient en dehors du composant
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const ChatComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, isLoading } = useChatMessages(isOpen)
  const { newMessage, setNewMessage, sendMessage } = useSendMessage()

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Support Client</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSubmit={sendMessage}
        />
      </CardFooter>
    </Card>
  )
}

export function LiveChat() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatComponent />
    </QueryClientProvider>
  )
}