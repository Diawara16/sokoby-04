interface CustomerNotesTabProps {
  notes: string | null;
}

export const CustomerNotesTab = ({ notes }: CustomerNotesTabProps) => {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {notes || 'Aucune note pour ce client'}
      </p>
    </div>
  );
};