import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Type, 
  Image, 
  Video, 
  Layout, 
  Palette, 
  Eye, 
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown
} from "lucide-react";
import { T } from "@/components/translation/T";
import { useToast } from "@/hooks/use-toast";

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'section';
  content: string;
  styles?: Record<string, string>;
}

const PageEditor = () => {
  const [elements, setElements] = useState<PageElement[]>([
    { id: '1', type: 'text', content: 'Bienvenue sur notre boutique' },
    { id: '2', type: 'text', content: 'Découvrez nos produits exceptionnels' }
  ]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const addElement = (type: PageElement['type']) => {
    const newElement: PageElement = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Nouveau texte' : 
               type === 'button' ? 'Nouveau bouton' :
               type === 'image' ? 'https://via.placeholder.com/400x200' :
               type === 'video' ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' :
               'Nouvelle section'
    };
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id: string, content: string) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, content } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    const index = elements.findIndex(el => el.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === elements.length - 1)
    ) return;

    const newElements = [...elements];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
    setElements(newElements);
  };

  const savePage = () => {
    toast({
      title: "Page sauvegardée",
      description: "Vos modifications ont été sauvegardées avec succès.",
    });
  };

  const renderElement = (element: PageElement) => {
    const isSelected = selectedElement === element.id;
    const className = `relative p-4 border-2 transition-all ${
      isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'
    }`;

    switch (element.type) {
      case 'text':
        return (
          <div key={element.id} className={className} onClick={() => setSelectedElement(element.id)}>
            <p className="text-lg">{element.content}</p>
          </div>
        );
      case 'image':
        return (
          <div key={element.id} className={className} onClick={() => setSelectedElement(element.id)}>
            <img src={element.content} alt="Element" className="max-w-full h-auto rounded" />
          </div>
        );
      case 'video':
        return (
          <div key={element.id} className={className} onClick={() => setSelectedElement(element.id)}>
            <iframe 
              src={element.content} 
              className="w-full h-64 rounded"
              allowFullScreen
            />
          </div>
        );
      case 'button':
        return (
          <div key={element.id} className={className} onClick={() => setSelectedElement(element.id)}>
            <Button className="w-auto">{element.content}</Button>
          </div>
        );
      case 'section':
        return (
          <div key={element.id} className={`${className} min-h-24 bg-muted/20`} onClick={() => setSelectedElement(element.id)}>
            <p className="text-center text-muted-foreground">{element.content}</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={() => setPreviewMode(false)}>
            <T>Retour à l'éditeur</T>
          </Button>
        </div>
        <div className="container mx-auto py-8">
          {elements.map(renderElement)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <T as="h1" className="text-3xl font-bold">Éditeur de Pages</T>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(true)}>
              <Eye className="mr-2 h-4 w-4" />
              <T>Aperçu</T>
            </Button>
            <Button onClick={savePage}>
              <Save className="mr-2 h-4 w-4" />
              <T>Sauvegarder</T>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Elements */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                <T>Éléments</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addElement('text')}
              >
                <Type className="mr-2 h-4 w-4" />
                <T>Texte</T>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addElement('image')}
              >
                <Image className="mr-2 h-4 w-4" />
                <T>Image</T>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addElement('video')}
              >
                <Video className="mr-2 h-4 w-4" />
                <T>Vidéo</T>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addElement('button')}
              >
                <Plus className="mr-2 h-4 w-4" />
                <T>Bouton</T>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => addElement('section')}
              >
                <Layout className="mr-2 h-4 w-4" />
                <T>Section</T>
              </Button>
            </CardContent>
          </Card>

          {/* Main Editor */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                <T>Zone d'édition</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-96">
              {elements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <T>Ajoutez des éléments depuis la sidebar pour commencer</T>
                </div>
              ) : (
                elements.map(renderElement)
              )}
            </CardContent>
          </Card>

          {/* Properties Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                <T>Propriétés</T>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedElement ? (
                <div className="space-y-4">
                  {(() => {
                    const element = elements.find(el => el.id === selectedElement);
                    if (!element) return null;

                    return (
                      <>
                        <div>
                          <label className="text-sm font-medium">
                            <T>Contenu</T>
                          </label>
                          {element.type === 'text' || element.type === 'button' ? (
                            <Input
                              value={element.content}
                              onChange={(e) => updateElement(element.id, e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <Textarea
                              value={element.content}
                              onChange={(e) => updateElement(element.id, e.target.value)}
                              className="mt-1"
                              rows={3}
                            />
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveElement(element.id, 'up')}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveElement(element.id, 'down')}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteElement(element.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  <T>Sélectionnez un élément pour modifier ses propriétés</T>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;