import React, { useMemo } from 'react';
import { Flex, Text } from 'theme-ui';
import { useSnapshot } from 'valtio';

import { BitmarkRenderer, ThemeProvider } from '../../lib/bitmark-ui-renderer/index.js';
import { bitmarkState } from '../../state/bitmarkState';

export const BitmarkRenderedUI: React.FC = () => {
  const snap = useSnapshot(bitmarkState);

  // Convert the JSON output to a format the renderer can understand
  const rendererData = useMemo(() => {
    try {
      // snap.json might already be a parsed object or a string
      let parsedJson;

      if (typeof snap.json === 'string') {
        const jsonString = snap.json as string;
        if (!jsonString || jsonString.trim() === '') {
          return null;
        }
        parsedJson = JSON.parse(jsonString);
      } else if (typeof snap.json === 'object' && snap.json !== null) {
        parsedJson = snap.json;
      } else {
        return null;
      }

      // eslint-disable-next-line no-console
      console.log('Parsed JSON for renderer:', parsedJson);

      // Handle different bitmark structures
      let bits = [];

      if (Array.isArray(parsedJson)) {
        bits = parsedJson;
      } else if (parsedJson.bit) {
        // If it has a 'bit' property, use that
        bits = [parsedJson.bit];
      } else if (parsedJson.bits && Array.isArray(parsedJson.bits)) {
        // If it has a 'bits' array property
        bits = parsedJson.bits;
      } else if (typeof parsedJson === 'object') {
        // If it's a single object, wrap it
        bits = [parsedJson];
      }

      // eslint-disable-next-line no-console
      console.log('Extracted bits for renderer:', bits);
      return bits;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing JSON for renderer:', error);
      return null;
    }
  }, [snap.json]);

  const handleInteraction = (interaction: unknown) => {
    // eslint-disable-next-line no-console
    console.log('User interaction:', interaction);
    // You can add more sophisticated interaction handling here
  };

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      <Flex
        sx={{
          alignItems: 'flex-end',
          mb: 2,
        }}
      >
        <Text
          sx={{
            variant: 'header.code',
          }}
        >
          Rendered UI
        </Text>
      </Flex>
      <Flex
        sx={{
          flex: 1,
          minHeight: 0,
          border: '1px solid',
          borderColor: 'accent',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <ThemeProvider>
          <BitmarkRenderer
            data={rendererData || []}
            onInteraction={handleInteraction}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
            }}
          />
        </ThemeProvider>
      </Flex>
    </Flex>
  );
};
