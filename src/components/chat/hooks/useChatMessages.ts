import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Message } from '../types'

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadMessages = async () => {
      if (!isOpen) return

      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          toast({
            title: "Non connecté",
            description: "Vous devez être connecté pour utiliser le chat",
            variant: "destructive",
          })
          return
        }

        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Erreur lors du chargement des messages:', error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les messages. Veuillez réessayer.",
            variant: "destructive",
          })
          return
        }

        setMessages(data || [])
      } catch (error) {
        console.error('Erreur inattendue:', error)
        toast({
          title: "Erreur",
          description: "Une erreur inattendue est survenue",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      loadMessages()
    }

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
          const newMessage = payload.new as Message
          setMessages((current) => [...current, newMessage])
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Abonné aux changements en temps réel')
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Erreur de connexion au canal temps réel')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen, toast])

  return { messages, isLoading }
}