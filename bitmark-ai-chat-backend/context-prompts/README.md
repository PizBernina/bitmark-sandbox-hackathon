# Context Prompts

This folder contains context and prompt files used by the AI chat backend.

## Files

### `system_instruction.txt`
The main system instruction that defines the AI assistant's role and capabilities. This file is automatically loaded by the backend and used to provide context to the Gemini API.

## Usage

The backend will automatically load the system instruction from this file. If the file doesn't exist, it will fall back to the `GEMINI_SYSTEM_INSTRUCTION` environment variable.

## Customization

You can modify the `system_instruction.txt` file to change how the AI behaves:
- Update the role description
- Add specific capabilities
- Modify the tone and style
- Include domain-specific knowledge

The changes will take effect the next time the backend is restarted.

## Adding More Context Files

You can add additional context files here for different purposes:
- `examples.txt` - Example conversations or responses
- `knowledge_base.txt` - Domain-specific knowledge
- `personality.txt` - Personality and tone guidelines

To use additional files, you would need to modify the `load_system_instruction()` function in `main.py` to load and combine multiple files.
