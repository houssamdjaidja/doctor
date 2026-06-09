import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'doctor',
  password: process.env.DB_PASSWORD || 'doctor123',
  database: process.env.DB_NAME || 'doctor',
});

function toPg(sql: string, params: any[]): { text: string; values: any[] } {
  let idx = 0;
  const text = sql.replace(/\?/g, () => `$${++idx}`);
  return { text, values: params };
}

async function get<T = any>(sql: string, ...params: any[]): Promise<T | undefined> {
  const { text, values } = toPg(sql, params);
  const result = await pool.query(text, values);
  return result.rows[0] as T | undefined;
}

async function all<T = any>(sql: string, ...params: any[]): Promise<T[]> {
  const { text, values } = toPg(sql, params);
  const result = await pool.query(text, values);
  return result.rows as T[];
}

async function run(sql: string, ...params: any[]): Promise<{ rowCount: number; rows: any[] }> {
  const { text, values } = toPg(sql, params);
  const result = await pool.query(text, values);
  return { rowCount: result.rowCount ?? 0, rows: result.rows };
}

export async function initializeDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      verification_code TEXT DEFAULT NULL,
      reset_code TEXT DEFAULT NULL,
      reset_code_expires TIMESTAMP DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      motif TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','completed','cancelled','in-progress')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'general',
      image_url TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT 'Dr. Amine Benali',
      published BOOLEAN NOT NULL DEFAULT FALSE,
      featured BOOLEAN NOT NULL DEFAULT FALSE,
      views INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS faq_categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT 'HelpCircle',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faq_items (
      id SERIAL PRIMARY KEY,
      category_id INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES faq_categories(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patient_messages (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      reply TEXT DEFAULT NULL,
      reply_at TIMESTAMP DEFAULT NULL,
      read_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
      read_by_patient BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS patient_documents (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_data TEXT NOT NULL,
      file_size INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
    );

    ALTER TABLE patients ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE patients ADD COLUMN IF NOT EXISTS verification_code TEXT DEFAULT NULL;
    ALTER TABLE patients ADD COLUMN IF NOT EXISTS reset_code TEXT DEFAULT NULL;
    ALTER TABLE patients ADD COLUMN IF NOT EXISTS reset_code_expires TIMESTAMP DEFAULT NULL;
  `);
}

export { get, all, run };
export default { get, all, run, initializeDatabase };
