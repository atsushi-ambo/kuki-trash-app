// 久喜市地域別収集スケジュールデータベース

const regionData = {
    // 久喜地区
    'kuki-a': {
        name: '久喜地区Aブロック',
        areas: [
            '青毛', '青毛1丁目', '青毛2丁目', '青毛3丁目', '青毛4丁目',
            '江面', '太田袋', '上清久', '北青柳', '北中曽根',
            '久喜北1丁目', '久喜北2丁目', '久喜東6丁目',
            '栗原141番地（けやき台）', '古久喜', '野久喜（県道幸手久喜線北側及び香取地域）',
            '下清久', '下早見', '所久喜', '南1丁目', '南2丁目', '南3丁目', '南4丁目', '南5丁目',
            '吉羽（県道幸手久喜線北側）', '六万部'
        ],
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
        areas: [
            '青葉1丁目（UR都市機構青葉団地）',
            '久喜中央1丁目', '久喜中央2丁目', '久喜中央3丁目', '久喜中央4丁目'
        ],
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
        areas: [
            '青葉3丁目', '青葉4丁目', '青葉5丁目',
            '上町', '上早見', '久喜新', '久喜本',
            '栗原（けやき台地域を除く）', '栗原1丁目', '栗原2丁目', '栗原3丁目', '栗原4丁目',
            '原', '樋ノ口', '本町1丁目', '本町2丁目', '本町3丁目', '本町4丁目', '本町5丁目', '本町6丁目', '本町7丁目', '本町8丁目',
            '除堀', '吉羽', '西（青毛堀川東側）'
        ],
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第3土'], time: '8:30' },
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
    'kuki-d': {
        name: '久喜地区Dブロック',
        areas: [
            '青葉2丁目',
            '久喜東1丁目', '久喜東2丁目', '久喜東3丁目', '久喜東4丁目', '久喜東5丁目',
            '古久喜', '野久喜（県道幸手久喜線南側）',
            '吉羽', '西（青毛堀川西側）',
            '吉羽1丁目', '吉羽2丁目', '吉羽3丁目', '吉羽4丁目', '吉羽5丁目'
        ],
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第4土'], time: '8:30' },
            '資源プラスチック類': { days: ['木'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第1・第3月'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3月'], time: '8:30' },
            '段ボール': { days: ['第1・第3月'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3月'], time: '8:30' },
            '布・衣類': { days: ['第4火'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    // 菖蒲地区
    'shobu-a': {
        name: '菖蒲地区Aブロック',
        areas: [
            '菖蒲町菖蒲（寺田団地を除く）', '菖蒲町三箇',
            '菖蒲町台', '菖蒲町河原井'
        ],
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第2金'], time: '8:30' },
            '資源プラスチック類': { days: ['火'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火'], time: '8:30' },
            '新聞': { days: ['第1・第3水'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3水'], time: '8:30' },
            '段ボール': { days: ['第1・第3水'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3水'], time: '8:30' },
            '布・衣類': { days: ['第4水'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'shobu-b': {
        name: '菖蒲地区Bブロック',
        areas: [
            '菖蒲町新堀', '菖蒲町小林', '菖蒲町下栢間', '菖蒲町上栢間',
            '菖蒲町柴山枝郷', '菖蒲町上大崎', '菖蒲町菖蒲（寺田団地）'
        ],
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第4金'], time: '8:30' },
            '資源プラスチック類': { days: ['月'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第2・第4水'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4水'], time: '8:30' },
            '段ボール': { days: ['第2・第4水'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4水'], time: '8:30' },
            '布・衣類': { days: ['第4水'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    // 鷲宮地区
    'washinomiya-a': {
        name: '鷲宮地区Aブロック',
        areas: [
            '桜田1丁目', '桜田2丁目', '桜田3丁目', '桜田4丁目', '桜田5丁目'
        ],
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第1金'], time: '8:30' },
            '資源プラスチック類': { days: ['火'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火'], time: '8:30' },
            '新聞': { days: ['第1・第3水'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3水'], time: '8:30' },
            '段ボール': { days: ['第1・第3水'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3水'], time: '8:30' },
            '布・衣類': { days: ['第4水'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'washinomiya-b': {
        name: '鷲宮地区Bブロック',
        areas: [
            '上内（わし宮団地を除く）', '砂原1丁目', '鷲宮',
            '鷲宮1丁目', '鷲宮2丁目', '鷲宮3丁目', '鷲宮4丁目', '鷲宮5丁目',
            '鷲宮中央1丁目', '鷲宮中央2丁目', '西大輪（葛西用水路西側）'
        ],
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第2金'], time: '8:30' },
            '資源プラスチック類': { days: ['月'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第2・第4水'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4水'], time: '8:30' },
            '段ボール': { days: ['第2・第4水'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4水'], time: '8:30' },
            '布・衣類': { days: ['第4水'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'washinomiya-c': {
        name: '鷲宮地区Cブロック',
        areas: [
            '上川崎', '外野', '西大輪（葛西用水路東側）',
            '西大輪1丁目', '西大輪2丁目', '西大輪3丁目', '西大輪4丁目', '西大輪5丁目',
            '八甫', '八甫1丁目', '八甫2丁目', '八甫3丁目', '八甫4丁目', '八甫5丁目',
            '東大輪', '鷲宮6丁目'
        ],
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第3金'], time: '8:30' },
            '資源プラスチック類': { days: ['火'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火'], time: '8:30' },
            '新聞': { days: ['第1・第3水'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3水'], time: '8:30' },
            '段ボール': { days: ['第1・第3水'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3水'], time: '8:30' },
            '布・衣類': { days: ['第4水'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'washinomiya-d': {
        name: '鷲宮地区Dブロック',
        areas: [
            '上内（わし宮団地）', '久本寺', '葛梅',
            '葛梅1丁目', '葛梅2丁目', '葛梅3丁目',
            '栄1丁目', '中妻'
        ],
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第4金'], time: '8:30' },
            '資源プラスチック類': { days: ['月'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第2・第4水'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4水'], time: '8:30' },
            '段ボール': { days: ['第2・第4水'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4水'], time: '8:30' },
            '布・衣類': { days: ['第4水'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    // 栗橋地区
    'kurihashi-e': {
        name: '栗橋地区Eブロック',
        areas: [
            '新井', '河原代', '狐塚',
            '南栗橋1丁目', '南栗橋2丁目', '南栗橋3丁目', '南栗橋4丁目', '南栗橋5丁目',
            '南栗橋6丁目', '南栗橋7丁目', '南栗橋8丁目', '南栗橋9丁目', '南栗橋10丁目',
            '南栗橋11丁目', '南栗橋12丁目'
        ],
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第1水'], time: '8:30' },
            '資源プラスチック類': { days: ['火'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火'], time: '8:30' },
            '新聞': { days: ['第1・第3金'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3金'], time: '8:30' },
            '段ボール': { days: ['第1・第3金'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3金'], time: '8:30' },
            '布・衣類': { days: ['第4金'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'kurihashi-f': {
        name: '栗橋地区Fブロック',
        areas: [
            '伊坂（駅西）', '伊坂北1丁目', '伊坂北2丁目',
            '伊坂中央1丁目', '伊坂中央2丁目', '伊坂南1丁目', '伊坂南2丁目', '伊坂南3丁目',
            '松永', '松永1丁目', '高柳', '島川'
        ],
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第2水'], time: '8:30' },
            '資源プラスチック類': { days: ['月'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第2・第4金'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4金'], time: '8:30' },
            '段ボール': { days: ['第2・第4金'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4金'], time: '8:30' },
            '布・衣類': { days: ['第4金'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'kurihashi-g': {
        name: '栗橋地区Gブロック',
        areas: [
            '北広島', '栗橋', '栗橋東4丁目', '栗橋東5丁目', '栗橋東6丁目',
            '小右衛門', '中里'
        ],
        schedule: {
            '燃やせるごみ': { days: ['月', '木'], time: '8:30' },
            '燃やせないごみ': { days: ['第3水'], time: '8:30' },
            '資源プラスチック類': { days: ['火'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['火'], time: '8:30' },
            '新聞': { days: ['第1・第3金'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第1・第3金'], time: '8:30' },
            '段ボール': { days: ['第1・第3金'], time: '8:30' },
            '飲料用紙パック': { days: ['第1・第3金'], time: '8:30' },
            '布・衣類': { days: ['第4金'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    },
    'kurihashi-h': {
        name: '栗橋地区Hブロック',
        areas: [
            '伊坂（駅東）', '栗橋北1丁目', '栗橋北2丁目',
            '栗橋中央1丁目', '栗橋中央2丁目', '栗橋東1丁目', '栗橋東2丁目', '栗橋東3丁目',
            '佐間', '間鎌', '緑1丁目'
        ],
        schedule: {
            '燃やせるごみ': { days: ['火', '金'], time: '8:30' },
            '燃やせないごみ': { days: ['第4水'], time: '8:30' },
            '資源プラスチック類': { days: ['月'], time: '8:30' },
            'びん・缶・ペットボトル': { days: ['月'], time: '8:30' },
            '新聞': { days: ['第2・第4金'], time: '8:30' },
            '雑誌・ざつがみ': { days: ['第2・第4金'], time: '8:30' },
            '段ボール': { days: ['第2・第4金'], time: '8:30' },
            '飲料用紙パック': { days: ['第2・第4金'], time: '8:30' },
            '布・衣類': { days: ['第4金'], time: '8:30' },
            '有害ごみ': { days: ['回収ボックス'], time: '随時' }
        }
    }
};

// 地域検索機能
function findRegionByArea(areaName) {
    for (const [regionId, regionInfo] of Object.entries(regionData)) {
        for (const area of regionInfo.areas) {
            if (area.includes(areaName) || areaName.includes(area)) {
                return { id: regionId, ...regionInfo };
            }
        }
    }
    return null;
}

// 地域の選択肢を取得
function getAllRegions() {
    return Object.entries(regionData).map(([id, info]) => ({
        id,
        name: info.name,
        areas: info.areas
    }));
}

// 地域IDから収集スケジュールを取得
function getScheduleByRegion(regionId, garbageType = null) {
    const region = regionData[regionId];
    if (!region) return null;
    
    if (garbageType) {
        return region.schedule[garbageType] || null;
    }
    
    return region.schedule;
}

// 次の収集日を計算
function getNextCollectionDate(regionId, garbageType) {
    const schedule = getScheduleByRegion(regionId, garbageType);
    if (!schedule || schedule.days.includes('回収ボックス')) {
        return null;
    }
    
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0=日曜日, 1=月曜日, ...
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    
    // 今日を含めて次の7日間をチェック
    for (let i = 0; i < 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const checkDayOfWeek = checkDate.getDay();
        const checkDayName = dayNames[checkDayOfWeek];
        
        // 通常の曜日チェック
        if (schedule.days.includes(checkDayName)) {
            return checkDate;
        }
        
        // 第X週チェック
        for (const scheduleDay of schedule.days) {
            if (scheduleDay.includes('第') && scheduleDay.includes(checkDayName)) {
                const weekNumber = Math.ceil(checkDate.getDate() / 7);
                const requiredWeek = parseInt(scheduleDay.match(/第(\d+)/)[1]);
                
                if (weekNumber === requiredWeek) {
                    return checkDate;
                }
            }
        }
    }
    
    return null;
}

// 日付フォーマット
function formatDate(date) {
    if (!date) return null;
    
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    const dayOfWeek = dayNames[date.getDay()];
    
    return `${month}月${day}日（${dayOfWeek}）`;
}

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        regionData,
        findRegionByArea,
        getAllRegions,
        getScheduleByRegion,
        getNextCollectionDate,
        formatDate
    };
}
