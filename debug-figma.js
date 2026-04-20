const axios = require('axios');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('❌ Error: FIGMA_TOKEN environment variable is not set');
  process.exit(1);
}

const figmaAPI = axios.create({
  baseURL: 'https://api.figma.com/v1',
  headers: {
    'X-Figma-Token': FIGMA_TOKEN,
  },
});

async function debugFigmaAPI() {
  try {
    console.log('🔍 Step 1: Verify token is valid...\n');
    
    const userRes = await figmaAPI.get('/me');
    console.log(`✅ Token is valid!`);
    console.log(`👤 User: ${userRes.data.name}`);
    console.log(`🆔 User ID: ${userRes.data.id}\n`);

    console.log('🔍 Step 2: Get user teams...\n');
    
    const teamsRes = await figmaAPI.get('/teams');
    console.log(`✅ Found ${teamsRes.data.teams?.length || 0} teams\n`);
    
    if (teamsRes.data.teams && teamsRes.data.teams.length > 0) {
      const team = teamsRes.data.teams[0];
      const teamId = team.id;
      console.log(`📌 Using team: "${team.name}" (ID: ${teamId})\n`);

      console.log('🔍 Step 3: Get projects in team...\n');
      
      const projectsRes = await figmaAPI.get(`/teams/${teamId}/projects`);
      const projects = projectsRes.data.projects || [];
      console.log(`✅ Found ${projects.length} projects\n`);

      projects.forEach(p => console.log(`  📁 ${p.name}`));

      if (projects.length > 0) {
        const project = projects[0];
        console.log(`\n🔍 Step 4: Get files in project "${project.name}"...\n`);
        
        const filesRes = await figmaAPI.get(`/projects/${project.id}/files`);
        const files = filesRes.data.files || [];
        console.log(`✅ Found ${files.length} files\n`);

        files.forEach(f => console.log(`  📄 ${f.name}`));

        // Find Desktop Color Tokens file
        const targetFile = files.find(f => 
          f.name.includes('Desktop Color Tokens') && f.name.includes('Dec 2025')
        );

        if (targetFile) {
          console.log(`\n✅ Found target file: "${targetFile.name}" (ID: ${targetFile.key})`);
          console.log('\n🎉 You can now use this file ID to fetch variables!');
        } else {
          console.log(`\n❌ File "Desktop Color Tokens- Dec 2025" not found`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugFigmaAPI();
