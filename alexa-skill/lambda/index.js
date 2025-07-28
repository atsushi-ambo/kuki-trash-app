const Alexa = require('ask-sdk-core');

// Region data
const regionData = {
    'kuki_a': { name: '久喜地区Aブロック', schedule: { burnable: { days: ['月曜日', '木曜日'], time: '朝8時30分' }, nonBurnable: { days: ['第2土曜日'], time: '朝8時30分' }, recyclePlastic: { days: ['水曜日'], time: '朝8時30分' }, bottlesCans: { days: ['水曜日'], time: '朝8時30分' }, paper: { days: ['第1火曜日', '第3火曜日'], time: '朝8時30分' }, clothing: { days: ['第4火曜日'], time: '朝8時30分' } } },
    'kuki_b': { name: '久喜地区Bブロック', schedule: { burnable: { days: ['火曜日', '金曜日'], time: '朝8時30分' }, nonBurnable: { days: ['第2土曜日'], time: '朝8時30分' }, recyclePlastic: { days: ['水曜日'], time: '朝8時30分' }, bottlesCans: { days: ['水曜日'], time: '朝8時30分' }, paper: { days: ['第1火曜日', '第3火曜日'], time: '朝8時30分' }, clothing: { days: ['第4火曜日'], time: '朝8時30分' } } },
    'kuki_c': { name: '久喜地区Cブロック', schedule: { burnable: { days: ['月曜日', '木曜日'], time: '朝8時30分' }, nonBurnable: { days: ['第4土曜日'], time: '朝8時30分' }, recyclePlastic: { days: ['水曜日'], time: '朝8時30分' }, bottlesCans: { days: ['水曜日'], time: '朝8時30分' }, paper: { days: ['第2火曜日', '第4火曜日'], time: '朝8時30分' }, clothing: { days: ['第4火曜日'], time: '朝8時30分' } } },
    'kuki_d': { name: '久喜地区Dブロック', schedule: { burnable: { days: ['火曜日', '金曜日'], time: '朝8時30分' }, nonBurnable: { days: ['第4土曜日'], time: '朝8時30分' }, recyclePlastic: { days: ['木曜日'], time: '朝8時30分' }, bottlesCans: { days: ['木曜日'], time: '朝8時30分' }, paper: { days: ['第2火曜日', '第4火曜日'], time: '朝8時30分' }, clothing: { days: ['第4火曜日'], time: '朝8時30分' } } }
};

// Simplified garbage data with comprehensive search
const garbageMapping = {
    // Direct mappings
    '古紙': { category: '雑誌・ざつがみ', schedule: 'paper' },
    '生ゴミ': { category: '燃やせるごみ', schedule: 'burnable' },
    '生ごみ': { category: '燃やせるごみ', schedule: 'burnable' },
    'ペットボトル': { category: 'びん・缶・ペットボトル', schedule: 'bottlesCans' },
    '缶': { category: 'びん・缶・ペットボトル', schedule: 'bottlesCans' },
    'びん': { category: 'びん・缶・ペットボトル', schedule: 'bottlesCans' },
    '瓶': { category: 'びん・缶・ペットボトル', schedule: 'bottlesCans' },
    'プラスチック': { category: '資源プラスチック類', schedule: 'recyclePlastic' },
    'プラ': { category: '資源プラスチック類', schedule: 'recyclePlastic' },
    '新聞': { category: '新聞', schedule: 'paper' },
    '新聞紙': { category: '新聞', schedule: 'paper' },
    '雑誌': { category: '雑誌・ざつがみ', schedule: 'paper' },
    'ダンボール': { category: '段ボール', schedule: 'paper' },
    '段ボール': { category: '段ボール', schedule: 'paper' },
    '牛乳パック': { category: '飲料用紙パック', schedule: 'paper' },
    '紙パック': { category: '飲料用紙パック', schedule: 'paper' },
    '服': { category: '布・衣類', schedule: 'clothing' },
    '衣類': { category: '布・衣類', schedule: 'clothing' },
    '電池': { category: '有害ごみ', schedule: 'special' },
    'タオル': { category: '布・衣類', schedule: 'clothing' },
    'ティッシュ': { category: '燃やせるごみ', schedule: 'burnable' },
    'ティッシュペーパー': { category: '燃やせるごみ', schedule: 'burnable' },
    'CD': { category: '燃やせるごみ', schedule: 'burnable' },
    'DVD': { category: '燃やせるごみ', schedule: 'burnable' },
    'なべ': { category: '燃やせないごみ', schedule: 'nonBurnable' },
    'やかん': { category: '燃やせないごみ', schedule: 'nonBurnable' },
    '傘': { category: '燃やせないごみ', schedule: 'nonBurnable' },
    'ガラス': { category: '燃やせないごみ', schedule: 'nonBurnable' },
    
    // Phonetic variants
    'なまごみ': { category: '燃やせるごみ', schedule: 'burnable' },
    'でんち': { category: '有害ごみ', schedule: 'special' },
    'ぺっとぼとる': { category: 'びん・缶・ペットボトル', schedule: 'bottlesCans' },
    'あきかん': { category: 'びん・缶・ペットボトル', schedule: 'bottlesCans' },
    'しんぶん': { category: '新聞', schedule: 'paper' },
    'だんぼーる': { category: '段ボール', schedule: 'paper' },
    'ぎゅうにゅうぱっく': { category: '飲料用紙パック', schedule: 'paper' }
};

