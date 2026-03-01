/**
 * FocusIn – Strategic Performance Management
 * Express REST API Server
 *
 * Handles:
 *  - Authentication  (signup / signin / signout / me / profile update)
 *  - KPIs            (CRUD)
 *  - Balanced Scorecard items (CRUD)
 *  - Initiatives     (CRUD)
 *  - Strategies      (CRUD)
 *  - Departments     (CRUD)
 *  - AI Chat         (Gemini 2.0 Flash)
 *  - Static file serving for the Vite production build
 */

import express from 'express';
import { createHash, randomUUID } from 'crypto';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import db from './db.js';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

// ─── Helpers ────────────────────────────────────────────────────────────────

const hashPassword = (p: string) =>
  createHash('sha256').update(p).digest('hex');

// Auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const session = db
    .prepare('SELECT * FROM sessions WHERE token = ?')
    .get(token) as any;
  if (!session) return res.status(401).json({ error: 'Invalid session' });
  req.userId = session.user_id;
  next();
};

// ─── Auth ────────────────────────────────────────────────────────────────────

app.post('/api/auth/signup', (req, res) => {
  const { firstName, lastName, email, password, company } = req.body;
  if (!email || !password || !firstName)
    return res.status(400).json({ error: 'Missing required fields' });

  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(email);
  if (existing)
    return res.status(409).json({ error: 'Email already in use' });

  const id = randomUUID();
  const name = `${firstName} ${lastName || ''}`.trim();

  db.prepare(
    'INSERT INTO users (id, email, password_hash, name, company) VALUES (?, ?, ?, ?, ?)'
  ).run(id, email, hashPassword(password), name, company || '');

  seedUserData(id);

  const token = randomUUID();
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(
    token,
    id
  );

  res.json({ token, user: { id, name, email, company: company || '' } });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  const user = db
    .prepare(
      'SELECT * FROM users WHERE email = ? AND password_hash = ?'
    )
    .get(email, hashPassword(password)) as any;
  if (!user)
    return res.status(401).json({ error: 'Invalid email or password' });

  const token = randomUUID();
  db.prepare('INSERT INTO sessions (token, user_id) VALUES (?, ?)').run(
    token,
    user.id
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, company: user.company },
  });
});

app.post('/api/auth/signout', requireAuth, (req: any, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req: any, res) => {
  const user = db
    .prepare('SELECT id, name, email, company FROM users WHERE id = ?')
    .get(req.userId) as any;
  res.json(user);
});

app.put('/api/auth/profile', requireAuth, (req: any, res) => {
  const { name, company } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  db.prepare('UPDATE users SET name=?, company=? WHERE id=?').run(name, company || '', req.userId);
  const user = db.prepare('SELECT id, name, email, company FROM users WHERE id = ?').get(req.userId) as any;
  res.json(user);
});

app.put('/api/auth/password', requireAuth, (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Missing fields' });
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
  if (user.password_hash !== hashPassword(currentPassword))
    return res.status(401).json({ error: 'Current password is incorrect' });
  db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hashPassword(newPassword), req.userId);
  res.json({ ok: true });
});

// ─── KPIs ────────────────────────────────────────────────────────────────────

app.get('/api/kpis', requireAuth, (req: any, res) => {
  const kpis = db
    .prepare('SELECT * FROM kpis WHERE user_id = ? ORDER BY created_at')
    .all(req.userId);
  res.json(kpis);
});

