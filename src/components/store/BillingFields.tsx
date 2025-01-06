import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface BillingFieldsProps {
  vatNumber: string;
  vatRate: number;
  invoicePrefix: string;
  invoiceFooter: string;
  invoiceLegalNotice: string;
  invoiceTemplate: Record<string, boolean>;
  onChange: (field: string, value: string | number | boolean | Record<string, boolean>) => void;
}

export const BillingFields = ({
  vatNumber,
  vatRate,
  invoicePrefix,
  invoiceFooter,
  invoiceLegalNotice,
  invoiceTemplate,
  onChange,
}: BillingFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="vat_number">Numéro de TVA</Label>
        <Input
          id="vat_number"
          value={vatNumber || ''}
          onChange={(e) => onChange('vat_number', e.target.value)}
          placeholder="FR12345678900"
        />
      </div>

      <div>
        <Label htmlFor="vat_rate">Taux de TVA (%)</Label>
        <Input
          id="vat_rate"
          type="number"
          value={vatRate || 20}
          onChange={(e) => onChange('vat_rate', parseFloat(e.target.value))}
          min={0}
          max={100}
          step={0.1}
        />
      </div>

      <div>
        <Label htmlFor="invoice_prefix">Préfixe des factures</Label>
        <Input
          id="invoice_prefix"
          value={invoicePrefix || 'INV-'}
          onChange={(e) => onChange('invoice_prefix', e.target.value)}
          placeholder="INV-"
        />
      </div>

      <div>
        <Label htmlFor="invoice_footer">Pied de page des factures</Label>
        <Textarea
          id="invoice_footer"
          value={invoiceFooter || ''}
          onChange={(e) => onChange('invoice_footer_text', e.target.value)}
          placeholder="Mentions légales, coordonnées bancaires..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="invoice_legal">Mentions légales</Label>
        <Textarea
          id="invoice_legal"
          value={invoiceLegalNotice || ''}
          onChange={(e) => onChange('invoice_legal_notice', e.target.value)}
          placeholder="Mentions légales obligatoires..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Options de facture</Label>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="invoice_header" className="cursor-pointer">En-tête</Label>
            <Switch
              id="invoice_header"
              checked={invoiceTemplate?.header || false}
              onCheckedChange={(checked) => 
                onChange('invoice_template', { ...invoiceTemplate, header: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="invoice_logo" className="cursor-pointer">Logo</Label>
            <Switch
              id="invoice_logo"
              checked={invoiceTemplate?.logo || false}
              onCheckedChange={(checked) => 
                onChange('invoice_template', { ...invoiceTemplate, logo: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="invoice_footer_toggle" className="cursor-pointer">Pied de page</Label>
            <Switch
              id="invoice_footer_toggle"
              checked={invoiceTemplate?.footer || false}
              onCheckedChange={(checked) => 
                onChange('invoice_template', { ...invoiceTemplate, footer: checked })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};