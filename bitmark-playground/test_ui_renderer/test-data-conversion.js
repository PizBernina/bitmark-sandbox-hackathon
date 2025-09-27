// Test the data conversion logic
const testBitmarkInput = `[.cloze]
[@revealSolutions: false ]
The students completed the [_ assignment ] with the correct verb forms.


[.multiple-choice]
[@revealSolutions: false ]
What color are violets?
[- red ]
[+ blue ]
[- green ]


[.cloze-and-multiple-choice-text]
[@revealSolutions: false ]
Roses are [_ red ], violets are [- green ][+ blue ][- yellow ]`;

// Simulate what the bitmark parser would produce for the multiple-choice question
const simulatedParsedJson = [
  {
    "bit": {
      "type": "multiple-choice",
      "format": "bitmark++",
      "bitLevel": 1,
      "body": [
        {
          "type": "paragraph",
          "content": [
            {
              "text": "What color are violets?",
              "type": "text"
            }
          ]
        },
        {
          "type": "paragraph",
          "content": [
            {
              "type": "select",
              "attrs": {
                "options": [
                  {
                    "text": "red",
                    "isCorrect": false
                  },
                  {
                    "text": "blue", 
                    "isCorrect": true
                  },
                  {
                    "text": "green",
                    "isCorrect": false
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
];

// Test the data conversion logic
function testDataConversion() {
  console.log('Testing data conversion...');
  
  const bit = simulatedParsedJson[0].bit;
  console.log('Original bit:', JSON.stringify(bit, null, 2));
  
  // Simulate the conversion logic from BitmarkRenderedUI.tsx
  let content = '';
  const allOptions = [];
  let questionText = '';
  
  if (bit.body && Array.isArray(bit.body)) {
    content = bit.body
      .map((item) => {
        if (item.type === 'paragraph' && item.content) {
          const paragraphContent = item.content
            .map((textItem) => {
              if (textItem.type === 'text') {
                return textItem.text;
              } else if (textItem.type === 'select') {
                const options = textItem.attrs?.options || [];
                allOptions.push(...options);
                return '';
              }
              return '';
            })
            .join('');
          
          if (!questionText && paragraphContent.trim() && !paragraphContent.includes('[')) {
            questionText = paragraphContent.trim();
          }
          
          return paragraphContent;
        }
        return '';
      })
      .join('\n');
    
    // For multiple choice, create the content
    if (bit.type === 'multiple-choice' && allOptions.length > 0) {
      const correctOptions = allOptions.filter(opt => opt.isCorrect).map(opt => `[+${opt.text}]`);
      const wrongOptions = allOptions.filter(opt => !opt.isCorrect).map(opt => `[-${opt.text}]`);
      const question = questionText || content.split('\n')[0] || 'Choose an option:';
      content = question + '\n' + [...correctOptions, ...wrongOptions].join('\n');
    }
  }
  
  console.log('Converted content:', content);
  console.log('All options:', allOptions);
  console.log('Question text:', questionText);
  
  // Test the regex parsing
  const parts = content.split(/(\[[-+][^\]]*\])/g);
  console.log('Split parts:', parts);
  
  const options = parts
    .filter(part => part.startsWith('[-') || part.startsWith('[+'))
    .map(part => {
      const isCorrect = part.startsWith('[+');
      const text = part.slice(2, -1).trim();
      return {
        text,
        correct: isCorrect,
        value: text.toLowerCase().replace(/\s+/g, '-')
      };
    });
  
  console.log('Parsed options:', options);
}

testDataConversion();
