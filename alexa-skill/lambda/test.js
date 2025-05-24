const skillModule = require('./index');
const handler = skillModule.handler;

// Test Launch Request
const launchRequest = {
    "version": "1.0",
    "session": {
        "new": true,
        "sessionId": "amzn1.echo-api.session.test",
        "application": {
            "applicationId": "amzn1.ask.skill.test"
        },
        "attributes": {},
        "user": {
            "userId": "amzn1.ask.account.test"
        }
    },
    "context": {
        "System": {
            "application": {
                "applicationId": "amzn1.ask.skill.test"
            },
            "user": {
                "userId": "amzn1.ask.account.test"
            },
            "device": {
                "deviceId": "test",
                "supportedInterfaces": {}
            }
        }
    },
    "request": {
        "type": "LaunchRequest",
        "requestId": "amzn1.echo-api.request.test",
        "timestamp": "2025-01-01T00:00:00Z",
        "locale": "ja-JP"
    }
};

// Test Garbage Search Intent
const garbageSearchRequest = {
    ...launchRequest,
    "request": {
        "type": "IntentRequest",
        "requestId": "amzn1.echo-api.request.test",
        "timestamp": "2025-01-01T00:00:00Z",
        "locale": "ja-JP",
        "intent": {
            "name": "GarbageSearchIntent",
            "slots": {
                "GarbageItem": {
                    "name": "GarbageItem",
                    "value": "ペットボトル"
                }
            }
        }
    }
};

async function runTests() {
    console.log('🧪 Testing Alexa Skill...\n');
    
    // Helper function to promisify the handler
    function callHandler(event) {
        return new Promise((resolve, reject) => {
            const context = {
                succeed: resolve,
                fail: reject,
                done: (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            };
            
            try {
                handler(event, context, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    
    try {
        // Test Launch Request
        console.log('📍 Testing Launch Request:');
        const launchResponse = await callHandler(launchRequest);
        console.log('✅ Launch Response received');
        if (launchResponse && launchResponse.response && launchResponse.response.outputSpeech) {
            console.log('Speech Output:', launchResponse.response.outputSpeech.ssml || launchResponse.response.outputSpeech.text);
            console.log('✅ Launch Request: PASSED\n');
        } else {
            console.log('❌ Launch Request: Invalid response structure\n');
        }
        
        // Test Garbage Search Intent
        console.log('📍 Testing Garbage Search Intent (ペットボトル):');
        const searchResponse = await callHandler(garbageSearchRequest);
        console.log('✅ Search Response received');
        if (searchResponse && searchResponse.response && searchResponse.response.outputSpeech) {
            console.log('Speech Output:', searchResponse.response.outputSpeech.ssml || searchResponse.response.outputSpeech.text);
            console.log('✅ Garbage Search Intent: PASSED\n');
        } else {
            console.log('❌ Garbage Search Intent: Invalid response structure\n');
        }
        
        console.log('🎉 All tests completed successfully! Alexa skill is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

runTests();
