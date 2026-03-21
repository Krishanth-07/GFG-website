import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const runProcess = ({ command, args, cwd, timeout = 8000 }) =>
  new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd,
      shell: false,
      windowsHide: true,
    })

    let stdout = ''
    let stderr = ''
    let timedOut = false

    const timer = setTimeout(() => {
      timedOut = true
      child.kill()
    }, timeout)

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      resolve({ ok: false, stderr: err.message || 'Failed to start process.' })
    })

    child.on('close', (code) => {
      clearTimeout(timer)
      if (timedOut) {
        resolve({ ok: false, stderr: 'Execution timed out.' })
        return
      }
      resolve({ ok: code === 0, code, stdout, stderr })
    })
  })

const compilerApiPlugin = () => ({
  name: 'local-compiler-api',
  configureServer(server) {
    server.middlewares.use('/api/execute', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
        return
      }

      let raw = ''
      req.on('data', (chunk) => {
        raw += chunk.toString()
      })

      req.on('end', async () => {
        try {
          const { language, code } = JSON.parse(raw || '{}')
          if (!language || !code) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, error: 'language and code are required.' }))
            return
          }

          const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'gfg-compiler-'))

          try {
            let result

            if (language === 'JavaScript') {
              const filePath = path.join(tmpDir, 'main.js')
              await writeFile(filePath, code, 'utf8')
              result = await runProcess({ command: 'node', args: ['main.js'], cwd: tmpDir })
            } else if (language === 'Python') {
              const filePath = path.join(tmpDir, 'main.py')
              await writeFile(filePath, code, 'utf8')
              result = await runProcess({ command: 'python', args: ['main.py'], cwd: tmpDir })
            } else if (language === 'Java') {
              const filePath = path.join(tmpDir, 'Main.java')
              await writeFile(filePath, code, 'utf8')
              const compile = await runProcess({ command: 'javac', args: ['Main.java'], cwd: tmpDir, timeout: 12000 })
              if (!compile.ok) {
                result = { ok: false, stderr: compile.stderr || 'Java compilation failed.' }
              } else {
                result = await runProcess({ command: 'java', args: ['Main'], cwd: tmpDir, timeout: 12000 })
              }
            } else if (language === 'C++') {
              res.statusCode = 501
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'C++ compiler not found on this machine. Install MinGW-w64 or MSYS2 g++ and restart dev server.' }))
              return
            } else {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: 'Unsupported language.' }))
              return
            }

            if (result.ok) {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true, output: result.stdout || '(no output)' }))
            } else {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: false, error: result.stderr || 'Execution failed.' }))
            }
          } finally {
            await rm(tmpDir, { recursive: true, force: true })
          }
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'Failed to execute code.' }))
        }
      })
    })
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), compilerApiPlugin()],
})