app.post('/api/kpis', requireAuth, (req: any, res) => {
  const { name, objective, target, baseline, actual, unit } = req.body;
  const id = randomUUID();
  db.prepare(
    'INSERT INTO kpis (id, user_id, name, objective, target, baseline, actual, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, req.userId, name, objective, target, baseline, actual, unit);
  res.json({ id, name, objective, target, baseline, actual, unit });
});

app.put('/api/kpis/:id', requireAuth, (req: any, res) => {
  const { name, objective, target, baseline, actual, unit } = req.body;
  db.prepare(
    'UPDATE kpis SET name=?, objective=?, target=?, baseline=?, actual=?, unit=? WHERE id=? AND user_id=?'
  ).run(name, objective, target, baseline, actual, unit, req.params.id, req.userId);
  res.json({ ok: true });
});

app.delete('/api/kpis/:id', requireAuth, (req: any, res) => {
  db.prepare('DELETE FROM kpis WHERE id=? AND user_id=?').run(
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

// ─── BSC ─────────────────────────────────────────────────────────────────────

app.get('/api/bsc', requireAuth, (req: any, res) => {
  const items = db
    .prepare('SELECT * FROM bsc_items WHERE user_id = ? ORDER BY created_at')
    .all(req.userId);
  res.json(items);
});

app.post('/api/bsc', requireAuth, (req: any, res) => {
  const { perspective, objective, kpi, target, actual, status } = req.body;
  const id = randomUUID();
  db.prepare(
    'INSERT INTO bsc_items (id, user_id, perspective, objective, kpi, target, actual, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    id,
    req.userId,
    perspective,
    objective,
    kpi,
    target,
    actual,
    status || 'On Track'
  );
  res.json({ id, perspective, objective, kpi, target, actual, status });
});

app.put('/api/bsc/:id', requireAuth, (req: any, res) => {
  const { perspective, objective, kpi, target, actual, status } = req.body;
  db.prepare(
    'UPDATE bsc_items SET perspective=?, objective=?, kpi=?, target=?, actual=?, status=? WHERE id=? AND user_id=?'
  ).run(
    perspective,
    objective,
    kpi,
    target,
    actual,
    status,
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

app.delete('/api/bsc/:id', requireAuth, (req: any, res) => {
  db.prepare('DELETE FROM bsc_items WHERE id=? AND user_id=?').run(
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

// ─── Initiatives ──────────────────────────────────────────────────────────────

app.get('/api/initiatives', requireAuth, (req: any, res) => {
  const items = db
    .prepare('SELECT * FROM initiatives WHERE user_id = ? ORDER BY created_at')
    .all(req.userId);
  res.json(items);
});

app.post('/api/initiatives', requireAuth, (req: any, res) => {
  const { name, owner, progress, budget, status } = req.body;
  const id = randomUUID();
  db.prepare(
    'INSERT INTO initiatives (id, user_id, name, owner, progress, budget, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, req.userId, name, owner, progress ?? 0, budget || '', status || 'Active');
  res.json({ id, name, owner, progress, budget, status });
});

app.put('/api/initiatives/:id', requireAuth, (req: any, res) => {
  const { name, owner, progress, budget, status } = req.body;
  db.prepare(
    'UPDATE initiatives SET name=?, owner=?, progress=?, budget=?, status=? WHERE id=? AND user_id=?'
  ).run(name, owner, progress, budget, status, req.params.id, req.userId);
  res.json({ ok: true });
});

app.delete('/api/initiatives/:id', requireAuth, (req: any, res) => {
  db.prepare('DELETE FROM initiatives WHERE id=? AND user_id=?').run(
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

// ─── Strategies ───────────────────────────────────────────────────────────────

app.get('/api/strategies', requireAuth, (req: any, res) => {
  const items = db
    .prepare('SELECT * FROM strategies WHERE user_id = ? ORDER BY created_at')
    .all(req.userId);
  res.json(items);
});

app.post('/api/strategies', requireAuth, (req: any, res) => {
  const { name, period, status, pillars, objectives } = req.body;
  const id = randomUUID();
  db.prepare(
    'INSERT INTO strategies (id, user_id, name, period, status, pillars, objectives) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    id,
    req.userId,
    name,
    period,
    status || 'Active',
    pillars ?? 0,
    objectives ?? 0
  );
  res.json({ id, name, period, status, pillars, objectives });
});

app.put('/api/strategies/:id', requireAuth, (req: any, res) => {
  const { name, period, status, pillars, objectives } = req.body;
  db.prepare(
    'UPDATE strategies SET name=?, period=?, status=?, pillars=?, objectives=? WHERE id=? AND user_id=?'
  ).run(name, period, status, pillars ?? 0, objectives ?? 0, req.params.id, req.userId);
  res.json({ ok: true });
});

app.delete('/api/strategies/:id', requireAuth, (req: any, res) => {
  db.prepare('DELETE FROM strategies WHERE id=? AND user_id=?').run(
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

// ─── Departments ──────────────────────────────────────────────────────────────

app.get('/api/departments', requireAuth, (req: any, res) => {
  const items = db
    .prepare('SELECT * FROM departments WHERE user_id = ? ORDER BY created_at')
    .all(req.userId);
  res.json(items);
});

app.post('/api/departments', requireAuth, (req: any, res) => {
  const { name, head, parent_id, members } = req.body;
  const id = randomUUID();
  db.prepare(
    'INSERT INTO departments (id, user_id, name, head, parent_id, members) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, req.userId, name, head, parent_id || null, members ?? 0);
  res.json({ id, name, head, parent_id, members });
});

app.put('/api/departments/:id', requireAuth, (req: any, res) => {
  const { name, head, parent_id, members } = req.body;
  db.prepare(
    'UPDATE departments SET name=?, head=?, parent_id=?, members=? WHERE id=? AND user_id=?'
  ).run(name, head, parent_id || null, members, req.params.id, req.userId);
  res.json({ ok: true });
});

app.delete('/api/departments/:id', requireAuth, (req: any, res) => {
  db.prepare('DELETE FROM departments WHERE id=? AND user_id=?').run(
    req.params.id,
    req.userId
  );
  res.json({ ok: true });
});

// ─── Chat (Gemini AI) ─────────────────────────────────────────────────────────

app.post('/api/chat', requireAuth, async (req: any, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured. Please set GEMINI_API_KEY.' });
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction:
          'You are a strategic performance management expert and advisor specializing in KPIs, Balanced Scorecard (BSC), organizational strategy, performance measurement frameworks, OKRs, and strategic planning. Help users optimize their strategic planning and performance management with clear, actionable insights. Be concise but thorough.',
      },
      contents,
    });
    res.json({ reply: response.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI service error' });
  }
});

// ─── Seed Data ────────────────────────────────────────────────────────────────

function seedUserData(userId: string) {
  const kpiStmt = db.prepare(
    'INSERT INTO kpis (id, user_id, name, objective, target, baseline, actual, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  [
    { name: 'Customer Satisfaction (CSI)', objective: 'Improve Service Quality', target: 95, baseline: 70, actual: 88, unit: '%' },
    { name: 'Annual Revenue Growth', objective: 'Expand Market Share', target: 25, baseline: 5, actual: 18, unit: '%' },
    { name: 'Operational Cost Reduction', objective: 'Optimize Resource Allocation', target: 15, baseline: 0, actual: 12, unit: '%' },
    { name: 'Employee Training Hours', objective: 'Enhance Human Capital', target: 40, baseline: 10, actual: 45, unit: 'hrs' },
    { name: 'Digital Service Adoption', objective: 'Accelerate Digital Transformation', target: 80, baseline: 30, actual: 65, unit: '%' },
  ].forEach((k) =>
    kpiStmt.run(randomUUID(), userId, k.name, k.objective, k.target, k.baseline, k.actual, k.unit)
  );

  const bscStmt = db.prepare(
    'INSERT INTO bsc_items (id, user_id, perspective, objective, kpi, target, actual, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  [
    { perspective: 'financial', objective: 'Increase Revenue', kpi: 'Revenue Growth', target: '15%', actual: '12%', status: 'On Track' },
    { perspective: 'financial', objective: 'Reduce Costs', kpi: 'OpEx Reduction', target: '10%', actual: '8%', status: 'On Track' },
    { perspective: 'customer', objective: 'Improve Satisfaction', kpi: 'CSAT Score', target: '90%', actual: '85%', status: 'On Track' },
    { perspective: 'customer', objective: 'Expand Market Share', kpi: 'Market Share', target: '25%', actual: '22%', status: 'On Track' },
    { perspective: 'internal', objective: 'Optimize Processes', kpi: 'Process Efficiency', target: '95%', actual: '92%', status: 'On Track' },
    { perspective: 'internal', objective: 'Enhance Quality', kpi: 'Defect Rate', target: '<2%', actual: '1.5%', status: 'Achieved' },
    { perspective: 'learning', objective: 'Develop Skills', kpi: 'Training Hours', target: '40h', actual: '35h', status: 'On Track' },
    { perspective: 'learning', objective: 'Foster Innovation', kpi: 'New Ideas Implemented', target: '10', actual: '8', status: 'On Track' },
  ].forEach((b) =>
    bscStmt.run(randomUUID(), userId, b.perspective, b.objective, b.kpi, b.target, b.actual, b.status)
  );

  const initStmt = db.prepare(
    'INSERT INTO initiatives (id, user_id, name, owner, progress, budget, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  [
    { name: 'Digital Transformation Initiative', owner: 'Sarah Johnson', progress: 75, budget: 'SAR 2.5M', status: 'Active' },
    { name: 'Customer Experience Enhancement', owner: 'David Miller', progress: 45, budget: 'SAR 1.2M', status: 'Active' },
    { name: 'Operational Efficiency Program', owner: 'Emma Wilson', progress: 90, budget: 'SAR 800K', status: 'Completed' },
  ].forEach((i) =>
    initStmt.run(randomUUID(), userId, i.name, i.owner, i.progress, i.budget, i.status)
  );

  const stratStmt = db.prepare(
    'INSERT INTO strategies (id, user_id, name, period, status, pillars, objectives) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  [
    { name: 'Vision 2030 Alignment', period: '2024-2030', status: 'Active', pillars: 4, objectives: 12 },
    { name: 'Digital First Strategy', period: '2024-2026', status: 'Active', pillars: 3, objectives: 8 },
  ].forEach((s) =>
    stratStmt.run(randomUUID(), userId, s.name, s.period, s.status, s.pillars, s.objectives)
  );

  const deptStmt = db.prepare(
    'INSERT INTO departments (id, user_id, name, head, parent_id, members) VALUES (?, ?, ?, ?, ?, ?)'
  );
  [
    { name: 'Operations', head: 'David Miller', members: 25 },
    { name: 'Finance', head: 'Emma Wilson', members: 15 },
    { name: 'Human Resources', head: 'Lisa Brown', members: 10 },
    { name: 'Technology', head: 'Alex Chen', members: 30 },
    { name: 'Strategy', head: 'Sarah Johnson', members: 8 },
  ].forEach((d) =>
    deptStmt.run(randomUUID(), userId, d.name, d.head, null, d.members)
  );
}

// ─── Static Files (Production) ────────────────────────────────────────────────
// In production, Express serves the Vite-built React app.
// The Vite build outputs to /dist (one level above /server).
// Any non-/api path falls through to index.html for client-side routing.

if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ─── Start ────────────────────────────────────────────────────────────────────

// Use PORT from environment (required by Render / Railway / Fly.io),
// fallback to 3001 for local development.
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () =>
  console.log(`FocusIn backend running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`)
);
