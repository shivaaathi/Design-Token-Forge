const axios = require('axios');

// Get Figma token from environment or hardcode (be careful with security)
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

if (!FIGMA_TOKEN) {
  console.error('❌ Error: FIGMA_TOKEN environment variable is not set');
  console.log('📝 Set it using: export FIGMA_TOKEN="your_token_here"');
  process.exit(1);
}

const figmaAPI = axios.create({
  baseURL: 'https://api.figma.com/v1',
  headers: {
    'X-Figma-Token': FIGMA_TOKEN,
  },
});

async function testFigmaConnection() {
  try {
    console.log('🔍 Testing Figma API connection...\n');

    // First test: Get user info to verify token
    const userRes = await figmaAPI.get('/me');
    console.log(`✅ Token is valid! User: ${userRes.data.name}\n`);

    // Get all files in the workspace/team
    const filesRes = await figmaAPI.get('/team/[TEAM_ID]/projects');
    console.log(`✅ Connected to Figma! Found ${filesRes.data.projects?.length || 0} projects\n`);

    // Find the "Desktop Color Tokens- Dec 2025" file
    const targetFile = filesRes.data.files?.find(f => 
      f.name.includes('Desktop Color Tokens') && f.name.includes('Dec 2025')
    );

    if (!targetFile) {
      console.log('❌ File "Desktop Color Tokens- Dec 2025" not found');
      console.log('Available files:');
      filesRes.data.files?.forEach(f => console.log(`  - ${f.name}`));
      return;
    }

    console.log(`✅ Found file: "${targetFile.name}" (ID: ${targetFile.key})\n`);

    // Get file details including variables
    const fileRes = await figmaAPI.get(`/files/${targetFile.key}/variables/local`);
    const variables = fileRes.data.variables || [];
    
    console.log(`📊 Found ${variables.length} local variables\n`);

    // Look for the comp size mode name variable
    const targetVar = variables.find(v => 
      v.name && v.name.includes('comp') && v.name.includes('size') && v.name.includes('base')
    );

    if (!targetVar) {
      console.log('❌ Variable with "comp size mode name base" not found');
      console.log('Available variables:');
      variables.forEach(v => console.log(`  - ${v.name}`));
      return;
    }

    console.log(`✅ Found variable: "${targetVar.name}"\n`);
    console.log(`📝 Current value: ${targetVar.name}`);
    console.log(`🔄 Changing to: "bass"\n`);

    // Update the variable name
    const updateRes = await figmaAPI.patch(`/files/${targetFile.key}/variables/${targetVar.id}`, {
      name: targetVar.name.replace('base', 'bass'),
    });

    console.log('✅ Successfully updated variable!');
    console.log(`📝 New name: ${updateRes.data.name}`);
    console.log('\n🎉 Figma MCP integration is working correctly!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.err || error.message);
    console.log('\n💡 Tips:');
    console.log('  - Ensure your FIGMA_TOKEN is valid');
    console.log('  - Check if the file name matches exactly');
    console.log('  - Verify you have permission to access this file');
  }
}

testFigmaConnection();
