import { execFile } from 'node:child_process';
import path from 'node:path';

export interface WordProblemAnimationParams {
  mode: 'meeting' | 'chase';
  distance: number;
  speedA: number;
  speedB: number;
  frameCount: number;
}

export interface WordProblemAnimationResult {
  mode: 'meeting' | 'chase';
  meetTime: number;
  simulationDuration: number;
  axisMax: number;
  frames: Array<{
    t: number;
    posA: number;
    posB: number;
    met: boolean;
  }>;
}

function execFileWithPromise(command: string, args: string[], timeoutMs: number): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(command, args, { timeout: timeoutMs, maxBuffer: 1024 * 1024 }, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

export async function runWordProblemAnimationPython(
  params: WordProblemAnimationParams,
): Promise<WordProblemAnimationResult> {
  const pythonCommand = process.env.PYTHON_EXECUTABLE || 'python';
  const scriptPath = path.join(
    process.cwd(),
    'lib',
    'math',
    'executor',
    'word_problem_animator.py',
  );

  const args = [
    scriptPath,
    '--mode',
    params.mode,
    '--distance',
    String(params.distance),
    '--speed-a',
    String(params.speedA),
    '--speed-b',
    String(params.speedB),
    '--frame-count',
    String(params.frameCount),
  ];

  const raw = await execFileWithPromise(pythonCommand, args, 4000);
  const parsed = JSON.parse(raw) as WordProblemAnimationResult;

  if (!parsed || !Array.isArray(parsed.frames)) {
    throw new Error('Invalid Python animation output');
  }

  return parsed;
}
