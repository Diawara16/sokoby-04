import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useSendMessage = () => {
  const [newMessage, setNewMessage] = useState('')
  const { toast } = useToast()

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      console.log('Tentative d\'envoi du message...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', userError)
        toast({
          title: "Erreur",
          description: "Impossible de vérifier l'authentification",
          variant: "destructive",
        })
        return
      }

      if (!user) {
        console.log('Utilisateur non connecté')
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour envoyer un message",
          variant: "destructive",
        })
        return
      }

      console.log('Envoi du message pour l\'utilisateur:', user.id)
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            content: newMessage,
            user_id: user.id,
            is_admin: false
          }
        ])

      if (error) {
        console.error('Erreur lors de l\'envoi du message:', error)
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message",
          variant: "destructive",
        })
        return
      }

      console.log('Message envoyé avec succès')
      setNewMessage('')
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    }
  }

  return { newMessage, setNewMessage, sendMessage }
}