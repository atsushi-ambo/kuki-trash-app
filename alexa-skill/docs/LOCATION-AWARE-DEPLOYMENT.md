# 🏠 Location-Aware Kuki City Garbage Sorting Alexa Skill

## ✨ New Features Added

### **📍 Location-Based Collection Schedules**
Your Alexa skill now supports location-aware garbage collection schedules, just like your Docker app!

### **🗺️ Supported Locations:**
- **久喜地区** (Kuki District) - Multiple blocks (A, B, C, D)
- **菖蒲地区** (Shobu District) 
- **鷲宮地区** (Washinomiya District)
- **栗橋地区** (Kurihashi District)

---

## 🚀 How It Works

### **1. Location Setup**
Users can set their location in two ways:
- **At Launch**: "久喜市ゴミ分別を開いて" → System asks for location
- **Anytime**: "久喜地区です" or "私は菖蒲に住んでいます"

### **2. Smart Responses**
Once location is set, the skill provides:
- ✅ **Specific collection days** for their area
- ✅ **Collection times** (8:30 AM)
- ✅ **Area-specific information**

### **3. Session Memory**
- Location is remembered during the conversation
- No need to repeat location for multiple queries

---

## 💬 Example Conversations

### **First Time User:**
```
User: "アレクサ、久喜市ゴミ分別を開いて"
Alexa: "久喜市ゴミ分別スキルへようこそ。お住まいの地区を設定すると、正確な収集日をお知らせできます。まず、どの地区にお住まいですか？"

User: "久喜地区です"
Alexa: "久喜地区Aブロックに設定しました。これで正確な収集日をお知らせできます。どのようなゴミについて知りたいですか？"

User: "ペットボトル"
Alexa: "ペットボトルは資源ゴミです。ラベルとキャップを外して、中を軽く洗って出してください。久喜地区Aブロックでは、水曜日の8:30に収集します。"
```

### **Returning User:**
```
User: "プラスチックについて教えて"
Alexa: "プラスチックはプラスチック製容器包装です。汚れを落として、プラマークがついているものを出してください。久喜地区Aブロックでは、水曜日の8:30に収集します。"
```

---

## 📋 Deployment Instructions

### **Step 1: Update Interaction Model**
1. Go to **Build** → **JSON Editor**
2. Copy content from `interactionModel-with-location.json`
3. **Save Model** → **Build Model**

### **Step 2: Deploy Updated Code**
1. Go to **Code** tab
2. Replace `index.js` with the enhanced version
3. **Save** → **Deploy**

### **Step 3: Test the New Features**

#### **Location Setting Tests:**
```
✅ "久喜市ゴミ分別を開いて"
✅ "久喜地区です"
✅ "私は菖蒲に住んでいます"
✅ "鷲宮を設定"
```

#### **Garbage Query Tests:**
```
✅ "ペットボトル"
✅ "プラスチックの分別方法を教えて"
✅ "缶について教えて"
✅ "久喜のペットボトル" (location + item in one request)
```

---

## 🛠️ Technical Implementation

### **New Intent: SetLocationIntent**
Handles location setting with natural language:
- "久喜地区です"
- "私は菖蒲に住んでいます"
- "住所は鷲宮です"

### **Enhanced GarbageSearchIntent**
Now supports:
- Location detection in the same request
- Session-based location memory
- Location-specific collection schedules

### **Smart Location Mapping**
```javascript
const locationMap = {
    '久喜': 'kuki-a',
    '菖蒲': 'shobu-a',
    '鷲宮': 'washinomiya-a',
    '青毛': 'kuki-a',
    '本町': 'kuki-c',
    // ... more mappings
};
```

### **Schedule Integration**
```javascript
const regionData = {
    'kuki-a': {
        name: '久喜地区Aブロック',
        schedule: {
            'びん・缶・ペットボトル': { 
                days: ['水曜日'], 
                time: '8:30' 
            }
            // ... more schedules
        }
    }
    // ... more regions
};
```

---

## 🎯 Benefits

### **For Users:**
- 🏠 **Personalized experience** based on their location
- ⏰ **Accurate collection times** for their specific area
- 📅 **No more guessing** collection days
- 💭 **Remembers their location** during conversation

### **For Kuki City:**
- 📊 **Better user engagement** with personalized info
- 🎯 **More accurate information** delivery
- 📱 **Consistent experience** with your Docker app
- 🌱 **Improved recycling compliance**

---

## 🔧 Future Enhancements

### **Possible Additions:**
1. **🗓️ Collection Calendar**: "Next collection day"
2. **⚠️ Holiday Schedules**: Handle special collection days
3. **📍 Address Detection**: More granular location detection
4. **🔔 Reminders**: "Remind me to put out garbage"
5. **📊 Collection History**: Track user queries

---

## 🏃‍♂️ Quick Start

1. **Copy** `interactionModel-with-location.json` to Build → JSON Editor
2. **Build** the model
3. **Copy** the enhanced `index.js` to Code tab
4. **Deploy** the code
5. **Test** with: "久喜市ゴミ分別を開いて"

Your Alexa skill now provides the same location-aware experience as your Docker app! 🎉
