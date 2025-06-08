const Alexa = require('ask-sdk-core');

// 久喜市ゴミ分別データベース（超簡略版・エラー回避）
const garbageDatabase = {
    'ペットボトル': {
        category: 'びん・缶・ペットボトル',
        method: 'キャップとラベルを外して、軽く水洗いしてから出してください。',
        schedule: '週1回'
    },
    '缶': {
        category: 'びん・缶・ペットボトル', 
        method: '中身を空にして、軽く水洗いしてから出してください。',
        schedule: '週1回'
    },
    'びん': {
        category: 'びん・缶・ペットボトル',
        method: '中身を空にして、軽く水洗いしてから出してください。',
        schedule: '週1回'
    }
};

// ゴミ検索関数（超シンプル版）
function findGarbageCategory(query) {
    if (!query) return null;
    
    const cleanQuery = query.toLowerCase().trim();
    
    // 完全一致または部分一致検索
    for (const [key, value] of Object.entries(garbageDatabase)) {
        if (key === cleanQuery || key.includes(cleanQuery) || cleanQuery.includes(key)) {
            return value;
        }
    }
    
    return null;
}

// LaunchRequest Handler（シンプル版）
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'こんにちは！久喜市ゴミ分別アシスタントです。ペットボトルはどうやって捨てますか、のように聞いてください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('どのようなゴミについて知りたいですか？')
            .getResponse();
    }
};

// ゴミ検索インテント Handler（シンプル版）
const GarbageSearchIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GarbageSearchIntent';
    },
    handle(handlerInput) {
        const garbageItem = Alexa.getSlotValue(handlerInput.requestEnvelope, 'GarbageItem');
        
        if (!garbageItem) {
            return handlerInput.responseBuilder
                .speak('ゴミの種類を教えてください。')
                .reprompt('ゴミの種類を教えてください。')
                .getResponse();
        }

        const garbageInfo = findGarbageCategory(garbageItem);
        
        if (garbageInfo) {
            const speechText = `${garbageItem}は${garbageInfo.category}です。${garbageInfo.method}`;
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt('他に知りたいゴミはありますか？')
                .getResponse();
        } else {
            return handlerInput.responseBuilder
                .speak(`${garbageItem}の分別方法が見つかりませんでした。`)
                .reprompt('他に知りたいゴミはありますか？')
                .getResponse();
        }
    }
};

// Help Intent Handler（シンプル版）
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'ペットボトルはどうやって捨てますか、のように聞いてください。';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// Cancel and Stop Intent Handler（シンプル版）
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('さようなら。')
            .getResponse();
    }
};

// Session Ended Request Handler（シンプル版）
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

// Error Handler（シンプル版）
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log('Error:', error);
        return handlerInput.responseBuilder
            .speak('エラーが発生しました。もう一度お試しください。')
            .getResponse();
    }
};

// Skill Builder（最小構成）
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GarbageSearchIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
