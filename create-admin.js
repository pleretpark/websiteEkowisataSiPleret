require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@tingkirtengah.id',
    password: 'admin123password',
    email_confirm: true,
  });

  if (error) {
    console.error('Error creating admin:', error);
  } else {
    console.log('Admin user created successfully:', data.user.id);
  }
}

createAdmin();
