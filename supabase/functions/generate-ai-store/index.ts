import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// PRODUCTION-QUALITY product images by niche (curated Unsplash photos)
const nicheImages: Record<string, string[]> = {
  fashion: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&h=800&fit=crop',
  ],
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1574920162043-b872873f19c8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&h=800&fit=crop',
  ],
  home: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1584380931214-dbb5b72e7fd0?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=800&h=800&fit=crop',
  ],
  kids: [
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1546942113-a6c43b63104a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1569067838972-2fb9fe3d8c1c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594467141993-cda5fde71fcf?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1610715176630-e19e8ba6df5e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=800&fit=crop',
  ],
  books: [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1502465771179-51f3535da42c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=800&fit=crop',
  ],
  general: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055uj8bb89e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
  ],
};

// Niche-specific product catalog with UNIQUE products per niche
const nicheProducts: Record<string, { names: string[], descriptions: string[], prices: number[] }> = {
  fashion: {
    names: [
      'T-Shirt Premium Coton Bio', 'Jean Slim Fit Stretch', 'Sneakers Classic White', 'Veste Cuir Vintage',
      'Robe Été Florale', 'Pull Mérinos Luxe', 'Short Casual Lin', 'Chemise Oxford Premium',
      'Manteau Laine Hiver', 'Ceinture Cuir Italien', 'Blazer Smart Casual', 'Pantalon Chino Confort',
      'Polo Sport Élégant', 'Cardigan Oversize', 'Jupe Midi Plissée', 'Sweat-shirt Logo Brodé',
      'Débardeur Sport Femme', 'Costume Slim Fit Moderne', 'Robe de Soirée Glamour', 'Parka Imperméable',
    ],
    descriptions: [
      'T-shirt 100% coton biologique certifié GOTS. Coupe moderne et confortable. Coutures renforcées.',
      'Jean stretch premium coupe ajustée. Tissu denim japonais. Finitions haut de gamme.',
      'Sneakers classiques cuir véritable. Semelle caoutchouc antidérapante. Confort optimal.',
      'Veste cuir pleine fleur. Doublure satin matelassée. Style intemporel vintage.',
      'Robe légère imprimé floral exclusif. Tissu respirant. Parfaite pour les beaux jours.',
      'Pull laine mérinos extra-fine. Douceur incomparable. Thermorégulation naturelle.',
      'Short décontracté 100% lin naturel. Poches fonctionnelles. Confort estival.',
      'Chemise coton égyptien premium. Coupe ajustée moderne. Finitions soignées.',
      'Manteau laine mélangée isolation thermique. Coupe élégante. Boutons nacre.',
      'Ceinture cuir italien pleine grain. Boucle métal poli. Artisanat traditionnel.',
      'Blazer coupe moderne tissu premium. Versatile casual-chic. Confort stretch.',
      'Pantalon chino stretch confortable. Coupe régulière. Tissu résistant.',
      'Polo piqué coton premium. Détails sport élégants. Respirant et confortable.',
      'Cardigan oversize maille douce. Style contemporain. Boutons corne naturelle.',
      'Jupe midi plissée fluide. Taille élastiquée. Élégance quotidienne.',
      'Sweat-shirt logo brodé main. Coton fleece premium. Coupe relaxed.',
      'Débardeur sport tissu technique. Évacuation humidité. Liberté de mouvement.',
      'Costume slim fit laine fine. Coupe moderne italienne. Élégance professionnelle.',
      'Robe de soirée satin luxueux. Coupe flatteuse. Détails raffinés.',
      'Parka imperméable respirante. Capuche amovible. Protection toutes saisons.',
    ],
    prices: [29.99, 89.99, 119.99, 249.99, 69.99, 89.99, 49.99, 79.99, 199.99, 59.99, 149.99, 69.99, 49.99, 79.99, 59.99, 54.99, 34.99, 299.99, 179.99, 149.99],
  },
  electronics: {
    names: [
      'Écouteurs Sans Fil Pro ANC', 'Chargeur Rapide GaN 65W', 'Coque Protection MagSafe', 'Câble USB-C Tressé 2m',
      'Support Téléphone Articulé', 'Power Bank 20000mAh PD', 'Hub USB-C 7-en-1', 'Webcam 4K HDR Pro',
      'Clavier Mécanique Bluetooth', 'Souris Gaming Ergonomique', 'Station de Charge Sans Fil', 'Enceinte Bluetooth Waterproof',
      'Casque Gaming Surround 7.1', 'Microphone USB Studio', 'Lampe LED Bureau Smart', 'Tapis Souris XL RGB',
      'Adaptateur Multi-Port Travel', 'Tracker GPS Compact', 'Ring Light Professionnel', 'SSD Portable 1TB',
    ],
    descriptions: [
      'Écouteurs Bluetooth 5.3 avec réduction de bruit active -40dB. Autonomie 30h. Son Hi-Res.',
      'Chargeur rapide technologie GaN. Compatible USB-C/Lightning. Protection intelligente.',
      'Coque protection MagSafe compatible. Antichoc coins renforcés. Charge sans fil.',
      'Câble USB-C tressé nylon résistant. Transfert 100W. Certification USB-IF.',
      'Support ajustable 360° aluminium. Fixation solide. Compatible toutes tailles.',
      'Batterie externe 20000mAh Power Delivery 65W. 2 ports USB. Charge rapide.',
      'Hub 7-en-1 premium: HDMI 4K, 3x USB-A, USB-C, SD, microSD. Boîtier aluminium.',
      'Webcam 4K HDR capteur Sony. Autofocus. Correction lumière IA. Micro intégré.',
      'Clavier mécanique switches tactiles. Rétroéclairage RGB. Multi-appareils.',
      'Souris gaming capteur optique 25000 DPI. 8 boutons programmables. Ergonomique.',
      'Station charge 3-en-1 iPhone/Watch/AirPods. Charge rapide 15W. Design épuré.',
      'Enceinte Bluetooth IP67 étanche. Son 360° puissant. Autonomie 24h.',
      'Casque gaming son surround 7.1 virtuel. Micro rétractable. Confort longue durée.',
      'Microphone USB qualité studio. Condensateur cardioïde. Podcast/streaming.',
      'Lampe bureau LED température réglable. Contrôle tactile. Chargeur intégré.',
      'Tapis souris XL 90x40cm éclairage RGB. Surface optimisée. Antidérapant.',
      'Adaptateur voyage international 4 prises. USB-A/C. Protection surtension.',
      'Tracker GPS miniature. Localisation temps réel. Autonomie 7 jours.',
      'Ring light 12 pouces réglable. 3 modes éclairage. Support smartphone inclus.',
      'SSD externe 1TB USB 3.2. Lectures 1050MB/s. Résistant aux chocs.',
    ],
    prices: [89.99, 39.99, 29.99, 19.99, 24.99, 59.99, 49.99, 129.99, 99.99, 79.99, 69.99, 59.99, 89.99, 79.99, 49.99, 39.99, 34.99, 29.99, 44.99, 119.99],
  },
  beauty: {
    names: [
      'Sérum Visage Vitamine C', 'Crème Hydratante 24H', 'Masque Argile Purifiant', 'Huile Essentielle Bio Lavande',
      'Gommage Visage Enzymes', 'Lotion Tonique Rose', 'Baume Lèvres Nutrition', 'Soin Nuit Régénérant',
      'Protection Solaire SPF50', 'Eau Micellaire Pure', 'Sérum Acide Hyaluronique', 'Crème Contour Yeux',
      'Masque Tissu Éclat', 'Huile Visage Or Rose', 'Brume Hydratante', 'Palette Maquillage Pro',
      'Rouge à Lèvres Longue Tenue', 'Fond de Teint Naturel', 'Mascara Volume XXL', 'Parfum Signature',
    ],
    descriptions: [
      'Sérum concentré 20% vitamine C stabilisée. Antioxydant puissant. Éclat visible en 14 jours.',
      'Crème hydratation intense 24h. Acide hyaluronique multi-poids. Tous types de peau.',
      'Masque argile verte purifiante. Nettoie pores en profondeur. Formule naturelle.',
      'Huile essentielle lavande 100% pure bio. Relaxante et apaisante. Certifiée ECOCERT.',
      'Gommage enzymatique doux papaye/ananas. Exfoliation sans grains. Teint lumineux.',
      'Lotion tonique eau de rose de Damas. Sans alcool. Resserre les pores.',
      'Baume lèvres ultra-nourrissant karité et miel. Réparation intensive. Texture fondante.',
      'Soin nuit régénérant rétinol encapsulé. Anti-âge avancé. Réveil peau neuve.',
      'Écran solaire SPF50+ invisible. Protection UVA/UVB. Formule non grasse.',
      'Eau micellaire triple action. Démaquillage doux. Hydratation. Sans rinçage.',
      'Sérum acide hyaluronique pur. Repulpant intensif. Absorption rapide.',
      'Crème contour yeux peptides et caféine. Anti-cernes. Défatiguant.',
      'Masque tissu imprégnés essence éclat. Vitamine C et niacinamide. Usage unique.',
      'Huile visage or rose luxueuse. Nourrissante et lumineuse. Huiles précieuses.',
      'Brume hydratante rafraîchissante. Fixateur maquillage. Parfum délicat.',
      'Palette 24 couleurs professionnelle. Fards mats et shimmer. Haute pigmentation.',
      'Rouge à lèvres liquide 12h tenue. Finition velours. Formule confortable.',
      'Fond de teint naturel couvrance modulable. 40 teintes. Fini peau naturelle.',
      'Mascara volume XXL brosse courbe. Effet faux-cils. Formule waterproof.',
      'Eau de parfum signature. Notes florales boisées. Sillage élégant.',
    ],
    prices: [54.99, 39.99, 24.99, 19.99, 29.99, 24.99, 14.99, 64.99, 29.99, 19.99, 49.99, 44.99, 9.99, 59.99, 24.99, 49.99, 24.99, 39.99, 29.99, 89.99],
  },
  home: {
    names: [
      'Lampe Design Scandinave', 'Coussin Velours Luxe', 'Vase Céramique Artisanal', 'Cadre Photo Bois Massif',
      'Bougie Parfumée Naturelle', 'Tapis Berbère Authentique', 'Miroir Rond Doré', 'Horloge Murale Minimaliste',
      'Plaid Tricot Cosy', 'Set Table Lin Premium', 'Pot Plante Terracotta', 'Étagère Flottante Chêne',
      'Panier Rangement Osier', 'Diffuseur Parfum Bambou', 'Statue Déco Moderne', 'Plateau Service Marbre',
      'Suspension Rotin Naturel', 'Boîte Rangement Design', 'Dessous de Verre Liège', 'Porte-Manteau Mural',
    ],
    descriptions: [
      'Lampe design nordique. Abat-jour lin naturel. Base bois de hêtre. Lumière douce.',
      'Coussin velours doux 45x45cm. Garnissage fibres recyclées. Élégance raffinée.',
      'Vase céramique fait main. Finition mate organique. Pièce unique artisanale.',
      'Cadre photo bois massif chêne. Multi-formats. Finition naturelle.',
      'Bougie parfumée cire végétale. Mèche coton. 50h combustion. Parfum délicat.',
      'Tapis berbère tissage traditionnel. Laine naturelle. Motifs géométriques.',
      'Miroir rond cadre métal doré. Ø60cm. Style art déco contemporain.',
      'Horloge murale design minimaliste. Mécanisme silencieux. Noir mat.',
      'Plaid tricot grosse maille. Acrylique doux. Confort cocooning.',
      'Set 4 sets de table lin lavé. 35x50cm. Élégance naturelle.',
      'Pot plante terracotta artisanal. Drainage optimal. Style méditerranéen.',
      'Étagère flottante chêne massif. Fixation invisible. Minimalisme élégant.',
      'Panier rangement osier tressé main. Multi-usages. Naturel et pratique.',
      'Diffuseur parfum tiges bambou. Huiles essentielles. Parfum longue durée.',
      'Statue décorative résine. Design contemporain abstrait. Finition mate.',
      'Plateau service marbre véritable. Poignées laiton. Élégance intemporelle.',
      'Suspension luminaire rotin naturel. Tressage artisanal. Ambiance bohème.',
      'Boîtes rangement design empilables. Carton recyclé. Organisation stylée.',
      'Dessous de verre liège naturel. Set de 6. Absorbants et écologiques.',
      'Porte-manteau mural design. Métal noir mat. 5 crochets modernes.',
    ],
    prices: [89.99, 39.99, 49.99, 29.99, 34.99, 199.99, 79.99, 44.99, 59.99, 39.99, 24.99, 49.99, 34.99, 29.99, 69.99, 59.99, 119.99, 24.99, 19.99, 44.99],
  },
  fitness: {
    names: [
      'Tapis Yoga Premium', 'Haltères Néoprène Set', 'Bandes Élastiques Pro', 'Corde à Sauter Speed',
      'Foam Roller Massage', 'Gants Fitness Grip', 'Bouteille Sport Isotherme', 'Legging Sport Femme',
      'Short Running Homme', 'Sac Sport Multifonction', 'Tracker Fitness Band', 'Kettlebell Vinyle',
      'Tenue Compression', 'Chaussettes Sport Pack', 'Serviette Microfibre XL', 'Support Genou Sport',
      'Ball Swiss Exercice', 'Poignées Push-Up', 'Montre Sport GPS', 'Protéines Whey Premium',
    ],
    descriptions: [
      'Tapis yoga TPE écologique 6mm. Surface antidérapante. Alignement intégré.',
      'Set haltères néoprène 1-5kg. Grip confortable. Rangement inclus.',
      'Kit 5 bandes résistance graduées. Latex naturel. Accessoires entraînement.',
      'Corde à sauter roulements billes. Câble acier gainé. Compteur intégré.',
      'Rouleau massage haute densité. Récupération musculaire. Texture relief.',
      'Gants fitness protection paume. Grip optimal. Respirants et légers.',
      'Bouteille isotherme 750ml. Inox double paroi. Froid 24h. Chaud 12h.',
      'Legging sport taille haute. Tissu compression. Poche téléphone. Squat-proof.',
      'Short running homme léger. Tissu technique respirant. Poches zippées.',
      'Sac sport 40L multifonction. Compartiment chaussures. Waterproof.',
      'Bracelet fitness tracker. Fréquence cardiaque. Sommeil. Notifications.',
      'Kettlebell vinyle 8-16kg. Prise ergonomique. Stable et durable.',
      'Tenue compression complète. Améliore circulation. Récupération optimisée.',
      'Pack 6 chaussettes sport. Technologie anti-ampoules. Respirantes.',
      'Serviette microfibre XL sport. Séchage ultra-rapide. Légère.',
      'Genouillère sport stabilisation. Compression ciblée. Maintien optimal.',
      'Ballon swiss 65cm. Exercices fitness. Anti-éclatement. Pompe incluse.',
      'Poignées push-up ergonomiques. Rotation 360°. Réduction pression poignets.',
      'Montre sport GPS multisport. Cardio optique. Autonomie 14 jours.',
      'Protéines whey isolat. 25g protéines/dose. Faible lactose. Saveur naturelle.',
    ],
    prices: [39.99, 49.99, 24.99, 19.99, 29.99, 19.99, 29.99, 49.99, 34.99, 59.99, 79.99, 44.99, 69.99, 24.99, 19.99, 29.99, 34.99, 24.99, 199.99, 39.99],
  },
  kids: {
    names: [
      'Peluche Géante Douce', 'Puzzle Éducatif Bois', 'Déguisement Super-Héros', 'Set Pâte à Modeler',
      'Voiture Télécommandée', 'Poupée Interactive', 'Jeu Construction Créatif', 'Livre Sonore Animaux',
      'Tente Tipi Enfant', 'Trottinette Évolutive', 'Kit Expériences Science', 'Instrument Musique Enfant',
      'Vêtement Bébé Bio', 'Sac à Dos École', 'Doudou Sensoriel', 'Jeu Société Familial',
      'Robot Éducatif Programmable', 'Set Art Créatif', 'Veilleuse Projection', 'Jouet Premier Âge',
    ],
    descriptions: [
      'Peluche géante 80cm ultra-douce. Tissu hypoallergénique. Lavable machine.',
      'Puzzle bois 100 pièces éducatif. Thème animaux monde. Développe motricité.',
      'Déguisement super-héros complet. Cape et masque. Tailles 3-10 ans.',
      'Set pâte à modeler 24 couleurs. Non toxique. Accessoires créatifs.',
      'Voiture télécommandée tout-terrain. Portée 30m. Batterie rechargeable.',
      'Poupée interactive réactive. Parle et chante. Accessoires inclus.',
      'Jeu construction 500+ pièces. Compatible grandes marques. Créativité infinie.',
      'Livre sonore 30 sons animaux. Pages cartonnées. Illustrations colorées.',
      'Tipi enfant coton naturel. 120cm hauteur. Montage facile. Fenêtre.',
      'Trottinette 3 roues évolutive. Hauteur réglable. 2-8 ans.',
      'Kit 20 expériences scientifiques. Guide illustré. Sécuritaire.',
      'Xylophone bois coloré 8 notes. Son harmonieux. Développe oreille musicale.',
      'Body bébé coton bio certifié. Pack 3 pièces. Hypoallergénique.',
      'Sac à dos ergonomique école. Rembourré. Réfléchissant. Motifs enfants.',
      'Doudou sensoriel multi-textures. Stimulation tactile. Apaisant.',
      'Jeu société familial stratégie. 2-6 joueurs. 30min partie. 6+ ans.',
      'Robot programmable enfant. Initiation codage. Compatible tablette.',
      'Set art créatif 150 pièces. Feutres, crayons, peinture. Mallette rangement.',
      'Veilleuse projection étoiles. 8 couleurs. Minuterie. Rechargeable.',
      'Jouet éveil bébé montessori. Bois naturel. Développement sensoriel.',
    ],
    prices: [34.99, 24.99, 29.99, 19.99, 49.99, 39.99, 44.99, 19.99, 69.99, 59.99, 34.99, 24.99, 29.99, 39.99, 19.99, 29.99, 79.99, 39.99, 29.99, 24.99],
  },
  books: {
    names: [
      'Roman Best-Seller 2024', 'Guide Développement Personnel', 'Livre Cuisine Monde', 'Album Photo Premium',
      'Carnet Notes Cuir', 'Stylo Plume Élégant', 'Agenda Planificateur', 'Set Calligraphie',
      'Livre Audio Abonnement', 'Encyclopedia Illustrée', 'Bande Dessinée Collector', 'Magazine Abonnement',
      'Livre Enfant Illustré', 'Guide Voyage Pratique', 'Manuel DIY Créatif', 'Journal Intime Secret',
      'Marqueurs Art Pro', 'Papier Premium A4', 'Étui Stylos Cuir', 'Marque-Pages Artisanaux',
    ],
    descriptions: [
      'Roman captivant best-seller. Édition reliée premium. Histoire inoubliable.',
      'Guide développement personnel complet. Exercices pratiques. Transformation positive.',
      'Livre cuisine du monde 200 recettes. Photos étape par étape. Voyage culinaire.',
      'Album photo cuir véritable. 100 pages. Papier archive. Souvenirs précieux.',
      'Carnet notes cuir italien. Papier ivoire 100g. Pages numérotées.',
      'Stylo plume acier brossé. Plume or 14k. Coffret cadeau élégant.',
      'Agenda planificateur annuel. Vue semaine. Objectifs. Gratitude. Premium.',
      'Set calligraphie complet. 6 plumes. Encres couleurs. Guide technique.',
      'Carte cadeau livre audio 12 mois. Milliers de titres. Sans engagement.',
      'Encyclopédie illustrée sciences. 500 pages. Illustrations exceptionnelles.',
      'BD collector édition limitée. Numérotée. Ex-libris signé auteur.',
      'Abonnement magazine 12 mois. Édition papier et digitale. Exclusivités.',
      'Livre enfant illustré grand format. Histoire magique. Illustrations douces.',
      'Guide voyage pratique. Cartes détaillées. Bons plans locaux. Photos.',
      'Manuel DIY créatif 50 projets. Instructions claires. Niveau débutant-expert.',
      'Journal intime cadenas secret. Papier ligné premium. Design élégant.',
      'Set 24 marqueurs art pro. Double pointe. Couleurs vibrantes. Encre alcool.',
      'Ramette papier premium 100g A4. 500 feuilles. Blanc extra. Jet encre.',
      'Étui stylos cuir véritable. 3 compartiments. Protection optimale.',
      'Set 6 marque-pages artisanaux. Designs exclusifs. Papier épais.',
    ],
    prices: [24.99, 19.99, 34.99, 49.99, 29.99, 89.99, 24.99, 44.99, 99.99, 59.99, 79.99, 49.99, 19.99, 24.99, 29.99, 19.99, 34.99, 14.99, 39.99, 12.99],
  },
  general: {
    names: [
      'Produit Premium Exclusif', 'Article Best-Seller', 'Édition Limitée Luxe', 'Pack Découverte',
      'Nouveauté Tendance', 'Classique Revisité', 'Série Collector', 'Collection Professionnelle',
      'Essentiel Quotidien', 'Sélection Expert', 'Innovation Design', 'Qualité Artisanale',
      'Choix Éditeur', 'Favoris Clients', 'Exclusivité Web', 'Promotion Spéciale',
      'Coffret Cadeau', 'Édition Anniversaire', 'Version Deluxe', 'Must-Have Saison',
    ],
    descriptions: [
      'Produit premium sélectionné par nos experts. Qualité exceptionnelle garantie.',
      'Notre article le plus vendu. Satisfaction client 98%. Qualité supérieure.',
      'Édition limitée luxueuse. Numérotée. Packaging premium exclusif.',
      'Pack découverte parfait pour essayer. Sélection variée. Excellent rapport qualité-prix.',
      'Dernière innovation tendance. Design contemporain. Fonctionnalité optimale.',
      'Un classique revisité avec matériaux premium. Intemporel et moderne.',
      'Série collector édition spéciale. Production limitée. Pièce unique.',
      'Collection professionnelle haut de gamme. Performance maximale.',
      'Indispensable au quotidien. Pratique et fiable. Usage intensif.',
      'Sélectionné par nos experts. Recommandation professionnelle.',
      'Innovation design primée. Fonctionnalité et esthétique réunies.',
      'Qualité artisanale française. Fait main. Matériaux nobles.',
      'Choix de la rédaction. Testé et approuvé. Excellence garantie.',
      'Favori de nos clients. Notes 5 étoiles. Satisfaction assurée.',
      'Exclusivité disponible uniquement en ligne. Quantités limitées.',
      'Promotion spéciale durée limitée. Excellent prix. Ne manquez pas.',
      'Coffret cadeau élégant. Prêt à offrir. Composition soignée.',
      'Édition anniversaire spéciale. Design commémoratif. Collection.',
      'Version deluxe enrichie. Fonctionnalités bonus. Premium.',
      'Must-have de la saison. Tendance actuelle. Style assuré.',
    ],
    prices: [49.99, 39.99, 129.99, 69.99, 54.99, 44.99, 99.99, 79.99, 29.99, 64.99, 89.99, 74.99, 59.99, 34.99, 44.99, 24.99, 79.99, 109.99, 149.99, 39.99],
  },
};

