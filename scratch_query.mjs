import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iucoyctxigafrcaoctrq.supabase.co';
const supabaseKey = 'sb_publishable_1Nm8O34DKCW6-jykXDeCIQ_f0XisXgR';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  console.log('Profiles error:', error);
  console.log('Profiles:', profiles);
}
check();
