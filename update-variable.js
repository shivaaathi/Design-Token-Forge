const axios = require('axios');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_ID = 'wA8IGbd3LWJ22RzHb2qGAe';

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

async function updateVariable() {
  try {
    console.log('🔍 Fetching file: Desktop Color Tokens- Dec 2025\n');
    
    // Get file details
    const fileRes = await figmaAPI.get(`/files/${FILE_ID}`);
    console.log(`✅ File found: "${fileRes.data.name}"\n`);

    // Get local variables
    console.log('📊 Fetching local variables...\n');
    const varsRes = await figmaAPI.get(`/files/${FILE_ID}/variables/local`);
    const variables = varsRes.data.variables || [];
    
    console.log(`✅ Found ${variables.length} local variables:\n`);
    variables.forEach(v => console.log(`   - ${v.name}`));

    // Find the target variable
    const targetVar = variables.find(v => 
      v.name && v.name.toLowerCase().includes('base')
    );

    if (!targetVar) {
      console.log(`\n❌ Variable with "base" in name not found`);
      return;
    }

    console.log(`\n✅ Found target variable: "${targetVar.name}"\n`);
    console.log(`🔄 Updating: "${targetVar.name}" → "bass"`);

    try {
      const updateRes = await figmaAPI.patch(`/files/${FILE_ID}/variables/${targetVar.id}`, {
        name: 'bass',
      });
      
      console.log(`\n✅ SUCCESS! Variable updated!`);
      console.log(`📝 New name: "${updateRes.data.name}"`);
      console.log('\n🎉 Figma MCP integration test complete!');
    } catch (updateError) {
      console.log(`\n⚠️  Update failed`);
      console.log(`❌ Error: ${updateError.response?.data?.err || updateError.message}`);
      console.log('\n💡 Possible causes:');
      console.log('   - Token lacks write permissions (file_content:write scope needed)');
      console.log('   - Variable might be locked or protected');
      console.log('   - File might not allow API mutations');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

updateVariable();