// Generate PRODUCTION products based on plan and niche
const getProductionProducts = (plan: string, niche: string = 'general', isPro: boolean = false) => {
  const productCount = plan === 'pro' ? 50 : 10;
  const products = [];
  
  // Get niche-specific data or fallback to general
  const selectedNiche = nicheProducts[niche] || nicheProducts.general;
  const selectedImages = nicheImages[niche] || nicheImages.general;
  
  for (let i = 0; i < productCount; i++) {
    const idx = i % selectedNiche.names.length;
    const imageIdx = i % selectedImages.length;
    const version = Math.floor(i / selectedNiche.names.length);
    
    // Pro plan gets premium pricing and naming
    const priceMultiplier = isPro ? 1.0 : 0.9; // Pro has slightly higher prices
    const basePrice = selectedNiche.prices[idx];
    const finalPrice = Math.round((basePrice + (version * 10)) * priceMultiplier * 100) / 100;
    
    const productName = version > 0 
      ? `${selectedNiche.names[idx]} - Édition ${version + 1}` 
      : selectedNiche.names[idx];
    
    products.push({
      name: productName,
      description: selectedNiche.descriptions[idx],
      price: finalPrice,
      category: niche,
      stock: Math.floor(Math.random() * 80) + 20, // 20-100 stock
      status: 'active',
      is_visible: true,
      image: selectedImages[imageIdx],
    });
  }
  
  return products;
};

