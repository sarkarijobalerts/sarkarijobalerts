import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../../frontend/out');

export async function deployToHostinger() {
  console.log('🚀 Initiating Hostinger deployment for sarkarijobalerts.com...');
  console.log('Target directory:', outDir);

  if (!fs.existsSync(outDir)) {
    throw new Error(`Build output directory does not exist: ${outDir}`);
  }

  return new Promise((resolve, reject) => {
    const mcpProcess = spawn('npx.cmd', ['--package=@hostinger/mcp@latest', 'hostinger-hosting-mcp'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      env: {
        ...process.env,
        USER_AGENT: 'extension;antigravity;1.4.7',
      },
    });

    let buffer = '';
    let initialized = false;
    let hasError = false;

    mcpProcess.stdout.on('data', (data) => {
      const text = data.toString();
      buffer += text;

      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line.trim());
          if (msg.id === 1) {
            initialized = true;
            // Send standard MCP initialized notification
            mcpProcess.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

            // Send tools/call for hosting_deploy with the directory directly
            const deployReq = {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/call',
              params: {
                name: 'execute',
                arguments: {
                  operation: 'hosting_deploy',
                  params: {
                    domain: 'sarkarijobalerts.com',
                    path: outDir,
                    type: 'static',
                  },
                },
              },
            };
            mcpProcess.stdin.write(JSON.stringify(deployReq) + '\n');
          } else if (msg.id === 2) {
            console.log('Deploy Result:', JSON.stringify(msg.result || msg.error));
            if (msg.error || msg.result?.isError) {
              hasError = true;
              mcpProcess.stdin.end();
              return reject(new Error(`Hostinger deploy failed: ${JSON.stringify(msg.result || msg.error)}`));
            }

            // Send tools/call to clear cache using hosting_cache_clear
            const cacheReq = {
              jsonrpc: '2.0',
              id: 3,
              method: 'tools/call',
              params: {
                name: 'execute',
                arguments: {
                  operation: 'hosting_cache_clear',
                  params: {
                    domain: 'sarkarijobalerts.com',
                    username: 'u340027669',
                  },
                },
              },
            };
            mcpProcess.stdin.write(JSON.stringify(cacheReq) + '\n');
          } else if (msg.id === 3) {
            console.log('Cache Clear Result:', JSON.stringify(msg.result || msg.error));
            mcpProcess.stdin.end();
            resolve({ success: true });
          }
        } catch (e) {
          // Non-JSON output (debug/log)
        }
      }
    });

    mcpProcess.stderr.on('data', (err) => {
      // ignore debug logs
    });

    mcpProcess.on('error', (err) => {
      reject(err);
    });

    mcpProcess.on('close', (code) => {
      if (hasError) return;
      if (code !== 0 && !initialized) {
        reject(new Error(`MCP Process exited with code ${code}`));
      } else {
        resolve({ success: true });
      }
    });

    // Send initialize request
    const initReq = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'hostinger-deployer', version: '1.0.0' },
      },
    };
    mcpProcess.stdin.write(JSON.stringify(initReq) + '\n');
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  deployToHostinger()
    .then(() => {
      console.log('✅ Deployment and cache purge completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Deployment error:', err.message);
      process.exit(1);
    });
}
