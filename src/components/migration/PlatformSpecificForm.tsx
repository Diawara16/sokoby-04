
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ExternalLink, Key, Database } from "lucide-react";

interface PlatformFormData {
  store_url: string;
  access_token?: string;
  api_key?: string;
  username?: string;
  password?: string;
  database_host?: string;
  database_name?: string;
  admin_url?: string;
  notes: string;
}

interface PlatformSpecificFormProps {
  platform: string;
  formData: PlatformFormData;
  onChange: (data: Partial<PlatformFormData>) => void;
}

const platformConfigs = {
  shopify: {
    title: "Configuration Shopify",
    description: "Connectez votre boutique Shopify pour commencer la migration",
    fields: [
      { key: 'store_url', label: 'URL de votre boutique Shopify', type: 'url', placeholder: 'https://votre-boutique.myshopify.com', required: true },
      { key: 'access_token', label: 'Private App Token (optionnel)', type: 'password', placeholder: 'shppa_...', required: false }
    ],
    instructions: "Votre URL Shopify se trouve dans votre admin Shopify. Le token privé accélère la migration mais n'est pas obligatoire."
  },
  woocommerce: {
    title: "Configuration WooCommerce",
    description: "Connectez votre site WooCommerce WordPress",
    fields: [
      { key: 'store_url', label: 'URL de votre site WordPress', type: 'url', placeholder: 'https://votre-site.com', required: true },
      { key: 'api_key', label: 'Clé API WooCommerce', type: 'password', placeholder: 'ck_...', required: false },
      { key: 'username', label: 'Nom d\'utilisateur admin WordPress', type: 'text', placeholder: 'admin', required: false }
    ],
    instructions: "Nous aurons besoin d'un accès administrateur à votre WordPress pour exporter vos données WooCommerce."
  },
  bigcommerce: {
    title: "Configuration BigCommerce",
    description: "Connectez votre boutique BigCommerce",
    fields: [
      { key: 'store_url', label: 'URL de votre boutique BigCommerce', type: 'url', placeholder: 'https://votre-boutique.mybigcommerce.com', required: true },
      { key: 'access_token', label: 'API Access Token', type: 'password', placeholder: 'Bearer token...', required: false }
    ],
    instructions: "Vous pouvez générer un token API dans votre panneau BigCommerce sous Advanced Settings > API Accounts."
  },
  squarespace: {
    title: "Configuration Squarespace",
    description: "Connectez votre site Squarespace Commerce",
    fields: [
      { key: 'store_url', label: 'URL de votre site Squarespace', type: 'url', placeholder: 'https://votre-site.squarespace.com', required: true },
      { key: 'username', label: 'Email de connexion Squarespace', type: 'email', placeholder: 'votre@email.com', required: false }
    ],
    instructions: "Squarespace a des API limitées. Notre équipe vous contactera pour coordonner l'export manuel des données."
  },
  magento: {
    title: "Configuration Magento 2",
    description: "Connectez votre installation Magento",
    fields: [
      { key: 'store_url', label: 'URL de votre boutique Magento', type: 'url', placeholder: 'https://votre-boutique.com', required: true },
      { key: 'admin_url', label: 'URL admin Magento', type: 'url', placeholder: 'https://votre-boutique.com/admin', required: false },
      { key: 'api_key', label: 'Integration Token', type: 'password', placeholder: 'Token d\'intégration...', required: false },
      { key: 'database_host', label: 'Host de base de données', type: 'text', placeholder: 'localhost', required: false },
      { key: 'database_name', label: 'Nom de la base de données', type: 'text', placeholder: 'magento_db', required: false }
    ],
    instructions: "Magento étant complexe, plusieurs méthodes d'accès sont possibles. Notre équipe déterminera la meilleure approche."
  },
  volusion: {
    title: "Configuration Volusion",
    description: "Connectez votre boutique Volusion",
    fields: [
      { key: 'store_url', label: 'URL de votre boutique Volusion', type: 'url', placeholder: 'https://votre-boutique.volusion.com', required: true },
      { key: 'username', label: 'Nom d\'utilisateur admin', type: 'text', placeholder: 'admin', required: false },
      { key: 'api_key', label: 'API Key (si disponible)', type: 'password', placeholder: 'API key...', required: false }
    ],
    instructions: "Volusion utilise principalement des exports CSV. Notre équipe vous guidera dans le processus d'export."
  }
};

export const PlatformSpecificForm = ({ platform, formData, onChange }: PlatformSpecificFormProps) => {
  const config = platformConfigs[platform as keyof typeof platformConfigs];
  
  if (!config) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Plateforme non supportée</h3>
          <p className="text-gray-600">Cette plateforme n'est pas encore supportée. Contactez-nous pour une migration personnalisée.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-red-600" />
          {config.title}
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.key}>
            <Label htmlFor={field.key}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={field.key}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.key as keyof PlatformFormData] || ''}
              onChange={(e) => onChange({ [field.key]: e.target.value })}
              required={field.required}
            />
          </div>
        ))}
        
        <div>
          <Label htmlFor="notes">Notes spéciales (optionnel)</Label>
          <Textarea
            id="notes"
            placeholder="Informations complémentaires sur votre configuration..."
            value={formData.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            rows={3}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Instructions importantes</h4>
              <p className="text-sm text-blue-700">{config.instructions}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
