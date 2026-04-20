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

async function findAndUpdateVariable() {
  try {
    console.log('🔍 Fetching teams...\n');
    
    const teamsRes = await figmaAPI.get('/teams');
    const teams = teamsRes.data.teams || [];
    
    if (teams.length === 0) {
      console.log('❌ No teams found');
      return;
    }

    console.log(`✅ Found ${teams.length} team(s)\n`);
    
    for (const team of teams) {
      console.log(`📌 Team: "${team.name}"\n`);
      
      // Get projects in this team
      const projectsRes = await figmaAPI.get(`/teams/${team.id}/projects`);
      const projects = projectsRes.data.projects || [];
      
      console.log(`   📁 Projects (${projects.length}):`);
      projects.forEach(p => console.log(`      - ${p.name}`));
      console.log();

      // Search for files in all projects
      for (const project of projects) {
        const filesRes = await figmaAPI.get(`/projects/${project.id}/files`);
        const files = filesRes.data.files || [];
        
        // Find the target file
        const targetFile = files.find(f => 
          f.name.includes('Desktop Color Tokens') && f.name.includes('Dec 2025')
        );

        if (targetFile) {
          console.log(`✅ FOUND IT! "${targetFile.name}"\n`);
          console.log(`   📄 File ID: ${targetFile.key}`);
          console.log(`   📁 Project: ${project.name}\n`);

          // Now fetch the file content to get variables
          console.log('🔍 Fetching file details...\n');
          const fileRes = await figmaAPI.get(`/files/${targetFile.key}`);
          const componentSets = fileRes.data.componentSets || [];
          
          console.log(`   Found ${componentSets.length} component sets`);
          
          // Check variables collection
          if (fileRes.data.variables) {
            console.log(`   Found variables collection`);
            
            // Try to update the variable using PATCH
            console.log('\n📝 Attempting to update variable...\n');
            
            // Get local variables
            const varsRes = await figmaAPI.get(`/files/${targetFile.key}/variables/local`);
            const variables = varsRes.data.variables || [];
            
            console.log(`   Total local variables: ${variables.length}\n`);
            console.log('   Variables:');
            variables.forEach(v => console.log(`      - ${v.name}`));
            
            // Look for the comp size mode name base variable
            const targetVar = variables.find(v => 
              v.name && v.name.toLowerCase().includes('base')
            );
            
            if (targetVar) {
              console.log(`\n   ✅ Found variable: "${targetVar.name}"\n`);
              console.log(`   🔄 Updating: "${targetVar.name}" → "bass"`);
              
              try {
                const updateRes = await figmaAPI.patch(`/files/${targetFile.key}/variables/${targetVar.id}`, {
                  name: 'bass',
                });
                
                console.log(`\n   ✅ SUCCESS! Variable updated to: "${updateRes.data.name}"`);
                console.log('\n   🎉 Figma MCP integration is working!');
              } catch (updateError) {
                console.log('\n   ℹ️  Note: Variable update may require additional permissions');
                console.log(`   Error: ${updateError.response?.data?.err || updateError.message}`);
              }
            } else {
              console.log(`\n   ❌ Variable with "base" in name not found`);
            }
          }
          
          return;
        }
      }
    }

    console.log('❌ File "Desktop Color Tokens- Dec 2025" not found in any project');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

findAndUpdateVariable();
