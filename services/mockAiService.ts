// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


import { MockAI } from '../mocks/MockAI';

export const debugScriptWithMockAI = async (script: string, error: string): Promise<string> => {
    const { suggestion, explanation } = MockAI.debugScript(script, error);
    return `### Mock AI Debugger Analysis
**Explanation:** ${explanation}

---

### Suggested Code
\`\`\`javascript
${suggestion}
\`\`\`
    `;
}
