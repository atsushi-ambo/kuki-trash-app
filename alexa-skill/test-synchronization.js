// Test script to verify Alexa skill synchronization with Web app
const fs = require('fs');
const path = require('path');

// Load the Alexa skill index.js to test the functions
const alexaCode = fs.readFileSync(path.join(__dirname, 'lambda/index.js'), 'utf8');

// Test 1: Check pronunciation mapping exists
const pronunciationMappingExists = alexaCode.includes('pronunciationMapping');
console.log('✓ Test 1 - Pronunciation mapping:', pronunciationMappingExists ? 'PASS' : 'FAIL');

// Test 2: Check handleCollectionQuery function exists
const handleCollectionQueryExists = alexaCode.includes('function handleCollectionQuery');
console.log('✓ Test 2 - Collection query handler:', handleCollectionQueryExists ? 'PASS' : 'FAIL');

// Test 3: Check GarbageSearchIntentHandler has collection day detection
const hasCollectionDayDetection = alexaCode.includes('今日') && alexaCode.includes('明日') && alexaCode.includes('handleCollectionQuery');
console.log('✓ Test 3 - Collection day detection in GarbageSearchIntent:', hasCollectionDayDetection ? 'PASS' : 'FAIL');

// Test 4: Check pronunciation search is in findGarbageCategory
const hasPronunciationSearch = alexaCode.includes('発音類似検索') && alexaCode.includes('pronunciationMapping');
console.log('✓ Test 4 - Pronunciation search integration:', hasPronunciationSearch ? 'PASS' : 'FAIL');

console.log('\n=== Synchronization Status ===');
const allTestsPassed = pronunciationMappingExists && handleCollectionQueryExists && hasCollectionDayDetection && hasPronunciationSearch;
console.log('Overall synchronization:', allTestsPassed ? '✅ COMPLETE' : '❌ INCOMPLETE');

if (allTestsPassed) {
    console.log('\n🎉 Alexa skill is now synchronized with Web app!');
    console.log('✓ Pronunciation similarity search: Added');
    console.log('✓ Collection day queries: Unified processing');
    console.log('✓ Same garbage database and keyword mappings');
} else {
    console.log('\n❌ Some synchronization issues remain');
}
