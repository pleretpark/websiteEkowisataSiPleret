// Check Berita and Visitor tables in Supabase
async function main() {
  const supabaseUrl = 'https://hkthyztpjtpsuiagqqhq.supabase.co'
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdGh5enRwanRwc3VpYWdxcWhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjYyNTI5MywiZXhwIjoyMDk4MjAxMjkzfQ.cMdG0DcyRiKqmn8kYN_HnzShE-LgGTb3XrkNc0OZxcg'
  const headers = { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` }

  // Check 'berita' (lowercase - what frontend uses)
  const beritaLower = await fetch(`${supabaseUrl}/rest/v1/berita?select=*&limit=1`, { headers })
  console.log('berita (lowercase) status:', beritaLower.status)
  console.log('berita response:', (await beritaLower.text()).substring(0, 300))

  // Check 'Berita' (PascalCase - what Prisma created)
  const beritaUpper = await fetch(`${supabaseUrl}/rest/v1/Berita?select=*&limit=1`, { headers })
  console.log('\nBerita (PascalCase) status:', beritaUpper.status)
  console.log('Berita response:', (await beritaUpper.text()).substring(0, 300))

  // Check 'Visitor'
  const visitor = await fetch(`${supabaseUrl}/rest/v1/Visitor?select=*&limit=1`, { headers })
  console.log('\nVisitor status:', visitor.status)
  console.log('Visitor response:', (await visitor.text()).substring(0, 300))

  // Check all available table names from the OpenAPI spec
  const openapi = await fetch(`${supabaseUrl}/rest/v1/`, { headers })
  const spec = await openapi.json()
  const tables = Object.keys(spec.paths || {}).filter(p => p !== '/').map(p => p.replace('/', ''))
  console.log('\n=== ALL TABLES IN DATABASE ===')
  console.log(tables.join(', '))
}

main().catch(console.error)
