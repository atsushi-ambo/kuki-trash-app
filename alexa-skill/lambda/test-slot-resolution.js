// Test script to verify the slot resolution logic works
const { handler } = require('./index.js');

// Simulate the exact request from your test
const testRequest = {
    "version": "1.0",
    "session": {
        "new": false,
        "sessionId": "test-session",
        "application": {
            "applicationId": "test-app"
        },
        "attributes": {
            "userLocation": "kuki-a"
        },
        "user": {
            "userId": "test-user"
        }
    },
    "context": {},
    "request": {
        "type": "IntentRequest",
        "requestId": "test-request",
        "locale": "ja-JP",
        "timestamp": "2025-06-29T13:31:00Z",
        "intent": {
            "name": "SetLocationIntent",
            "confirmationStatus": "NONE",
            "slots": {
                "Location": {
                    "name": "Location",
                    "value": "久喜地区 d ブロック",
                    "resolutions": {
                        "resolutionsPerAuthority": [
                            {
                                "authority": "test-authority",
                                "status": {
                                    "code": "ER_SUCCESS_MATCH"
                                },
                                "values": [
                                    {
                                        "value": {
                                            "name": "久喜D",
                                            "id": "test-id"
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    "confirmationStatus": "NONE",
                    "source": "USER"
                }
            }
        }
    }
};

console.log('Testing SetLocationIntent with slot resolution...');
console.log('Input phrase: "久喜地区 d ブロック"');
console.log('Expected slot resolution: "久喜D"');
console.log('Expected final location: "kuki-d"');
console.log('---');

handler(testRequest, {}, (error, response) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Response speech:', response.response.outputSpeech.ssml);
    console.log('Session attributes:', response.sessionAttributes);
    
    // Check if the fix worked
    if (response.sessionAttributes.userLocation === 'kuki-d') {
        console.log('✅ SUCCESS: Location correctly set to kuki-d (Kuki D block)');
    } else {
        console.log('❌ FAILED: Location set to', response.sessionAttributes.userLocation, 'instead of kuki-d');
    }
});
