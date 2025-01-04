import { Message } from '../types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

interface ChatMessagesProps {
  messages: Message[]
  isLoading?: boolean
}

export const ChatMessages = ({ messages, isLoading = false }: ChatMessagesProps) => {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
        Aucun message. Commencez la conversation !
      </div>
    )
  }

  return (
    <ScrollArea className="h-full pr-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 ${
            message.is_admin
              ? 'ml-auto text-right'
              : 'mr-auto'
          }`}
        >
          <div
            className={`inline-block rounded-lg px-4 py-2 max-w-[90%] ${
              message.is_admin
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {message.content}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date(message.created_at).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}