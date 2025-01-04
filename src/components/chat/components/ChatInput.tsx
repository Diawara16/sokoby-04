import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface ChatInputProps {
  newMessage: string
  setNewMessage: (message: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const ChatInput = ({ newMessage, setNewMessage, onSubmit }: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Votre message..."
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!newMessage.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}