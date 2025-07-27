const Alexa = require('ask-sdk-core');

// Simplified region data
const regionData = {
    'kuki-a': {
        name: '久喜地区Aブロック',
        schedule: {
            '燃やせるごみ': { days: ['月曜日', '木曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['水曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['水曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3火曜日'], time: '8:30' }
        }
    },
    'kuki-b': {
        name: '久喜地区Bブロック',
        schedule: {
            '燃やせるごみ': { days: ['火曜日', '金曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['木曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['木曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第2・第4火曜日'], time: '8:30' }
        }
    },
    'kuki-c': {
        name: '久喜地区Cブロック',
        schedule: {
            '燃やせるごみ': { days: ['月曜日', '木曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['水曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['水曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3火曜日'], time: '8:30' }
        }
    },
    'kuki-d': {
        name: '久喜地区Dブロック',
        schedule: {
            '燃やせるごみ': { days: ['火曜日', '金曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['木曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3月曜日'], time: '8:30' }
        }
    }
};

// Simplified garbage data
const garbageData = {
    'ペットボトル': {
        category: 'びん・缶・ペットボトル',
        method: 'キャップとラベルを外して、中を軽く洗ってから透明・半透明の袋に入れて出してください。'
    },
    '缶': {
        category: 'びん・缶・ペットボトル',
        method: '中を軽く洗って、つぶさずに透明・半透明の袋に入れて出してください。'
    },
    'びん': {
        category: 'びん・缶・ペットボトル',
        method: 'キャップを外して中を軽く洗い、透明・半透明の袋に入れて出してください。'
    },
    'プラスチック': {
        category: '資源プラスチック類',
        method: '汚れを落として水洗いし、プラマークを確認してから透明・半透明の袋に入れて出してください。'
    },
    '生ゴミ': {
        category: '燃やせるごみ',
        method: '水分をよく切ってから指定ごみ袋に入れてください。'
    },
    '新聞': {
        category: '古紙類',
        method: 'ひもで十字に縛って出してください。雨の日は出さないでください。'
    },
    '段ボール': {
        category: '古紙類',
        method: 'ガムテープや金属部分を取り除き、ひもで十字に縛って出してください。'
    }
};

// Launch Request Handler
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = '久喜市ゴミ分別スキルへようこそ。お住まいの地区を設定すると、正確な収集日をお知らせできます。お住まいの地区とブロックを教えてください。例えば、久喜地区Aブロック、のように言ってください。';
        const repromptText = 'お住まいの地区とブロックを教えてください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

// Garbage Search Intent Handler
const GarbageSearchIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GarbageSearchIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const garbageItemSlot = slots.GarbageItem;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let userLocation = sessionAttributes.userLocation;
        
        let garbageItem = null;
        if (garbageItemSlot && garbageItemSlot.value) {
            garbageItem = garbageItemSlot.value;
        }
        
        let speechText;
        
        if (garbageItem && garbageData[garbageItem]) {
            const item = garbageData[garbageItem];
            let response = `${garbageItem}は${item.category}です。${item.method}`;
            
            if (userLocation && regionData[userLocation]) {
                const regionInfo = regionData[userLocation];
                const scheduleKey = getScheduleKeyForGarbageItem(garbageItem);
                
                if (scheduleKey && regionInfo.schedule[scheduleKey]) {
                    const schedule = regionInfo.schedule[scheduleKey];
                    const daysText = schedule.days.join('と');
                    response += ` ${regionInfo.name}では、${daysText}の${schedule.time}に収集します。`;
                }
            }
            
            speechText = response + ' 他にも知りたいゴミはありますか？';
        } else {
            speechText = 'すみません、そのゴミの情報が見つかりませんでした。ペットボトル、缶、プラスチック、生ゴミなどについて質問してください。';
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('他にも知りたいゴミはありますか？')
            .getResponse();
    }
};

// Set Location Intent Handler
const SetLocationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetLocationIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const locationSlot = slots.Location;
        
        let speechText;
        let locationCode = null;
        
        if (locationSlot) {
            // First try to use slot resolution (preferred)
            if (locationSlot.resolutions && 
                locationSlot.resolutions.resolutionsPerAuthority && 
                locationSlot.resolutions.resolutionsPerAuthority[0] &&
                locationSlot.resolutions.resolutionsPerAuthority[0].status &&
                locationSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH' &&
                locationSlot.resolutions.resolutionsPerAuthority[0].values) {
                
                const resolvedValue = locationSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
                locationCode = mapResolvedLocationToCode(resolvedValue);
            }
            
            // Fallback to raw value parsing if slot resolution fails
            if (!locationCode && locationSlot.value) {
                locationCode = extractLocationFromPhrase(locationSlot.value);
            }
            
            if (locationCode && regionData[locationCode]) {
                const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                sessionAttributes.userLocation = locationCode;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                
                const regionInfo = regionData[locationCode];
                speechText = `${regionInfo.name}に設定しました。これで正確な収集日をお知らせできます。どのようなゴミについて知りたいですか？`;
            } else {
                speechText = '申し訳ありません。久喜地区のAブロック、Bブロック、Cブロック、Dブロックのいずれかを教えてください。';
            }
        } else {
            speechText = 'お住まいの地区とブロックを教えてください。例えば、久喜地区Aブロック、のように言ってください。';
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('どのようなゴミについて知りたいですか？')
            .getResponse();
    }
};

// Helper function to map resolved slot values to location codes
function mapResolvedLocationToCode(resolvedValue) {
    const mapping = {
        '久喜A': 'kuki-a',
        '久喜B': 'kuki-b', 
        '久喜C': 'kuki-c',
        '久喜D': 'kuki-d'
    };
    return mapping[resolvedValue] || null;
}

// Helper function to extract location from phrases (fallback)
function extractLocationFromPhrase(phrase) {
    if (phrase.includes('A') || phrase.includes('エー') || phrase.includes('a')) {
        return 'kuki-a';
    } else if (phrase.includes('B') || phrase.includes('ビー') || phrase.includes('b')) {
        return 'kuki-b';
    } else if (phrase.includes('C') || phrase.includes('シー') || phrase.includes('c')) {
        return 'kuki-c';
    } else if (phrase.includes('D') || phrase.includes('ディー') || phrase.includes('d')) {
        return 'kuki-d';
    }
    return null;
}

// Helper function to map garbage items to schedule keys
function getScheduleKeyForGarbageItem(garbageItem) {
    const mapping = {
        'ペットボトル': 'びん・缶・ペットボトル',
        '缶': 'びん・缶・ペットボトル',
        'びん': 'びん・缶・ペットボトル',
        'プラスチック': '資源プラスチック類',
        '生ゴミ': '燃やせるごみ',
        '新聞': '新聞・段ボール',
        '段ボール': '新聞・段ボール'
    };
    return mapping[garbageItem] || null;
}

// Help Intent Handler
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'このスキルでは久喜市のゴミ分別方法を案内します。まず、お住まいの地区を教えてください。久喜地区のAブロック、Bブロック、Cブロック、Dブロックのいずれかと言ってください。その後、ペットボトルの分別方法を教えて、のように質問してください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('地区を設定してから、どのようなゴミについて知りたいか教えてください。')
            .getResponse();
    }
};

// Cancel and Stop Intent Handler
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'ありがとうございました。ゴミの分別にご協力ください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

// Session Ended Request Handler
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

// Error Handler
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const speechText = 'エラーが発生しました。もう一度お試しください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// Skill Builder
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SetLocationIntentHandler,
        GarbageSearchIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .lambda();