serve(async (req) => {
  const startTime = Date.now();
  console.log('='.repeat(60));
  console.log('[GENERATE-AI-STORE] START at:', new Date().toISOString());
  console.log('[GENERATE-AI-STORE] Method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.text();
    console.log('[GENERATE-AI-STORE] Raw body:', body);
    
    let requestData;
    try {
      requestData = JSON.parse(body);
    } catch (e) {
      console.error('[GENERATE-AI-STORE] Failed to parse JSON body:', e.message);
      throw new Error('Invalid JSON body');
    }
    
    const { userId, storeName, plan, niche, sessionId, storeId, isProduction } = requestData;
    
    console.log('[GENERATE-AI-STORE] Request parameters:');
    console.log('  - userId:', userId);
    console.log('  - storeName:', storeName);
    console.log('  - plan:', plan);
    console.log('  - niche:', niche);
    console.log('  - sessionId:', sessionId);
    console.log('  - storeId:', storeId);
    console.log('  - isProduction:', isProduction);

    if (!userId) {
      console.error('[GENERATE-AI-STORE] Missing userId');
      throw new Error('Missing required field: userId');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('[GENERATE-AI-STORE] ENV CHECK:');
    console.log('  - SUPABASE_URL:', supabaseUrl ? '✓ loaded' : '✗ MISSING');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓ loaded' : '✗ MISSING');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    console.log('[GENERATE-AI-STORE] Finding store for user:', userId);

    // Find the store - try multiple approaches
    let store = null;
    
    // 1. Try by store ID first (if provided)
    if (storeId) {
      console.log('[GENERATE-AI-STORE] Searching by store ID:', storeId);
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('id', storeId)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] ✓ Found store by ID:', store.id);
      } else {
        console.log('[GENERATE-AI-STORE] Store not found by ID:', error?.message);
      }
    }
    
    // 2. Try by session ID
    if (!store && sessionId) {
      console.log('[GENERATE-AI-STORE] Searching by session ID:', sessionId);
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('stripe_checkout_session_id', sessionId)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] ✓ Found store by session ID:', store.id);
      } else {
        console.log('[GENERATE-AI-STORE] Store not found by session ID:', error?.message);
      }
    }
    
    // 3. Fallback: find by user ID (most recent)
    if (!store) {
      console.log('[GENERATE-AI-STORE] Searching by user ID:', userId);
      const { data, error } = await supabaseClient
        .from('store_settings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        store = data;
        console.log('[GENERATE-AI-STORE] ✓ Found store by user ID:', store.id);
      } else {
        console.log('[GENERATE-AI-STORE] Store not found by user ID:', error?.message);
      }
    }

    // 4. Create store if not found
    if (!store) {
      console.log('[GENERATE-AI-STORE] No store found - creating new PRODUCTION store');
      const { data: newStore, error: createError } = await supabaseClient
        .from('store_settings')
        .insert({
          user_id: userId,
          store_name: storeName || 'Ma Boutique IA',
          store_type: 'ai',
          payment_status: 'completed',
          store_status: 'processing',
          niche: niche || 'general',
          is_production: false,
          stripe_checkout_session_id: sessionId,
          initial_products_generated: false,
        })
        .select()
        .single();

      if (createError) {
        console.error('[GENERATE-AI-STORE] ✗ Failed to create store:', createError);
        throw new Error('Failed to create store: ' + createError.message);
      }
      
      store = newStore;
      console.log('[GENERATE-AI-STORE] ✓ Created new store:', store.id);
    }

    // Check idempotency - skip if already fully generated and production (but allow re-generation on upgrade)
    const forceRegenerate = requestData.forceRegenerate === true;
    if (store.initial_products_generated && store.is_production && !forceRegenerate) {
      console.log('[GENERATE-AI-STORE] ✓ Store is already PRODUCTION - returning early');
      return new Response(
        JSON.stringify({ 
          success: true, 
          storeId: store.id,
          message: 'Store already in production',
          alreadyGenerated: true,
          isProduction: true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get niche from request or store
    const selectedNiche = niche || store.niche || 'general';
    const selectedPlan = plan || 'starter';
    const isPro = selectedPlan === 'pro';
    
    // Generate PRODUCTION products based on plan and niche
    const productionProducts = getProductionProducts(selectedPlan, selectedNiche, isPro);
    console.log(`[GENERATE-AI-STORE] Generating ${productionProducts.length} PRODUCTION ${selectedNiche} products for plan: ${selectedPlan}`);

    // === PURGE OLD PRODUCTS BEFORE INSERTING NEW ONES ===
    // This ensures upgrades and regenerations replace rather than accumulate products
    console.log('[GENERATE-AI-STORE] Purging existing products for store:', store.id);
    const { error: deleteError, count: deletedCount } = await supabaseClient
      .from('products')
      .delete()
      .eq('store_id', store.id);

    if (deleteError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error purging old products:', deleteError.message);
      // Continue anyway - insert will work, we just might have duplicates
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Purged', deletedCount || 0, 'old products');
    }

    // Insert products into the products table - ACTIVE, VISIBLE, PUBLISHED with store_id
    const productsToInsert = productionProducts.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: 'active',
      is_visible: true,
      published: true,
      image: product.image,
      user_id: userId,
      store_id: store.id,
      created_at: new Date().toISOString(),
    }));

    console.log('[GENERATE-AI-STORE] Inserting PRODUCTION products into products table...');
    const { data: insertedProducts, error: productsError } = await supabaseClient
      .from('products')
      .insert(productsToInsert)
      .select();

    if (productsError) {
      console.error('[GENERATE-AI-STORE] ✗ Error inserting to products table:', productsError.message);
      throw new Error('Failed to insert products: ' + productsError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Inserted', insertedProducts?.length || 0, 'PRODUCTION products into products table');
    }

    // Update store to mark as PRODUCTION ACTIVE
    console.log('[GENERATE-AI-STORE] Updating store to PRODUCTION ACTIVE...');
    const { error: updateError } = await supabaseClient
      .from('store_settings')
      .update({
        initial_products_generated: true,
        store_type: 'ai',
        payment_status: 'completed',
        store_status: 'active',
        is_production: true,
        niche: selectedNiche,
        production_activated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', store.id);

    if (updateError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error updating store:', updateError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Store marked as PRODUCTION ACTIVE');
    }

    // Ensure brand settings exist with niche-appropriate colors
    console.log('[GENERATE-AI-STORE] Checking brand settings...');
    const { data: brandSettings } = await supabaseClient
      .from('brand_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Niche-specific brand colors
    const nicheColors: Record<string, { primary: string, secondary: string }> = {
      fashion: { primary: '#E91E63', secondary: '#9C27B0' },
      electronics: { primary: '#2196F3', secondary: '#00BCD4' },
      beauty: { primary: '#FF4081', secondary: '#E040FB' },
      home: { primary: '#795548', secondary: '#607D8B' },
      fitness: { primary: '#4CAF50', secondary: '#FF5722' },
      kids: { primary: '#FF9800', secondary: '#FFEB3B' },
      books: { primary: '#3F51B5', secondary: '#009688' },
      general: { primary: '#E53935', secondary: '#1976D2' },
    };

    const brandColors = nicheColors[selectedNiche] || nicheColors.general;

    if (!brandSettings) {
      console.log('[GENERATE-AI-STORE] Creating brand settings...');
      const { error: brandError } = await supabaseClient
        .from('brand_settings')
        .insert({
          user_id: userId,
          primary_color: brandColors.primary,
          secondary_color: brandColors.secondary,
          slogan: `Bienvenue sur ${storeName || 'Ma Boutique'} - Votre destination ${selectedNiche}`,
        });

      if (brandError) {
        console.error('[GENERATE-AI-STORE] ⚠ Error creating brand settings:', brandError.message);
      } else {
        console.log('[GENERATE-AI-STORE] ✓ Brand settings created');
      }
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Brand settings already exist');
    }

    // Create success notification
    console.log('[GENERATE-AI-STORE] Creating success notification...');
    const nicheLabels: Record<string, string> = {
      fashion: 'Mode',
      electronics: 'Électronique',
      beauty: 'Beauté',
      home: 'Maison & Déco',
      fitness: 'Sport & Fitness',
      kids: 'Enfants',
      books: 'Livres & Papeterie',
      general: 'Général',
    };
    
    const { error: notifError } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: '🚀 Boutique LIVE - Prête pour les ventes!',
        content: `Votre boutique "${storeName || 'Ma Boutique'}" (${nicheLabels[selectedNiche] || 'Général'}) est maintenant en ligne avec ${productionProducts.length} produits ${isPro ? 'premium' : 'actifs'}. Commencez à vendre dès maintenant!`,
      });

    if (notifError) {
      console.error('[GENERATE-AI-STORE] ⚠ Error creating notification:', notifError.message);
    } else {
      console.log('[GENERATE-AI-STORE] ✓ Notification created');
    }

    const duration = Date.now() - startTime;
    console.log('[GENERATE-AI-STORE] ✓ PRODUCTION COMPLETE - Generation took', duration, 'ms');
    console.log('='.repeat(60));

    return new Response(
      JSON.stringify({ 
        success: true, 
        storeId: store.id,
        productsCount: productionProducts.length,
        plan: selectedPlan,
        niche: selectedNiche,
        isProduction: true,
        storeStatus: 'active',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('[GENERATE-AI-STORE] ✗ FATAL ERROR:', error.message);
    console.error('[GENERATE-AI-STORE] Stack:', error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
