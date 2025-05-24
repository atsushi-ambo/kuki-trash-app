const Alexa = require('ask-sdk-core');

// 久喜市地域別収集スケジュールデータベース
const regionData = {
    // 久喜地区
    'kuki-a': {
        name: '久喜地区Aブロック',
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第2土'], time: '8:30' },
            '資源プラスチック類': { days: ['水'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['水'], time: '8:30' },
            '新聞': { days: ['第1・第3火'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3火'], time: '8:30' },
            '段ボール': { days: ['第1・第3火'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3火'], time: '8:30' },
            '布・衣類': { days: ['第4火'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'kuki-b': {
        name: '久喜地区Bブロック',
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第1土'], time: '8:30' },
            '資源プラスチック類': { days: ['木'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['木'], time: '8:30' },
            '新聞': { days: ['第2・第4火'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4火'], time: '8:30' },
            '段ボール': { days: ['第2・第4火'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4火'], time: '8:30' },
            '布・衣類': { days: ['第4火'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'kuki-c': {
        name: '久喜地区Cブロック',
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第3土'], time: '8:30' },
            '資源プラスチック類': { days: ['月'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第1・第3木'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3木'], time: '8:30' },
            '段ボール': { days: ['第1・第3木'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3木'], time: '8:30' },
            '布・衣類': { days: ['第4木'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'kuki-d': {
        name: '久喜地区Dブロック',
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第4土'], time: '8:30' },
            '資源プラスチック類': { days: ['火'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火'], time: '8:30' },
            '新聞': { days: ['第2・第4木'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4木'], time: '8:30' },
            '段ボール': { days: ['第2・第4木'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4木'], time: '8:30' },
            '布・衣類': { days: ['第4木'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    }
};

// Helper functions for region schedule analysis
function getNextCollectionDate(garbageType, userRegion) {
    const region = regionData[userRegion];
    if (!region || !region.schedule[garbageType]) {
        return null;
    }

    const schedule = region.schedule[garbageType];
    const today = new Date();
    const currentDay = today.getDay(); // 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
    
    for (let i = 0; i <= 14; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        
        if (isCollectionDay(checkDate, schedule.days)) {
            return checkDate;
        }
    }
    
    return null;
}

function isCollectionDay(date, scheduleDays) {
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = dayNames[date.getDay()];
    
    for (const scheduleDay of scheduleDays) {
        if (scheduleDay === dayOfWeek) {
            return true;
        }
        
        // Handle weekly patterns like "第1月", "第2・第4火"
        if (scheduleDay.includes('第') && scheduleDay.includes(dayOfWeek)) {
            const weekOfMonth = Math.ceil(date.getDate() / 7);
            
            if (scheduleDay.includes('第1') && weekOfMonth === 1) return true;
            if (scheduleDay.includes('第2') && weekOfMonth === 2) return true;
            if (scheduleDay.includes('第3') && weekOfMonth === 3) return true;
            if (scheduleDay.includes('第4') && weekOfMonth === 4) return true;
        }
    }
    
    return false;
}

// 久喜市公式ゴミ分別データベース（最新版）
const garbageDatabase = {
    '燃やせるごみ': {
        items: [
            '生ゴミ', '食べ残し', '野菜くず', '果物の皮', '魚の骨', '肉類', 'パン', 'ご飯', '麺類',
            '茶がら', 'コーヒーかす', 'たまごの殻', 'えび・かにの殻', '貝がら', '食用油（固めたもの）',
            'ティッシュペーパー', 'トイレットペーパー', '紙おむつ', '汚れた紙', '油紙',
            '写真', 'アルバム', '感熱紙', 'カーボン紙', 'シール', 'ラベル', '紙コップ', '紙皿',
            'ボールペン', 'シャープペンシル', '定規', '歯ブラシ', 'ハンガー', 'CD', 'DVD',
            'タバコの吸い殻', '使い捨てライター', '乾燥剤', '保冷剤', '猫砂', 'おむつ'
        ],
        instructions: '指定ごみ袋に入れて、決められた収集日の朝8時30分までに指定の場所に出してください。',
        collection: '週2回（地区により月・木曜日または火・金曜日）'
    },
    
    '燃やせないごみ': {
        items: [
            '金属類', 'なべ', 'やかん', 'フライパン', '包丁', 'ナイフ', 'はさみ', 'カッター',
            'スプーン', 'フォーク', '缶切り', '栓抜き', 'ピンセット', '針金', 'クリップ',
            'スプレー缶', 'カセットボンベ', 'ペンキ缶', 'オイル缶',
            '蛍光灯', 'LED電球', '白熱電球',
            'ガラス', '窓ガラス', '鏡', 'グラス', 'コップ', '花瓶', '灰皿', '陶器', '磁器',
            'ドライヤー', 'ヘアアイロン', 'アイロン', '電気かみそり', '電動歯ブラシ',
            '傘', '杖', 'ライター（金属製）', '魔法瓶', '水筒（金属製）', 'ポット'
        ],
        instructions: '指定ごみ袋に入れて出してください。スプレー缶は必ず使い切って穴を開けてください。',
        collection: '月1回（第2水曜日 - 地区により異なります）'
    },
    
    '資源プラスチック類': {
        items: [
            'ビニール袋', 'ポリ袋', 'レジ袋', '食品袋', 'パン袋', 'お菓子袋',
            'プラスチック容器', '食品容器', '弁当容器', 'カップ麺容器', 'ヨーグルト容器',
            'トレイ', '食品トレイ', '肉トレイ', '魚トレイ', '野菜トレイ',
            'シャンプーボトル', 'リンスボトル', 'ボディソープボトル', '洗剤ボトル',
            '発泡スチロール', '緩衝材', '電化製品の緩衝材'
        ],
        instructions: '汚れを落として水洗いし、透明・半透明の袋に入れて出してください。',
        collection: '週1回（水曜日 - 地区により異なります）'
    },
    
    'びん・缶・ペットボトル': {
        items: [
            '空き缶', 'アルミ缶', 'スチール缶', '飲料缶', '食品缶', '缶詰', 'ジュース缶',
            'ビール缶', 'チューハイ缶', 'コーヒー缶', 'お茶缶', '栄養ドリンク缶',
            '空きびん', 'ガラスびん', '飲料びん', '食品びん', 'ジュースびん', 'お酒びん',
            'ビールびん', 'ワインびん', '日本酒びん', '焼酎びん', '調味料びん', '醤油びん',
            'ペットボトル', '飲料ペットボトル', '調味料ペットボトル', '洗剤ペットボトル'
        ],
        instructions: '中身を空にして、軽く水洗いしてから透明・半透明の袋に入れて出してください。ペットボトルはキャップとラベルを外してください。',
        collection: '週1回（水曜日 - 地区により異なります）'
    },
    
    '雑誌・ざつがみ': {
        items: [
            '雑誌', '週刊誌', '月刊誌', '漫画', '小説', '辞書', '百科事典', '参考書',
            '紙袋', '包装紙', '封筒', 'はがき', '手紙', 'ノート', 'メモ帳',
            'コピー用紙', 'オフィス用紙', '書類', '領収書', 'お菓子の箱', '薬の箱'
        ],
        instructions: 'ひもで十字にしばって出してください。雨の日は出さないでください。金属やプラスチック部分は取り除いてください。',
        collection: '月2回（第1・第3火曜日 - 地区により異なります）'
    },
    
    '新聞': {
        items: [
            '新聞紙', '新聞', 'チラシ', '折込広告', '求人広告', 'スポーツ新聞', '地方新聞'
        ],
        instructions: 'ひもで十字にしばって出してください。雨の日は出さないでください。',
        collection: '月2回（第1・第3火曜日 - 地区により異なります）'
    },
    
    '段ボール': {
        items: [
            'ダンボール', '段ボール箱', '梱包材', '宅配箱', '通販箱', '引越し箱', '家電の箱'
        ],
        instructions: 'ガムテープや金属部分を取り除き、ひもで十字にしばって出してください。雨の日は出さないでください。',
        collection: '月2回（第1・第3火曜日 - 地区により異なります）'
    },
    
    '飲料用紙パック': {
        items: [
            '紙パック', '牛乳パック', 'ジュースパック', '豆乳パック', 'お茶パック', 'コーヒーパック'
        ],
        instructions: '内側を洗って開いて乾かしてから、ひもで十字にしばって出してください。雨の日は出さないでください。',
        collection: '月2回（第1・第3火曜日 - 地区により異なります）'
    },
    
    '布・衣類': {
        items: [
            '衣類', 'シャツ', 'ズボン', 'スカート', 'ワンピース', 'ジャケット', 'コート',
            'セーター', 'Tシャツ', '下着', '靴下', 'タオル', 'シーツ', '毛布', 'カーテン'
        ],
        instructions: '透明・半透明の袋に入れて出してください。雨の日は出さないでください。汚れのひどいものや破れのひどいものは燃やせるごみへ。',
        collection: '月1回（第4火曜日 - 地区により異なります）'
    },
    
    '粗大ごみ': {
        items: [
            'テーブル', '椅子', '本棚', 'タンス', 'ベッド', 'ソファー', '食器棚',
            'テレビ', '電子レンジ', '掃除機', '炊飯器',
            '自転車', 'バイク', 'タイヤ', 'ホイール', 'スキー板', 'ゴルフバッグ'
        ],
        instructions: '事前に粗大ごみ受付センターへ電話で申し込みが必要です。処理券を購入して貼付してから指定日に出してください。',
        collection: '事前申込制（電話：048-433-7796）収集は月2回程度',
        warning: '事前申込と処理券購入が必要です。家電リサイクル法対象品目（テレビ、冷蔵庫、洗濯機、エアコン）は対象外です。'
    },
    
    '有害ごみ': {
        items: [
            '乾電池', '蛍光灯', 'LED電球', '体温計（水銀）', '血圧計（水銀）', '水銀使用製品',
            'ボタン電池', 'リチウム電池', '充電池', '小型充電式電池', '電池類'
        ],
        instructions: '市の回収ボックスまたは販売店の回収サービスをご利用ください。乾電池・蛍光灯は公共施設等の回収ボックスへ。',
        collection: '回収ボックス設置場所での随時回収',
        warning: '有害ごみは通常のごみ収集には出せません。専用の回収ボックスまたは販売店にお持ちください。'
    },
    
    '処理できないもの': {
        items: [
            'テレビ', '冷蔵庫', '冷凍庫', '洗濯機', '衣類乾燥機', 'エアコン',
            'パソコン', 'バイク', '消火器', 'タイヤ', 'バッテリー', 'オイル', 'ガスボンベ',
            '農薬', '薬品', 'ペンキ', 'シンナー', '在宅医療廃棄物', '産業廃棄物'
        ],
        instructions: 'それぞれ専門の処理業者または販売店にお問い合わせください。家電リサイクル法対象品目は家電量販店等の回収サービスをご利用ください。',
        collection: '市では収集できません',
        warning: '久喜市では処理できません。各品目に応じた適切な処理方法をご確認ください。'
    }
};

// 検索用のキーワードマッピング
const keywordMapping = {
    'ゴミ': ['燃やせるごみ', '燃やせないごみ', '資源プラスチック類', 'びん・缶・ペットボトル', '雑誌・ざつがみ'],
    'プラスチック': ['資源プラスチック類'],
    'プラ': ['資源プラスチック類'],
    '容器': ['資源プラスチック類'],
    '空き缶': ['びん・缶・ペットボトル'],
    '缶': ['びん・缶・ペットボトル'],
    'びん': ['びん・缶・ペットボトル'],
    '瓶': ['びん・缶・ペットボトル'],
    'ペットボトル': ['びん・缶・ペットボトル'],
    '新聞': ['新聞'],
    '雑誌': ['雑誌・ざつがみ'],
    '本': ['雑誌・ざつがみ'],
    '紙': ['雑誌・ざつがみ', '燃やせるごみ'],
    '段ボール': ['段ボール'],
    'ダンボール': ['段ボール'],
    '衣類': ['布・衣類'],
    '服': ['布・衣類'],
    '布': ['布・衣類'],
    '家具': ['粗大ごみ'],
    '家電': ['粗大ごみ', '燃やせないごみ'],
    '電池': ['有害ごみ']
};

// ゴミ検索関数
function findGarbageCategory(query) {
    const normalizedQuery = query.toLowerCase();
    
    // 完全一致検索
    for (const [category, data] of Object.entries(garbageDatabase)) {
        if (data.items.some(item => item.toLowerCase() === normalizedQuery)) {
            return { category, data, item: query };
        }
    }
    
    // 部分一致検索
    for (const [category, data] of Object.entries(garbageDatabase)) {
        const matchedItem = data.items.find(item => 
            item.toLowerCase().includes(normalizedQuery) || 
            normalizedQuery.includes(item.toLowerCase())
        );
        if (matchedItem) {
            return { category, data, item: matchedItem };
        }
    }
    
    // キーワードマッピング検索
    for (const [keyword, categories] of Object.entries(keywordMapping)) {
        if (normalizedQuery.includes(keyword.toLowerCase()) || 
            keyword.toLowerCase().includes(normalizedQuery)) {
            const category = categories[0];
            if (garbageDatabase[category]) {
                return { category, data: garbageDatabase[category], item: keyword };
            }
        }
    }
    
    return null;
}

// Launch Request Handler
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'こんにちは！久喜市ゴミ分別アシスタントです。ペットボトルの分別方法を教えて、今日のゴミは何か教えて、のように話しかけてください。どのようなゴミについて知りたいですか？';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Region Setting Intent Handler
const RegionSettingIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegionSettingIntent';
    },
    handle(handlerInput) {
        const region = Alexa.getSlotValue(handlerInput.requestEnvelope, 'Region');
        
        if (!region) {
            const speakOutput = '地区を設定します。久喜地区A、B、C、Dブロックのどちらにお住まいですか？';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        
        // Save region to session attributes
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let regionKey = '';
        
        if (region.includes('A') || region.includes('エー')) {
            regionKey = 'kuki-a';
        } else if (region.includes('B') || region.includes('ビー')) {
            regionKey = 'kuki-b';
        } else if (region.includes('C') || region.includes('シー')) {
            regionKey = 'kuki-c';
        } else if (region.includes('D') || region.includes('ディー')) {
            regionKey = 'kuki-d';
        } else {
            regionKey = 'kuki-d'; // Default to D block
        }
        
        sessionAttributes.userRegion = regionKey;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        const regionName = regionData[regionKey].name;
        const speakOutput = `${regionName}に設定しました。今日のゴミ、明日のゴミなどを聞くことができます。何について知りたいですか？`;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('何について知りたいですか？')
            .getResponse();
    }
};

// Today's Collection Intent Handler  
const TodaysCollectionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TodaysCollectionIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const userRegion = sessionAttributes.userRegion || 'kuki-d'; // Default to D block
        
        const today = new Date();
        const region = regionData[userRegion];
        
        if (!region) {
            const speakOutput = '地区情報が設定されていません。まず地区を設定してください。久喜地区のA、B、C、Dブロックのどちらにお住まいですか？';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('久喜地区のA、B、C、Dブロックのどちらにお住まいですか？')
                .getResponse();
        }
        
        const todaysCollections = [];
        
        for (const [garbageType, schedule] of Object.entries(region.schedule)) {
            if (isCollectionDay(today, schedule.days)) {
                todaysCollections.push(garbageType);
            }
        }
        
        let speakOutput;
        if (todaysCollections.length > 0) {
            speakOutput = `${region.name}の今日の収集は、${todaysCollections.join('、')}です。朝8時30分までに出してください。`;
        } else {
            speakOutput = `${region.name}では今日はゴミの収集日ではありません。`;
        }
        
        speakOutput += ' 他に知りたいことはありますか？';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('他に知りたいことはありますか？')
            .getResponse();
    }
};

// Next Collection Intent Handler
const NextCollectionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NextCollectionIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const userRegion = sessionAttributes.userRegion || 'kuki-d';
        const garbageType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'GarbageType');
        
        const region = regionData[userRegion];
        
        if (!region) {
            const speakOutput = '地区情報が設定されていません。まず地区を設定してください。';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('久喜地区のA、B、C、Dブロックのどちらにお住まいですか？')
                .getResponse();
        }
        
        let speakOutput;
        
        if (garbageType) {
            // Find the specific garbage type
            let targetType = null;
            for (const type of Object.keys(region.schedule)) {
                if (type.includes(garbageType) || garbageType.includes(type)) {
                    targetType = type;
                    break;
                }
            }
            
            if (targetType) {
                const nextDate = getNextCollectionDate(targetType, userRegion);
                if (nextDate) {
                    const dateStr = `${nextDate.getMonth() + 1}月${nextDate.getDate()}日`;
                    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                    const dayStr = dayNames[nextDate.getDay()];
                    speakOutput = `${region.name}の${targetType}の次の収集日は、${dateStr}(${dayStr}曜日)です。`;
                } else {
                    speakOutput = `${targetType}の次の収集日が見つかりませんでした。`;
                }
            } else {
                speakOutput = `${garbageType}の収集スケジュールが見つかりませんでした。`;
            }
        } else {
            speakOutput = `${region.name}の収集スケジュールをお伝えします。燃やせるごみは週2回、その他の資源ごみは週1回または月2回収集されます。`;
        }
        
        speakOutput += ' 他に知りたいことはありますか？';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('他に知りたいことはありますか？')
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
        const garbageItem = Alexa.getSlotValue(handlerInput.requestEnvelope, 'GarbageItem');
        
        if (!garbageItem) {
            const speakOutput = 'すみません、ゴミの名前が聞き取れませんでした。もう一度教えてください。';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .getResponse();
        }
        
        const result = findGarbageCategory(garbageItem);
        
        if (result) {
            const { category, data } = result;
            let speakOutput = `${garbageItem}は${category}です。${data.instructions} 収集日は${data.collection}です。`;
            
            if (data.warning) {
                speakOutput += ` 注意事項として、${data.warning}`;
            }
            
            speakOutput += ' 他に知りたいゴミはありますか？';
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('他に知りたいゴミはありますか？')
                .getResponse();
        } else {
            const speakOutput = `すみません、${garbageItem}の分別方法が見つかりませんでした。久喜市役所にお問い合わせください。他に知りたいゴミはありますか？`;
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('他に知りたいゴミはありますか？')
                .getResponse();
        }
    }
};

// Collection Day Intent Handler
const CollectionDayIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CollectionDayIntent';
    },
    handle(handlerInput) {
        const garbageType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'GarbageType');
        
        let speakOutput = '';
        
        if (garbageType) {
            const result = findGarbageCategory(garbageType);
            if (result) {
                speakOutput = `${result.category}の収集日は${result.data.collection}です。`;
            } else {
                speakOutput = `すみません、${garbageType}の収集日が見つかりませんでした。`;
            }
        } else {
            speakOutput = '久喜市のゴミ収集日をお伝えします。燃やせるごみは週2回、燃やせないごみは月1回、資源ごみは週1回または月2回です。詳しい曜日はお住まいの地区により異なります。';
        }
        
        speakOutput += ' 他に知りたいことはありますか？';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('他に知りたいことはありますか？')
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
        const speakOutput = '久喜市ゴミ分別アシスタントです。「ペットボトルの分別方法を教えて」「今日のゴミは何ですか」「地区をDブロックに設定して」のように話しかけてください。どのようなゴミについて知りたいですか？';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
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
        const speakOutput = 'ありがとうございました。正しいゴミ分別にご協力ください。';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
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

// Generic error handling to capture any syntax or routing errors
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'すみません、エラーが発生しました。もう一度お試しください。';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        RegionSettingIntentHandler,
        TodaysCollectionIntentHandler,
        NextCollectionIntentHandler,
        GarbageSearchIntentHandler,
        CollectionDayIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
