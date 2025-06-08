console.log('index.js: File loading started.');

const Alexa = require('ask-sdk-core');
console.log('index.js: Alexa SDK Core loaded.');

// LaunchRequest Handler (超シンプル版)
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        console.log('LaunchRequestHandler: canHandle called.');
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'スキルが起動しました。';
        console.log('LaunchRequest: スキルが起動しました。'); // ログ追加
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText) // Repromptも同じ内容でシンプルに
            .getResponse();
    }
};

// Error Handler (ログ強化版)
const ErrorHandler = {
    canHandle() {
        console.log('ErrorHandler: canHandle called.');
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        // For the stack, ensure error object is not null/undefined
        if (error && error.stack) {
            console.log(`~~~~ Error stack: ${error.stack}`); // スタックトレースも出力
        } else {
            console.log(`~~~~ Error object or stack is undefined: ${JSON.stringify(error)}`);
        }
        const speechText = 'エラーが発生しました。もう一度お試しください。';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

console.log('index.js: Handlers defined. Setting up SkillBuilder.');
// Skill Builder (最小構成)
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .lambda();
console.log('index.js: SkillBuilder setup complete. Handler exported。');
