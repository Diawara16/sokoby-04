import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShopifyConnection } from "@/hooks/useShopifyConnection";
import { Loader2 } from "lucide-react";

interface ShopifyConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutUrl?: string;
}

export const ShopifyConnectDialog = ({
  open,
  onOpenChange,
  checkoutUrl,
}: ShopifyConnectDialogProps) => {
  const [shopDomain, setShopDomain] = useState("");
  const { isConnecting, connectShopify } = useShopifyConnection();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    await connectShopify(shopDomain, checkoutUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Shopify Store</DialogTitle>
          <DialogDescription>
            Enter your Shopify store domain to connect and authorize access
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopDomain">Shopify Store Domain</Label>
            <Input
              id="shopDomain"
              type="text"
              placeholder="your-store.myshopify.com"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              required
              disabled={isConnecting}
            />
            <p className="text-sm text-muted-foreground">
              Enter your Shopify store URL (e.g., your-store.myshopify.com)
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isConnecting || !shopDomain}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Store"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
