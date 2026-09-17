// Seeds ~50 placeholder members into your Supabase project.
//
// This uses the Supabase SERVICE ROLE key (not the public anon key) because
// creating auth users must be done from a trusted server context, never
// from the browser. Never commit your service role key or put it in the
// React app's .env — it bypasses Row Level Security entirely.
//
// Usage:
//   1. npm install (if you haven't already)
//   2. In your terminal (not in a committed file):
//        export SUPABASE_URL=https://your-project-ref.supabase.co
//        export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
//   3. npm run seed
//
// Each placeholder member gets a login: member01@jstu-robotics.placeholder
// through member50@..., all with password "ChangeMe123!" — tell real
// members to sign up properly instead, or reset these later. This script
// is just to preview the directory with 50 populated cards.

import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables first.')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const departments = ['EEE', 'CSE', 'ME', 'CE', 'BBA', 'Textile', 'Architecture']
const roles = ['Member', 'Member', 'Member', 'Member', 'Project Team', 'Workshop Coordinator', 'Hardware Lead', 'Software Lead', 'Media Team', 'General Secretary', 'Vice President', 'President']
const batches = ['2020-21', '2021-22', '2022-23', '2023-24', '2024-25']
const skillPool = ['Arduino', 'Raspberry Pi', 'CAD', 'ROS', 'Embedded C', 'Python', 'PCB Design', '3D Printing', 'Computer Vision', 'PID Control', 'Soldering', 'React']

const firstNames = ['Rafi', 'Nusrat', 'Tanvir', 'Sadia', 'Fahim', 'Mim', 'Arif', 'Samira', 'Nayeem', 'Priya', 'Shakil', 'Farhana', 'Rakib', 'Ishrat', 'Tamim', 'Lubna', 'Sabbir', 'Nadia', 'Rezwan', 'Sumaiya', 'Adib', 'Tasnim', 'Imran', 'Rima', 'Zahin', 'Anika', 'Rashed', 'Mahi', 'Faisal', 'Jarin', 'Sourav', 'Nabila', 'Hasib', 'Ruma', 'Omar', 'Sadika', 'Tahsin', 'Elma', 'Rakin', 'Payel', 'Nafis', 'Shorna', 'Wasif', 'Tania', 'Ahnaf', 'Meherin', 'Raihan', 'Lamia', 'Sajid', 'Prima']
const lastNames = ['Islam', 'Ahmed', 'Rahman', 'Hossain', 'Chowdhury', 'Akter', 'Khan', 'Karim', 'Uddin', 'Alam']

function pick(arr, i) {
  return arr[i % arr.length]
}

async function seed() {
  console.log('Seeding 50 placeholder members…')

  for (let i = 1; i <= 50; i++) {
    const first = pick(firstNames, i - 1)
    const last = pick(lastNames, i + 3)
    const fullName = `${first} ${last}`
    const email = `member${String(i).padStart(2, '0')}@jstu-robotics.placeholder`

    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password: 'ChangeMe123!',
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (userError) {
      console.error(`  [${i}] Failed to create auth user for ${fullName}:`, userError.message)
      continue
    }

    const skills = [pick(skillPool, i), pick(skillPool, i + 4), pick(skillPool, i + 8)]

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role_title: pick(roles, i),
        department: pick(departments, i),
        batch_session: pick(batches, i),
        student_id: `${170000 + i * 37}`,
        bio: `Placeholder bio for ${fullName}. Log in and edit this profile to replace it with something real.`,
        skills,
        achievements: 'Placeholder achievement — edit this profile to add real ones.',
        joined_at: new Date(2023, i % 12, (i % 27) + 1).toISOString().slice(0, 10),
      })
      .eq('id', userData.user.id)

    if (profileError) {
      console.error(`  [${i}] Failed to update profile for ${fullName}:`, profileError.message)
      continue
    }

    console.log(`  [${i}/50] Created ${fullName} (${email})`)
  }

  console.log('Done. Remember: these are throwaway placeholder logins — delete them from')
  console.log('Supabase Authentication once real members have signed up.')
}

seed()
