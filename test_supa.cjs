const { createClient } = require('@supabase/supabase-js');

const url = 'https://mamfcvqixiaaosonsmzc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hbWZjdnFpeGlhYW9zb25zbXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTkxNjUsImV4cCI6MjA5MDQzNTE2NX0.I-ED08X-0m2Y3xQOpnmfa74dyQWUQCso5EcciWRmd6U';

const supabase = createClient(url, key);

async function run() {
  console.log("Testing tasks table select...");
  const { data, error } = await supabase.from('tasks').select('*');
  console.log("Data:", data);
  console.log("Error:", error);
  
  if (!error) {
     console.log("Testing tasks table insert...");
     const { data: iData, error: iErr } = await supabase.from('tasks').insert([{ title: 'Diagnostic Test', status: 'backlog' }]);
     console.log("Insert Error:", iErr);
  }
}
run();
