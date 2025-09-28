# Context Prompts

This folder contains context and prompt files used by the AI chat backend.

## Files

### `system_instruction.txt`
The main system instruction that defines the AI assistant's role and capabilities. This file is automatically loaded by the backend and used to provide context to the Gemini API.

### `general_info_bitmark/`
A collection of markdown files containing information about Bitmark from the official website. These files are used by the tool calling system to provide accurate, up-to-date information about Bitmark.

Available topics:
- `bitmark-association.org_20250928_120659_home.md` - Overview and general information
- `bitmark-association.org_20250928_120850_bitmark_hackathon.md` - Hackathon information
- `bitmark-association.org_20250928_120923_open_task_pool.md` - Open task pool details
- `bitmark-association.org_20250928_120958_team.md` - Team information
- `bitmark-association.org_20250928_121039_blog.md` - Blog posts and updates
- `bitmark-association.org_20250928_120739_sandbox_bit_challenge.md` - Sandbox and challenges

## Tool Calling System

The backend includes a sophisticated tool calling system that allows the AI to:

### Available Tools

1. **`get_bitmark_general_info`** - Retrieves general information about Bitmark
   - Parameters: `topic` (overview, hackathon, taskpool, team, blog, sandbox)
   - Returns: Content from the corresponding markdown file

2. **`get_bitmark_code_info`** - Retrieves technical information about Bitmark code
   - Parameters: `code_type` (syntax, examples, parser, ui_renderer)
   - Returns: Code-related information (currently placeholder)

3. **`get_user_input_info`** - Retrieves information about user input handling
   - Parameters: `input_type` (forms, validation, interactive_elements)
   - Returns: Input handling information (currently placeholder)

### How It Works

1. User sends a message to the chat endpoint
2. Gemini analyzes the message and determines if tool calling is needed
3. If tools are needed, Gemini calls the appropriate function
4. The function retrieves information from the context files
5. Gemini incorporates the retrieved information into its response
6. The final response is sent back to the user

## Usage

The backend will automatically load the system instruction from this file. If the file doesn't exist, it will fall back to the `GEMINI_SYSTEM_INSTRUCTION` environment variable.

## Customization

### System Instructions
You can modify the `system_instruction.txt` file to change how the AI behaves:
- Update the role description
- Add specific capabilities
- Modify the tone and style
- Include domain-specific knowledge

### Context Files
You can add or modify files in the `general_info_bitmark/` folder:
- Add new markdown files with additional information
- Update existing files with new content
- Organize information by topic or category

### Adding New Tools
To add new tool functions:
1. Add the function to `tool_functions.py`
2. Add the function declaration to `get_function_declarations()`
3. Add the function to the `function_map` in `execute_function_call()`

## Architecture

The backend uses a modular architecture:

- `main.py` - FastAPI application and endpoints
- `models.py` - Pydantic models for request/response
- `tool_functions.py` - Tool functions and declarations
- `gemini_helpers.py` - Gemini API interaction helpers
- `context-prompts/` - Context files and system instructions

## Changes Take Effect

The changes will take effect the next time the backend is restarted.
