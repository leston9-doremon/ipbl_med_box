import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

/**
 * Shared Supabase client instance.
 * 
 * Database Schema Reference:
 * 
 * 1. Table: `schedule`
 *    - `section`: integer (Primary Key, values 1-15)
 *    - `minutes`: integer (minutes since midnight, e.g., 480 = 8:00 AM, nullable)
 * 
 * 2. Table: `dispense_log`
 *    - `id`: bigint (Primary Key, identity)
 *    - `section`: integer
 *    - `dispensed_at`: timestamptz (default now())
 * 
 * 3. Table: `sensor_log`
 *    - `id`: bigint (Primary Key, identity)
 *    - `temp_c`: numeric (nullable)
 *    - `bpm`: integer (nullable)
 *    - `recorded_at`: timestamptz (default now())
 */
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
