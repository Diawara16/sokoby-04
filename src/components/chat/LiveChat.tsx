import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  is_admin: boolean
  created_at: string
  user_id: string
}

export function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Charger les messages existants
    const loadMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erreur lors du chargement des messages:', error)
        return
      }

      setMessages(data)
    }

    loadMessages()

    // Souscrire aux nouveaux messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un message",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase
      .from('chat_messages')
      .insert([
        {
          content: newMessage,
          user_id: user.id,
        }
      ])

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      })
      return
    }

    setNewMessage('')
  }

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
    <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Support Client</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
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
                className={`inline-block rounded-lg px-4 py-2 ${
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
      </CardContent>
      <CardFooter>
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Votre message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}