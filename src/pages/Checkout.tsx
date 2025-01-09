import React, { useState } from 'react';
import { useCart } from '@/components/cart/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from '@/lib/supabase';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { AddressForm, addressSchema } from '@/components/checkout/AddressForm';
import { PaymentSection } from '@/components/checkout/PaymentSection';

const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
      billingAddress: {
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
      },
    },
  });

  const createOrder = async (formData: CheckoutFormValues) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour passer une commande",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: state.total,
            shipping_address: formData.shippingAddress,
            billing_address: formData.billingAddress,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = state.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(order.id);

    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await clearCart();
    navigate(`/orders/${orderId}`);
    toast({
      title: "Commande créée",
      description: "Votre commande a été créée avec succès",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createOrder)} className="space-y-8">
          <OrderSummary state={state} />
          
          <AddressForm 
            form={form}
            type="shipping"
            title="Adresse de livraison"
          />

          <AddressForm 
            form={form}
            type="billing"
            title="Adresse de facturation"
          />

          <PaymentSection 
            total={state.total}
            isLoading={isLoading}
            orderId={orderId}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </form>
      </Form>
    </div>
  );
};

export default Checkout;