const garbageDescriptions = {
    '燃やせるごみ': '水分をよく切ってから指定ごみ袋に入れてください。',
    '燃やせないごみ': '指定ごみ袋に入れて出してください。',
    '資源プラスチック類': '汚れを落として水洗いし、プラマークを確認してから透明・半透明の袋に入れて出してください。',
    'びん・缶・ペットボトル': '中身を空にして、軽く水洗いしてから透明・半透明の袋に入れて出してください。',
    '雑誌・ざつがみ': 'ひもで十字にしばって出してください。雨の日は出さないでください。',
    '新聞': 'ひもで十字にしばって出してください。雨の日は出さないでください。',
    '段ボール': 'ガムテープや金属部分を取り除き、ひもで十字にしばって出してください。',
    '飲料用紙パック': '内側を洗って開いて乾かしてから、ひもで十字にしばって出してください。',
    '布・衣類': '透明・半透明の袋に入れて出してください。汚れのひどいものは燃やせるごみへ。',
    '有害ごみ': '市の回収ボックスまたは販売店の回収サービスをご利用ください。'
};

function findGarbageInfo(query) {
    if (!query) return null;
    const normalizedQuery = query.trim();
    return garbageMapping[normalizedQuery] || null;
}

function mapResolvedLocationToCode(resolvedValue) {
    const locationMapping = {
        // Interaction model values
        '久喜A': 'kuki_a', '久喜B': 'kuki_b', '久喜C': 'kuki_c', '久喜D': 'kuki_d',
        // Legacy values for backward compatibility
        '久喜地区Aブロック': 'kuki_a', '久喜地区Bブロック': 'kuki_b', '久喜地区Cブロック': 'kuki_c', '久喜地区Dブロック': 'kuki_d',
        '久喜Aブロック': 'kuki_a', '久喜Bブロック': 'kuki_b', '久喜Cブロック': 'kuki_c', '久喜Dブロック': 'kuki_d'
    };
    return locationMapping[resolvedValue] || null;
}

// Handlers
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const userLocation = sessionAttributes.userLocation;
        
        let speechText = '久喜市ゴミ分別スキルへようこそ。';
        if (userLocation && regionData[userLocation]) {
            speechText += `現在の設定は${regionData[userLocation].name}です。どのようなゴミについて知りたいですか？`;
        } else {
            speechText += 'お住まいの地区を設定すると、正確な収集日をお知らせできます。お住まいの地区とブロックを教えてください。例えば、久喜地区Aブロック、久喜地区Dブロック、菖蒲地区Aブロックのように具体的にお答えください。';
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('どのようなゴミについて知りたいですか？')
            .getResponse();
    }
};

const GarbageSearchIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GarbageSearchIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const garbageItemSlot = slots.GarbageItem;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const userLocation = sessionAttributes.userLocation;
        
        let garbageItem = null;
        if (garbageItemSlot && garbageItemSlot.value) {
            garbageItem = garbageItemSlot.value;
        }
        
        const garbageInfo = findGarbageInfo(garbageItem);
        let speechText;
        
        if (garbageInfo) {
            const description = garbageDescriptions[garbageInfo.category] || '出し方の詳細は市のホームページをご確認ください。';
            let response = `${garbageItem}は${garbageInfo.category}です。${description}`;
            
            if (userLocation && regionData[userLocation] && garbageInfo.schedule !== 'special') {
                const regionInfo = regionData[userLocation];
                const schedule = regionInfo.schedule[garbageInfo.schedule];
                
                if (schedule) {
                    const daysText = schedule.days.join('と');
                    response += ` ${regionInfo.name}では、${daysText}の${schedule.time}に収集します。`;
                }
            }
            
            speechText = response + ' 他にも知りたいゴミはありますか？';
        } else {
            speechText = 'すみません、そのゴミの情報が見つかりませんでした。ペットボトル、缶、プラスチック、生ゴミ、古紙などについて質問してください。';
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('他にも知りたいゴミはありますか？')
            .getResponse();
    }
};

const SetLocationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetLocationIntent';
    },
    handle(handlerInput) {
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const locationSlot = slots.Location;
        
        let locationCode = null;
        let locationName = null;
        
        if (locationSlot && locationSlot.resolutions && 
            locationSlot.resolutions.resolutionsPerAuthority && 
            locationSlot.resolutions.resolutionsPerAuthority[0] &&
            locationSlot.resolutions.resolutionsPerAuthority[0].status &&
            locationSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH') {
            const resolvedValue = locationSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            locationCode = mapResolvedLocationToCode(resolvedValue);
            locationName = resolvedValue;
        }
        
        if (locationCode && regionData[locationCode]) {
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes.userLocation = locationCode;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            const speechText = `${regionData[locationCode].name}に設定しました。これで正確な収集日をお知らせできます。どのようなゴミについて知りたいですか？`;
            const repromptText = 'どのようなゴミについて知りたいですか？';
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        } else {
            const speechText = 'すみません、その地区は認識できませんでした。久喜地区Aブロック、久喜地区Bブロック、久喜地区Cブロック、久喜地区Dブロックのいずれかを指定してください。';
            const repromptText = 'お住まいの地区とブロックを教えてください。';
            
            return handlerInput.responseBuilder
                .speak(speechText)
                .reprompt(repromptText)
                .getResponse();
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'このスキルでは久喜市のゴミ分別方法をお答えします。まず地区を設定してください。例えば「久喜地区Aブロックです」と言ってください。その後、「ペットボトル」「缶」「古紙」などと聞いてください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('地区を設定するか、知りたいゴミの名前を言ってください。')
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'ありがとうございました。正しいゴミ分別にご協力をお願いします。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const speechText = 'すみません、エラーが発生しました。もう一度お試しください。';
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt('どのようなゴミについて知りたいですか？')
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GarbageSearchIntentHandler,
        SetLocationIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();