/** @jsxImportSource theme-ui */
import { Flex, Text, ThemeUIProvider } from 'theme-ui';
import { useSnapshot } from 'valtio';

import { BitmarkJsonDuration } from './components/bitmark/BitmarkJsonDuration';
import { BitmarkJsonTextBox } from './components/bitmark/BitmarkJsonTextBox';
import { BitmarkMarkupDuration } from './components/bitmark/BitmarkMarkupDuration';
import { BitmarkMarkupTextBox } from './components/bitmark/BitmarkMarkupTextBox';
import { BitmarkRenderedUI } from './components/bitmark/BitmarkRenderedUI';
import { SandboxAutoViewer } from './components/sandbox/SandboxAutoViewer';
import { Copyright } from './components/version/Copyright';
import { Version } from './components/version/Version';
import { BitmarkParserGeneratorProvider } from './services/BitmarkParserGenerator';
import { bitmarkState } from './state/bitmarkState';
import { theme } from './theme/theme';
import './App.css';

const initialMarkup = `[.cloze] The students completed the [_assignment] with the correct verb forms.

[.multiple-choice] What color are violets? [-red][+blue][-green]

[.cloze-and-multiple-choice-text] Roses are [_red], violets are [-green][+blue][-yellow]

[.text] This is **bold** text and __italic__ text and ==underlined== text.

[!Colors] This is a header

[.paragraph] This is a regular paragraph with some **bold** and __italic__ formatting.`;
// const initialMarkup = `
// [.article:bitmark++&video]

// Here is some inline 'style' applied **here is __the__ text** is this bold.
// Here is some __italic__ text ==the text==|test| is that correct **bold**

// [.article:bitmark++]
// Here is some inline 'style' applied ==here is the text==|bold|italic|subscript|, nice huh?

// **bold**

// [.image]
// [@id:304379]
// [@backgroundWallpaper:https://miro.medium.com/background.png]
// [&image:https://miro.medium.com/v2/resizefit1400/1nT_Rrk9LCI5XWiLGzzOzBQ*.gif][@search:testing **123**]

// [.image]
// [@id:304379]
// [@levelCEFRp:levelCEFRp]
// [@levelCEFR:levelCEFR]
// [@levelILR:levelILR]
// [@levelACTFL:levelACTFL]
// [&image:https://miro.medium.com/v2/resizefit1400/1nT_Rrk9LCI5XWiLGzzOzBQ$.gif][@zoomDisabled]

// [.article]

// [@ip:false]
// `.trim();

function App() {
  const snap = useSnapshot(bitmarkState);
  return (
    <ThemeUIProvider theme={theme}>
      <BitmarkParserGeneratorProvider>
        <Flex
          sx={{
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            backgroundColor: 'background',
          }}
        >
          <Flex
            sx={{
              flexDirection: 'row',
              height: '100%',
            }}
          >
            {/* Left Column */}
            <Flex
              sx={{
                flexDirection: 'column',
                flexGrow: 1,
                width: '50%',
                minHeight: 0,
              }}
            >
              {/* Top Left: Bitmark Input */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  flex: '1 1 50%',
                  minHeight: 0,
                }}
              >
                <Flex
                  sx={{
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Flex sx={{ alignItems: 'flex-end', gap: 2 }}>
                    <Text
                      sx={{
                        variant: 'header.code',
                      }}
                    >
                      bitmark
                    </Text>
                    <BitmarkMarkupDuration
                      sx={{
                        variant: 'text.parserDuration',
                      }}
                    />
                  </Flex>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, opacity: 0.8 }}>
                    <input
                      type="checkbox"
                      checked={snap.breakscapeWarningsEnabled}
                      onChange={(e) => bitmarkState.setBreakscapeWarningsEnabled(e.target.checked)}
                    />
                    <span>Breakscaping warnings</span>
                  </label>
                </Flex>
                <Flex
                  sx={{
                    resize: 'none',
                    variant: 'textarea.code',
                    flexGrow: 1,
                  }}
                >
                  <BitmarkMarkupTextBox
                    className={'markup-editor'}
                    sx={{
                      border: '1px solid',
                      borderColor: 'accent',
                    }}
                    initialMarkup={initialMarkup}
                    options={{
                      wordWrap: 'on',
                    }}
                  />
                </Flex>
              </Flex>

              {/* Bottom Left: Rendered UI */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  flex: '1 1 50%',
                  minHeight: 0,
                  mt: 2,
                }}
              >
                <BitmarkRenderedUI />
              </Flex>
            </Flex>

            {/* Right Column */}
            <Flex
              sx={{
                flexDirection: 'column',
                flexGrow: 1,
                width: '50%',
                ml: 2,
              }}
            >
              {/* Top Right: JSON Output */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  flex: '1 1 50%',
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
                    JSON
                  </Text>
                  <BitmarkJsonDuration
                    sx={{
                      variant: 'text.parserDuration',
                    }}
                  />
                </Flex>
                <Flex sx={{ resize: 'none', variant: 'textarea.code', flexGrow: 1, minHeight: 0 }}>
                  <BitmarkJsonTextBox
                    className={'json-editor'}
                    sx={{ border: '1px solid', borderColor: 'accent' }}
                    options={{ wordWrap: 'on' }}
                  />
                </Flex>
              </Flex>

              {/* Bottom Right: Sandbox Outputs */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  flex: '1 1 50%',
                  minHeight: 0,
                  mt: 2,
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
                    Sandbox outputs
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'accent',
                    overflowY: 'auto',
                    flexGrow: 1,
                    minHeight: 0,
                  }}
                >
                  <SandboxAutoViewer />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            sx={{
              justifyContent: 'space-between',
            }}
          >
            <Version
              sx={{
                variant: 'text.copyright',
              }}
            />
            <Copyright
              sx={{
                variant: 'text.copyright',
              }}
            />
          </Flex>
        </Flex>
      </BitmarkParserGeneratorProvider>
    </ThemeUIProvider>
  );
}

export { App };
