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
      // eslint-disable-next-line no-console
      console.log('First wrapper:', parsedJson[0]);
      if (parsedJson[0] && parsedJson[0].bit) {
        // eslint-disable-next-line no-console
        console.log('First bit:', parsedJson[0].bit);
        // eslint-disable-next-line no-console
        console.log('First bit body:', parsedJson[0].bit.body);
      }

      // Handle different bitmark structures - extract bits from BitWrapperJson format
      let bitWrappers = [];

      if (Array.isArray(parsedJson)) {
        bitWrappers = parsedJson;
      } else if (parsedJson.bit) {
        // If it has a 'bit' property, use that
        bitWrappers = [parsedJson];
      } else if (parsedJson.bits && Array.isArray(parsedJson.bits)) {
        // If it has a 'bits' array property
        bitWrappers = parsedJson.bits;
      } else if (typeof parsedJson === 'object') {
        // If it's a single object, wrap it
        bitWrappers = [parsedJson];
      }

      // Convert BitWrapperJson to BitmarkNode format
      const convertedBits = bitWrappers.map((wrapper: any) => {
        const bit = wrapper.bit || wrapper;

        // Extract content from body
        let content = '';
        // eslint-disable-next-line no-console
        console.log('Processing bit:', bit.type, 'body:', bit.body);
        if (bit.type === 'multiple-choice') {
          // eslint-disable-next-line no-console
          console.log('Multiple choice bit details:', JSON.stringify(bit, null, 2));
        }
        if (bit.body && Array.isArray(bit.body)) {
          // eslint-disable-next-line no-console
          console.log(
            'Body items:',
            bit.body.map((item: any) => ({ type: item.type, hasContent: !!item.content, hasAttrs: !!item.attrs })),
          );

          // For multiple choice, we need to collect all options from all body items
          const allOptions: any[] = [];
          let questionText = '';

          content = bit.body
            .map((item: any) => {
              if (item.type === 'paragraph' && item.content) {
                const paragraphContent = item.content
                  .map((textItem: any) => {
                    if (textItem.type === 'text') {
                      return textItem.text;
                    } else if (textItem.type === 'gap') {
                      return `[_${textItem.attrs?.solutions?.[0] || ''}]`;
                    } else if (textItem.type === 'select') {
                      const options = textItem.attrs?.options || [];
                      allOptions.push(...options);
                      // Don't render options inline, we'll handle them separately
                      return '';
                    } else if (textItem.type === 'hardBreak') {
                      return '\n';
                    }
                    return '';
                  })
                  .join('');

                // If this is the first paragraph and it's a question, store it
                if (!questionText && paragraphContent.trim() && !paragraphContent.includes('[')) {
                  questionText = paragraphContent.trim();
                }

                return paragraphContent;
              } else if (item.type === 'select' && item.attrs?.options) {
                // Handle standalone select items (multiple choice options)
                const options = item.attrs.options;
                allOptions.push(...options);
                // eslint-disable-next-line no-console
                console.log('Found select item with options:', options);
                // Don't render options inline, we'll handle them separately
                return '';
              }
              return '';
            })
            .join('\n');

          // For multiple choice, if we have options, create the content
          if (bit.type === 'multiple-choice' && allOptions.length > 0) {
            const correctOptions = allOptions.filter((opt: any) => opt.isCorrect).map((opt: any) => `[+${opt.text}]`);
            const wrongOptions = allOptions.filter((opt: any) => !opt.isCorrect).map((opt: any) => `[-${opt.text}]`);
            // If we don't have question text, use the first part of content that doesn't contain brackets
            const question = questionText || content.split('\n')[0] || 'Choose an option:';
            content = question + '\n' + [...correctOptions, ...wrongOptions].join('\n');
            // eslint-disable-next-line no-console
            console.log('Created multiple choice content:', content);
          }
        }

        // Handle quizzes structure for multiple-choice (new format)
        if (bit.type === 'multiple-choice' && bit.quizzes && Array.isArray(bit.quizzes)) {
          const allQuizOptions: any[] = [];
          let questionText = content || '';

          // Extract question text from body if not already set
          if (!questionText && bit.body && Array.isArray(bit.body)) {
            questionText = bit.body
              .map((item: any) => {
                if (item.type === 'paragraph' && item.content) {
                  return item.content.map((textItem: any) => (textItem.type === 'text' ? textItem.text : '')).join('');
                }
                return '';
              })
              .join('\n')
              .trim();
          }

          // Extract options from quizzes
          bit.quizzes.forEach((quiz: any) => {
            if (quiz.choices && Array.isArray(quiz.choices)) {
              allQuizOptions.push(
                ...quiz.choices.map((choice: any) => ({
                  text: choice.choice,
                  isCorrect: choice.isCorrect,
                })),
              );
            }
          });

          if (allQuizOptions.length > 0) {
            const correctOptions = allQuizOptions
              .filter((opt: any) => opt.isCorrect)
              .map((opt: any) => `[+${opt.text}]`);
            const wrongOptions = allQuizOptions
              .filter((opt: any) => !opt.isCorrect)
              .map((opt: any) => `[-${opt.text}]`);
            content = questionText + '\n' + [...correctOptions, ...wrongOptions].join('\n');
            // eslint-disable-next-line no-console
            console.log('Created multiple choice content from quizzes:', content);
          }
        }

        // Handle the case where content might be empty but we have instruction/lead text
        if (!content || content.trim() === '') {
          if (bit.instruction && Array.isArray(bit.instruction)) {
            content = bit.instruction
              .map((item: any) => {
                if (item.type === 'paragraph' && item.content) {
                  return item.content.map((textItem: any) => (textItem.type === 'text' ? textItem.text : '')).join('');
                }
                return '';
              })
              .join('\n');
          } else if (bit.lead && Array.isArray(bit.lead)) {
            content = bit.lead
              .map((item: any) => {
                if (item.type === 'paragraph' && item.content) {
                  return item.content.map((textItem: any) => (textItem.type === 'text' ? textItem.text : '')).join('');
                }
                return '';
              })
              .join('\n');
          }
        }

        // Map bit types to UI renderer types
        let mappedType = bit.type;
        if (bit.type === 'cloze-and-multiple-choice-text') {
          mappedType = 'cloze-and-multiple-choice-text';
        } else if (bit.type === 'multiple-choice') {
          mappedType = 'multiple-choice';
        } else if (bit.type === 'cloze') {
          mappedType = 'cloze';
        }

        // eslint-disable-next-line no-console
        console.log('Final content for', bit.type, ':', content.trim());
        return {
          type: mappedType,
          content: content.trim(),
          originalBit: bit, // Keep original for debugging
        };
      });

      // eslint-disable-next-line no-console
      console.log('Extracted bits for renderer:', convertedBits);
      // eslint-disable-next-line no-console
      console.log('First bit details:', convertedBits[0]);
      return convertedBits;
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
