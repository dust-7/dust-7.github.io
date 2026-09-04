# Testing
- Use vitest-browser-react instead of @testing-library/react.
- Do not import `screen`. Instead, use `await render(<Component />)`.

# Scripts
- `npm run lint`: Linting using oxlint
- `npm test`: Standard test command using Vitest
- `npm test -- path/to/test/`: Runs test files from a specific path
- `npm run build`: Standard build command using Vite