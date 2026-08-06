const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const serviceClient = createClient(supabaseUrl, serviceRoleKey);

async function listTables() {
  const { data, error } = await serviceClient
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .order('table_name');

  if (error) {
    console.error('Error fetching tables:', error);
    return [];
  }

  return data.map(row => row.table_name);
}

listTables().then(tables => {
  console.log('Tables in public schema:');
  tables.forEach(t => console.log('- ' + t));
}).catch(console.error);