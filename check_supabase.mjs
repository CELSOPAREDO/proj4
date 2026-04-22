import https from 'https';

const TOKEN = 'sbp_f687001e227aa9a5e37feea5a45c65cb03086fab';
const PROJECT_REF = 'ptcfxueeozlbegfnxrqg'; // Extracted from your URL

console.log('Fetching your Supabase projects...');

const options = {
  hostname: 'api.supabase.com',
  path: '/v1/projects',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/json',
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`Error: Failed to fetch projects. Status: ${res.statusCode}`);
      console.error(data);
      return;
    }

    try {
      const projects = JSON.parse(data);
      console.log(`Found ${projects.length} project(s).\n`);

      const myProject = projects.find(p => p.id === PROJECT_REF);
      
      if (myProject) {
        console.log('--- Project Info ---');
        console.log(`Name: ${myProject.name}`);
        console.log(`Status: ${myProject.status}`);
        console.log(`Region: ${myProject.region}`);
        console.log('--------------------\n');
        
        if (myProject.status === 'INACTIVE' || myProject.status === 'PAUSED') {
          console.log(`⚠️ Your project is currently ${myProject.status}.`);
          console.log(`Please go to https://supabase.com/dashboard/project/${PROJECT_REF} to restore it.`);
        } else {
          console.log(`✅ Your project is ${myProject.status}. If you still get 'fetch failed', it might be booting up.`);
        }
      } else {
        console.log(`Could not find project with ref: ${PROJECT_REF}`);
        console.log('Here are your available projects:');
        projects.forEach(p => console.log(`- ${p.name} (Ref: ${p.id}) [Status: ${p.status}]`));
        console.log('\nIf your project ref changed, please update your .env.local file with the new URL.');
      }
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
});

req.on('error', (error) => {
  console.error('Network Error:', error);
});

req.end();
