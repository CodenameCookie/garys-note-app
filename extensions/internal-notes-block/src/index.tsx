import {
  reactExtension,
  useApi,
  TextField,
  BlockStack,
  Box,
  Heading,
  Button,
  Text,
  Divider,
} from '@shopify/ui-extensions-react/admin';
import { useState, useEffect } from 'react';

// Target for Product details page
export default reactExtension('admin.product-details.block.render', () => <InternalNotesBlock />);

function InternalNotesBlock() {
  const { data } = useApi();
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  const gid = data.selectedResources[0].id;
  const resourceType = gid.includes('Product') ? 'PRODUCT' : 'COLLECTION';
  const resourceId = gid.split('/').pop();

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`/api/notes?resourceId=${resourceId}&resourceType=${resourceType}`);
        const result = await response.json();
        if (result.note) {
          setNote(result.note);
        }
      } catch (error) {
        console.error('Failed to fetch note:', error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchNote();
  }, [resourceId, resourceType]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          resourceType,
          content: note,
        }),
      });
      const result = await response.json();
      if (result.note !== undefined) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <Text>Loading notes...</Text>;
  }

  return (
    <BlockStack gap="small">
      <Heading size="3">Internal Notes</Heading>
      <Divider />
      <Box paddingBlock="small">
        <TextField
          label="Internal observations"
          value={note}
          onChange={setNote}
          multiline={4}
          placeholder="Add notes for this product..."
        />
      </Box>
      <BlockStack align="space-between" inlineAlignment="center" direction="row">
        <Button onClick={handleSave} loading={loading} disabled={loading}>
          Save Note
        </Button>
        {lastSaved && (
          <Text size="small" tone="subdued">
            Last saved at {lastSaved}
          </Text>
        )}
      </BlockStack>
    </BlockStack>
  );
}
