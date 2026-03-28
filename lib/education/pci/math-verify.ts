import { execFile } from 'node:child_process';
import path from 'node:path';

export interface MathVerifyResult {
  equivalent: boolean;
  error?: string;
}

function execFileWithPromise(command: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(command, args, { timeout: timeoutMs, maxBuffer: 512 * 1024 }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

export async function verifyMathExpression(
  expression: string,
  expected: string,
): Promise<MathVerifyResult> {
  const pythonCommand = process.env.PYTHON_EXECUTABLE || 'python';
  const scriptPath = path.join(process.cwd(), 'lib', 'math', 'executor', 'math_verify.py');

  const raw = await execFileWithPromise(
    pythonCommand,
    [scriptPath, '--expression', expression, '--expected', expected],
    4000,
  );

  const parsed = JSON.parse(raw) as MathVerifyResult;
  return parsed;
}
