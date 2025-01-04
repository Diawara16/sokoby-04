import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Message } from '../types'

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<Message[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const loadMessages = async () => {
      try {
        console.log('Tentative de récupération de l\'utilisateur...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', userError)
          return
        }

        if (!user) {
          console.log('Aucun utilisateur connecté')
          return
        }

        console.log('Utilisateur récupéré:', user.id)
        console.log('Tentative de récupération des messages...')

        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })

        if (error) {
          console.error('Erreur lors du chargement des messages:', error)
          toast({
            title: "Erreur",
            description: "Impossible de charger les messages",
            variant: "destructive",
          })
          return
        }

        console.log('Messages récupérés:', data)
        setMessages(data || [])
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement des messages",
          variant: "destructive",
        })
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
          console.log('Nouveau message reçu:', payload)
          const newMessage = payload.new as Message
          setMessages((current) => [...current, newMessage])
        }
      )
      .subscribe()

    return () => {
      console.log('Nettoyage du channel de chat')
      supabase.removeChannel(channel)
    }
  }, [isOpen, toast])

  return { messages }
}