// Simple local test for the Alexa skill
const skillHandler = require('./index').handler;

// Mock event for LaunchRequest
const launchRequestEvent = {
    version: '1.0',
    session: {
        new: true,
        sessionId: 'test-session-id',
        application: {
            applicationId: 'test-app-id'
        },
        user: {
            userId: 'test-user-id'
        }
    },
    context: {
        System: {
            application: {
                applicationId: 'test-app-id'
            },
            user: {
                userId: 'test-user-id'
            }
        }
    },
    request: {
        type: 'LaunchRequest',
        requestId: 'test-request-id',
        timestamp: new Date().toISOString(),
        locale: 'ja-JP'
    }
};

// Mock event for GarbageSearchIntent
const garbageSearchEvent = {
    version: '1.0',
    session: {
        new: false,
        sessionId: 'test-session-id',
        application: {
            applicationId: 'test-app-id'
        },
        user: {
            userId: 'test-user-id'
        }
    },
    context: {
        System: {
            application: {
                applicationId: 'test-app-id'
            },
            user: {
                userId: 'test-user-id'
            }
        }
    },
    request: {
        type: 'IntentRequest',
        requestId: 'test-request-id',
        timestamp: new Date().toISOString(),
        locale: 'ja-JP',
        intent: {
            name: 'GarbageSearchIntent',
            slots: {
                GarbageItem: {
                    name: 'GarbageItem',
                    value: 'ペットボトル'
                }
            }
        }
    }
};

// Mock context
const mockContext = {
    succeed: (result) => {
        console.log('SUCCESS:', JSON.stringify(result, null, 2));
    },
    fail: (error) => {
        console.log('ERROR:', error);
    }
};

console.log('Testing LaunchRequest...');
skillHandler(launchRequestEvent, mockContext);

console.log('\nTesting GarbageSearchIntent...');
skillHandler(garbageSearchEvent, mockContext);
