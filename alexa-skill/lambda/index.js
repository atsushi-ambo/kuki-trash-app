console.log('index.js: File loading started.');

const Alexa = require('ask-sdk-core');
console.log('index.js: Alexa SDK Core loaded.');

// Import region data (simplified version for Alexa)
const regionData = {
    'kuki-a': {
        name: '久喜地区Aブロック',
        areas: ['青毛', '江面', '太田袋', '上清久', '北青柳', '久喜北', '南1丁目', '南2丁目', '南3丁目', '南4丁目', '南5丁目'],
        schedule: {
            '燃やせるごみ': { days: ['月曜日', '木曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['水曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['水曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3火曜日'], time: '8:30' }
        }
    },
    'kuki-b': {
        name: '久喜地区Bブロック',
        areas: ['青葉1丁目', '久喜中央1丁目', '久喜中央2丁目', '久喜中央3丁目', '久喜中央4丁目'],
        schedule: {
            '燃やせるごみ': { days: ['火曜日', '金曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['木曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['木曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第2・第4火曜日'], time: '8:30' }
        }
    },
    'kuki-c': {
        name: '久喜地区Cブロック',
        areas: ['青葉3丁目', '青葉4丁目', '青葉5丁目', '上町', '本町', '栗原'],
        schedule: {
            '燃やせるごみ': { days: ['月曜日', '木曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['水曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['水曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3火曜日'], time: '8:30' }
        }
    },
    'kuki-d': {
        name: '久喜地区Dブロック',
        areas: ['青葉2丁目', '久喜東', '吉羽'],
        schedule: {
            '燃やせるごみ': { days: ['火曜日', '金曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['木曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['木曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第2・第4火曜日'], time: '8:30' }
        }
    },
    'shobu-a': {
        name: '菖蒲地区Aブロック',
        areas: ['菖蒲町菖蒲', '菖蒲町三箇', '菖蒲町台'],
        schedule: {
            '燃やせるごみ': { days: ['月曜日', '木曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['火曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3水曜日'], time: '8:30' }
        }
    },
    'washinomiya-a': {
        name: '鷲宮地区Aブロック',
        areas: ['桜田'],
        schedule: {
            '燃やせるごみ': { days: ['月曜日', '木曜日'], time: '8:30' },
            '資源プラスチック類': { days: ['火曜日'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火曜日'], time: '8:30' },
            '新聞・段ボール': { days: ['第1・第3水曜日'], time: '8:30' }
        }
    }
};

// Comprehensive Garbage data for Kuki city (from Docker app)
const garbageData = {
    // 燃やせるごみ
    '生ゴミ': {
        category: '燃やせるごみ',
        method: '水分をよく切ってから指定ごみ袋に入れてください。食べ残し、野菜くず、果物の皮、魚の骨、肉類などが含まれます。',
        examples: ['食べ残し', '野菜くず', '果物の皮', '魚の骨', '肉類', 'パン', 'ご飯'],
        generalDay: '燃やせるごみの収集日'
    },
    '紙おむつ': {
        category: '燃やせるごみ',
        method: '汚物を取り除いてから指定ごみ袋に入れてください。ティッシュペーパー、汚れた紙なども同様です。',
        examples: ['紙おむつ', 'ティッシュペーパー', '汚れた紙', '写真', 'レシート'],
        generalDay: '燃やせるごみの収集日'
    },
    '衣類': {
        category: '燃やせるごみ（汚れがひどい場合）または布・衣類',
        method: 'きれいな状態なら布・衣類として資源回収へ。汚れがひどい場合は燃やせるごみとして出してください。',
        examples: ['シャツ', 'ズボン', 'タオル', 'シーツ', '靴下', '下着'],
        generalDay: '布・衣類の収集日または燃やせるごみの収集日'
    },
    'プラスチック製品': {
        category: '燃やせるごみ（リサイクルマークなし）',
        method: 'プラマークがないプラスチック製品は燃やせるごみです。ボールペン、歯ブラシ、CDなどが該当します。',
        examples: ['ボールペン', '歯ブラシ', 'CD', 'DVD', 'おもちゃ', 'ハンガー'],
        generalDay: '燃やせるごみの収集日'
    },
    
    // 燃やせないごみ
    '金属製品': {
        category: '燃やせないごみ',
        method: '指定ごみ袋に入れて出してください。なべ、やかん、包丁、はさみなどの金属製品が含まれます。',
        examples: ['なべ', 'やかん', 'フライパン', '包丁', 'はさみ', 'スプーン', 'フォーク'],
        generalDay: '燃やせないごみの収集日',
        warning: '包丁やナイフなど危険なものは紙で包んでから出してください。'
    },
    'スプレー缶': {
        category: '燃やせないごみ',
        method: '必ず使い切ってから穴を開けて出してください。カセットボンベも同様です。',
        examples: ['スプレー缶', 'カセットボンベ', 'ペンキ缶', '殺虫剤缶', 'ヘアスプレー缶'],
        generalDay: '燃やせないごみの収集日',
        warning: '必ず使い切ってから穴を開けて出してください。'
    },
    'ガラス': {
        category: '燃やせないごみ',
        method: '割れたガラスは紙で包んでから指定ごみ袋に入れてください。鏡、グラス、花瓶などが含まれます。',
        examples: ['窓ガラス', '鏡', 'グラス', 'コップ', '花瓶', '陶器', '茶碗', '皿'],
        generalDay: '燃やせないごみの収集日',
        warning: '割れたガラスは紙で包んでから出してください。'
    },
    '小型家電': {
        category: '燃やせないごみ',
        method: '指定ごみ袋に入れて出してください。電池は取り外して有害ごみの回収ボックスへ。',
        examples: ['ドライヤー', 'アイロン', '電気かみそり', '時計', 'ラジオ', 'カメラ'],
        generalDay: '燃やせないごみの収集日'
    },
    
    // 資源プラスチック類
    'プラスチック': {
        category: '資源プラスチック類',
        method: '汚れを落として水洗いし、プラマークを確認してから透明・半透明の袋に入れて出してください。汚れが落ちないものは燃やせるごみへ。',
        examples: ['食品容器', 'シャンプーボトル', 'レジ袋', '食品トレイ', '発泡スチロール'],
        generalDay: '資源プラスチック類の収集日',
        warning: 'プラマークがあり、きれいに洗えることが条件です。'
    },
    'ビニール袋': {
        category: '資源プラスチック類',
        method: '汚れを落としてから透明・半透明の袋に入れて出してください。レジ袋、食品袋、ポリ袋などが含まれます。',
        examples: ['レジ袋', '食品袋', 'パン袋', 'お菓子袋', 'ポリ袋'],
        generalDay: '資源プラスチック類の収集日'
    },
    '食品容器': {
        category: '資源プラスチック類',
        method: '中身を空にして汚れを落とし、プラマークを確認してから出してください。弁当容器、ヨーグルト容器などが含まれます。',
        examples: ['弁当容器', 'ヨーグルト容器', 'プリン容器', '豆腐パック', '惣菜パック'],
        generalDay: '資源プラスチック類の収集日'
    },
    
    // びん・缶・ペットボトル
    'ペットボトル': {
        category: '資源ゴミ',
        method: 'キャップとラベルを外して、中を軽く洗ってから透明・半透明の袋に入れて出してください。',
        examples: ['飲料ペットボトル', '調味料ペットボトル', 'しょうゆペットボトル'],
        generalDay: 'びん・缶・ペットボトルの収集日'
    },
    '缶': {
        category: '資源ゴミ',
        method: '中を軽く洗って、つぶさずに透明・半透明の袋に入れて出してください。',
        examples: ['飲料缶', '缶詰', 'ジュース缶', 'ビール缶', '食品缶'],
        generalDay: 'びん・缶・ペットボトルの収集日'
    },
    'びん': {
        category: '資源ゴミ',
        method: 'キャップを外して中を軽く洗い、透明・半透明の袋に入れて出してください。',
        examples: ['飲料びん', 'ジャムびん', '調味料びん', 'ビールびん', 'ワインびん'],
        generalDay: 'びん・缶・ペットボトルの収集日'
    },
    
    // 古紙類
    '新聞': {
        category: '古紙類',
        method: 'ひもで十字に縛って出してください。雨の日は出さないでください。チラシも一緒に束ねられます。',
        examples: ['新聞紙', 'チラシ', '折込広告', 'スポーツ新聞'],
        generalDay: '新聞の収集日'
    },
    '雑誌': {
        category: '古紙類',
        method: 'ひもで十字に縛って出してください。雨の日は出さないでください。',
        examples: ['雑誌', '週刊誌', '漫画', '小説', 'カタログ', 'パンフレット'],
        generalDay: '雑誌・ざつがみの収集日'
    },
    '段ボール': {
        category: '古紙類',
        method: 'ガムテープや金属部分を取り除き、ひもで十字に縛って出してください。雨の日は出さないでください。',
        examples: ['段ボール箱', '宅配箱', '通販箱', '梱包材'],
        generalDay: '段ボールの収集日'
    },
    '紙パック': {
        category: '古紙類',
        method: '内側を洗って開いて乾かしてから、ひもで十字に縛って出してください。',
        examples: ['牛乳パック', 'ジュースパック', '豆乳パック'],
        generalDay: '飲料用紙パックの収集日'
    },
    
    // 布・衣類
    '布': {
        category: '布・衣類',
        method: '透明・半透明の袋に入れて出してください。雨の日は出さないでください。汚れのひどいものは燃やせるごみへ。',
        examples: ['シャツ', 'ズボン', 'タオル', 'シーツ', '毛布', 'カーテン'],
        generalDay: '布・衣類の収集日'
    },
    
    // 有害ごみ
    '電池': {
        category: '有害ごみ',
        method: '市の回収ボックスまたは販売店の回収サービスをご利用ください。通常のごみ収集には出せません。',
        examples: ['乾電池', 'ボタン電池', 'リチウム電池', '充電池'],
        generalDay: '回収ボックス設置場所での随時回収',
        warning: '通常のごみ収集には出せません。専用の回収ボックスへ。'
    },
    '蛍光灯': {
        category: '有害ごみ',
        method: '市の回収ボックスまたは販売店の回収サービスをご利用ください。',
        examples: ['蛍光灯', 'LED電球', '体温計（水銀）'],
        generalDay: '回収ボックス設置場所での随時回収',
        warning: '通常のごみ収集には出せません。'
    },
    
    // 粗大ごみ
    '家具': {
        category: '粗大ごみ',
        method: '事前に粗大ごみ受付センター（048-433-7796）へ電話で申し込みが必要です。処理券を購入して貼付してから指定日に出してください。',
        examples: ['テーブル', '椅子', '本棚', 'タンス', 'ベッド', 'ソファー'],
        generalDay: '事前申込制',
        warning: '事前申込と処理券購入が必要です。'
    },
    '自転車': {
        category: '粗大ごみ',
        method: '事前に粗大ごみ受付センターへ電話で申し込みが必要です。処理券を購入して貼付してから指定日に出してください。',
        examples: ['自転車', 'ベビーカー'],
        generalDay: '事前申込制',
        warning: '事前申込と処理券購入が必要です。'
    },
    
    // 処理できないもの
    'テレビ': {
        category: '処理できないもの（家電リサイクル法対象）',
        method: '販売店や専門業者にご相談ください。家電リサイクル券が必要です。',
        examples: ['テレビ', '冷蔵庫', '洗濯機', 'エアコン'],
        generalDay: '市では収集できません',
        warning: '家電リサイクル法対象品目のため、市では収集できません。'
    }
};

// LaunchRequest Handler
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        console.log('LaunchRequestHandler: canHandle called.');
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = '久喜市ゴミ分別スキルへようこそ。お住まいの地区を設定すると、正確な収集日をお知らせできます。まず、どの地区にお住まいですか？久喜地区、菖蒲地区、鷲宮地区、栗橋地区のいずれかを教えてください。';
        const repromptText = 'どの地区にお住まいですか？久喜、菖蒲、鷲宮、栗橋のいずれかを教えてください。';
        
        console.log('LaunchRequest: スキルが起動しました。');
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

// GarbageSearchIntent Handler
const GarbageSearchIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GarbageSearchIntent';
    },
    handle(handlerInput) {
        console.log('GarbageSearchIntentHandler: handle called.');
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const garbageItemSlot = slots.GarbageItem;
        const locationSlot = slots.Location;
        
        // Get user's location from session or slot
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let userLocation = sessionAttributes.userLocation;
        
        // If location provided in this request, use it and save it
        if (locationSlot && locationSlot.value) {
            const locationValue = extractLocationFromPhrase(locationSlot.value);
            if (locationValue) {
                userLocation = locationValue;
                sessionAttributes.userLocation = userLocation;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            }
        }
        
        // Extract garbage item
        let garbageItem = null;
        let rawSlotValue = null;
        
        if (garbageItemSlot) {
            if (garbageItemSlot.value) {
                rawSlotValue = garbageItemSlot.value;
                garbageItem = extractGarbageItemFromPhrase(rawSlotValue);
            }
            
            if (garbageItemSlot.resolutions && 
                garbageItemSlot.resolutions.resolutionsPerAuthority && 
                garbageItemSlot.resolutions.resolutionsPerAuthority[0] &&
                garbageItemSlot.resolutions.resolutionsPerAuthority[0].status &&
                garbageItemSlot.resolutions.resolutionsPerAuthority[0].status.code === 'ER_SUCCESS_MATCH' &&
                garbageItemSlot.resolutions.resolutionsPerAuthority[0].values &&
                garbageItemSlot.resolutions.resolutionsPerAuthority[0].values[0]) {
                garbageItem = garbageItemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            }
        }
        
        console.log(`User location: ${userLocation}`);
        console.log(`Extracted garbage item: ${garbageItem}`);
        
        let speechText;
        let repromptText = '他にも知りたいゴミはありますか？';
        
        if (garbageItem && garbageData[garbageItem]) {
            const item = garbageData[garbageItem];
            let response = `${garbageItem}は${item.category}です。${item.method}`;
            
            // Add examples if available
            if (item.examples && item.examples.length > 0) {
                const examplesList = item.examples.slice(0, 3).join('、');
                response += ` 例えば、${examplesList}などが含まれます。`;
            }
            
            // Add location-specific schedule if available
            if (userLocation && regionData[userLocation]) {
                const regionInfo = regionData[userLocation];
                const scheduleKey = getScheduleKeyForGarbageItem(garbageItem);
                
                if (scheduleKey && regionInfo.schedule[scheduleKey]) {
                    const schedule = regionInfo.schedule[scheduleKey];
                    const daysText = schedule.days.join('と');
                    response += ` ${regionInfo.name}では、${daysText}の${schedule.time}に収集します。`;
                } else if (scheduleKey === '有害ごみ') {
                    response += ` 有害ごみは市の回収ボックスまたは販売店の回収サービスをご利用ください。`;
                } else if (scheduleKey === '粗大ごみ') {
                    response += ` 粗大ごみは事前に電話での申し込みが必要です。`;
                } else if (scheduleKey === '処理できないもの') {
                    response += ` こちらは市では収集できませんので、販売店や専門業者にご相談ください。`;
                } else {
                    response += ` ${regionInfo.name}での収集日は、ゴミカレンダーでご確認ください。`;
                }
            } else {
                response += ` 収集日は地区によって異なります。お住まいの地区を教えていただければ、正確な収集日をお知らせできます。`;
            }
            
            // Add warning if available
            if (item.warning) {
                response += ` 注意点として、${item.warning}`;
            }
            
            speechText = response + ' 他にも知りたいゴミはありますか？';
        } else if (garbageItem) {
            speechText = `申し訳ありません。${garbageItem}の情報が見つかりませんでした。ペットボトル、缶、びん、プラスチック、新聞、段ボールなどについて質問してください。`;
        } else {
            speechText = 'どのようなゴミについて知りたいですか？ペットボトル、缶、びん、プラスチックなどと言ってください。';
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

// Helper function to extract garbage item from phrases
function extractGarbageItemFromPhrase(phrase) {
    console.log(`Extracting from phrase: ${phrase}`);
    
    // Comprehensive list of known garbage items with synonyms
    const knownItems = {
        'ペットボトル': ['ペット', 'ペットボトル', 'ボトル'],
        '缶': ['缶', 'かん', '空き缶', 'アルミ缶'],
        'びん': ['びん', '瓶', 'ビン', 'ガラス瓶'],
        'プラスチック': ['プラスチック', 'プラ', 'プラスチック容器'],
        'ビニール袋': ['ビニール袋', 'ビニール', 'レジ袋', '袋'],
        '新聞': ['新聞', '新聞紙', 'しんぶん'],
        '段ボール': ['段ボール', 'ダンボール', 'だんぼーる', '箱'],
        '生ゴミ': ['生ゴミ', '生ごみ', 'なまごみ', '食べ残し', '野菜くず'],
        '紙おむつ': ['紙おむつ', 'おむつ', 'オムツ'],
        '衣類': ['衣類', '服', 'ふく', 'シャツ', 'ズボン'],
        'プラスチック製品': ['プラスチック製品', 'CD', 'DVD', 'おもちゃ'],
        '金属製品': ['金属製品', '金属', 'なべ', 'やかん', '包丁'],
        'スプレー缶': ['スプレー缶', 'スプレー', 'カセットボンベ'],
        'ガラス': ['ガラス', 'グラス', 'コップ', '鏡'],
        '小型家電': ['小型家電', 'ドライヤー', 'アイロン', 'ラジオ'],
        '食品容器': ['食品容器', '弁当容器', 'ヨーグルト容器'],
        '雑誌': ['雑誌', 'ざっし', '本', '週刊誌'],
        '紙パック': ['紙パック', '牛乳パック', 'ぎゅうにゅうパック'],
        '布': ['布', 'タオル', 'シーツ', '毛布'],
        '電池': ['電池', 'でんち', 'バッテリー', '乾電池'],
        '蛍光灯': ['蛍光灯', '電球', 'LED電球'],
        '家具': ['家具', 'テーブル', '椅子', 'タンス'],
        '自転車': ['自転車', 'じてんしゃ', 'チャリ'],
        'テレビ': ['テレビ', '冷蔵庫', '洗濯機', 'エアコン']
    };
    
    // Check if any known item or its synonyms are contained in the phrase
    for (const [mainItem, synonyms] of Object.entries(knownItems)) {
        for (const synonym of synonyms) {
            if (phrase.includes(synonym)) {
                console.log(`Found item: ${synonym} -> ${mainItem} in phrase: ${phrase}`);
                return mainItem;
            }
        }
    }
    
    // If no known item found, return the original phrase
    console.log(`No known item found in phrase: ${phrase}`);
    return phrase;
}

// Helper function to extract location from phrases
function extractLocationFromPhrase(phrase) {
    console.log(`Extracting location from phrase: ${phrase}`);
    
    // Map spoken location to region codes
    const locationMap = {
        '久喜': 'kuki-a',
        '久喜地区': 'kuki-a',
        '菖蒲': 'shobu-a',
        '菖蒲地区': 'shobu-a',
        '鷲宮': 'washinomiya-a',
        '鷲宮地区': 'washinomiya-a',
        '栗橋': 'kurihashi-a',
        '栗橋地区': 'kurihashi-a',
        '青毛': 'kuki-a',
        '本町': 'kuki-c',
        '久喜中央': 'kuki-b',
        '青葉': 'kuki-c',
        '桜田': 'washinomiya-a'
    };
    
    for (const [spoken, code] of Object.entries(locationMap)) {
        if (phrase.includes(spoken)) {
            console.log(`Found location: ${spoken} -> ${code}`);
            return code;
        }
    }
    
    return null;
}

// Helper function to map garbage items to schedule keys
function getScheduleKeyForGarbageItem(garbageItem) {
    const mapping = {
        // びん・缶・ペットボトル
        'ペットボトル': 'びん・缶・ペットボトル',
        '缶': 'びん・缶・ペットボトル',
        'びん': 'びん・缶・ペットボトル',
        
        // 資源プラスチック類
        'プラスチック': '資源プラスチック類',
        'ビニール袋': '資源プラスチック類',
        '食品容器': '資源プラスチック類',
        
        // 燃やせるごみ
        '生ゴミ': '燃やせるごみ',
        '紙おむつ': '燃やせるごみ',
        'プラスチック製品': '燃やせるごみ',
        
        // 燃やせないごみ
        '金属製品': '燃やせないごみ',
        'スプレー缶': '燃やせないごみ',
        'ガラス': '燃やせないごみ',
        '小型家電': '燃やせないごみ',
        
        // 古紙類
        '新聞': '新聞・段ボール',
        '段ボール': '新聞・段ボール',
        '雑誌': '雑誌・ざつがみ',
        '紙パック': '飲料用紙パック',
        
        // 布・衣類
        '衣類': '布・衣類',
        '布': '布・衣類',
        
        // 有害ごみ・粗大ごみ・処理できないもの（特別な処理）
        '電池': '有害ごみ',
        '蛍光灯': '有害ごみ',
        '家具': '粗大ごみ',
        '自転車': '粗大ごみ',
        'テレビ': '処理できないもの'
    };
    
    return mapping[garbageItem] || null;
}

// SetLocationIntent Handler
const SetLocationIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetLocationIntent';
    },
    handle(handlerInput) {
        console.log('SetLocationIntentHandler: handle called.');
        
        const slots = handlerInput.requestEnvelope.request.intent.slots;
        const locationSlot = slots.Location;
        
        let speechText;
        let repromptText = 'ペットボトル、缶、プラスチックなど、どのゴミについて知りたいですか？';
        
        if (locationSlot && locationSlot.value) {
            const locationCode = extractLocationFromPhrase(locationSlot.value);
            
            if (locationCode && regionData[locationCode]) {
                // Save location to session
                const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
                sessionAttributes.userLocation = locationCode;
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                
                const regionInfo = regionData[locationCode];
                speechText = `${regionInfo.name}に設定しました。これで正確な収集日をお知らせできます。どのようなゴミについて知りたいですか？`;
            } else {
                speechText = `申し訳ありません。${locationSlot.value}は認識できませんでした。久喜地区、菖蒲地区、鷲宮地区、栗橋地区のいずれかを教えてください。`;
            }
        } else {
            speechText = 'どの地区にお住まいですか？久喜、菖蒲、鷲宮、栗橋のいずれかを教えてください。';
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .getResponse();
    }
};

// Help Intent Handler
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'このスキルでは久喜市のゴミ分別方法を案内します。まず、お住まいの地区を教えてください。久喜、菖蒲、鷲宮、栗橋などと言ってください。地区を設定すると、正確な収集日をお知らせできます。その後、ペットボトルの分別方法を教えて、のように質問してください。';
        const repromptText = 'まず地区を設定してから、どのようなゴミについて知りたいか教えてください。';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
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
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
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
// Skill Builder with all handlers
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
console.log('index.js: SkillBuilder setup complete. Handler exported。');
