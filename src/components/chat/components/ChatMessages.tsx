import { Message } from '../types'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatMessagesProps {
  messages: Message[]
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
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