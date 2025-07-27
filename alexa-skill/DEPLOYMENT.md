# 🚀 久喜市ゴミ分別 Alexa スキル - デプロイガイド

## What You Need (Only 3 Files!)

✅ **For Alexa Developer Console Code Tab:**
1. `lambda/index.js` - Your skill logic
2. `lambda/package.json` - Dependencies

✅ **For Alexa Developer Console Build Tab:**
3. `models/interactionModel.json` - Voice interaction model

---

## Step-by-Step Deployment

### 1. Create Alexa-Hosted Skill (2 minutes)
1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Click **"Create Skill"**
3. Name: `久喜市ゴミ分別`
4. Language: `Japanese (JP)`
5. Model: `Custom`
6. **Hosting: `Alexa-hosted (Node.js)`** ← Important!
7. Click **"Create skill"**

### 2. Upload Code (3 minutes)
1. Go to **Code** tab
2. Replace `index.js` with your cleaned `lambda/index.js`
3. Replace `package.json` with your cleaned `lambda/package.json`
4. Delete `util.js` (not needed)
5. Click **"Save"** then **"Deploy"**

### 3. Build Interaction Model (3 minutes)
1. Go to **Build** tab
2. Click **"JSON Editor"**
3. Replace entire JSON with your `models/interactionModel.json`
4. Click **"Save Model"** then **"Build Model"**

### 4. Test Your Skill (2 minutes)
1. Go to **Test** tab
2. Enable testing: select **"Development"**
3. Type: `久喜市ゴミ分別を開いて`
4. Should get welcome message asking for your region ✅

**⚠️ If skill freezes:**
- Check **Code** tab for deployment errors
- Look at **CloudWatch Logs** for runtime errors
- Make sure you clicked **"Save"** then **"Deploy"** in Code tab

### 5. Set Your Location (1 minute)
**Important:** Set your specific block for accurate collection schedules!
1. Say: `"久喜地区Dブロックです"` (or your actual block)
2. Alexa confirms: `"久喜地区Dブロックに設定しました"`
3. Now all garbage queries will use your block's schedule ✅

---

## Expected Test Flow ✅ VERIFIED WORKING

```
You: "久喜市ゴミ分別を開いて"
Alexa: "久喜市ゴミ分別スキルへようこそ。お住まいの地区を設定すると、
       正確な収集日をお知らせできます。お住まいの地区とブロックを教えて
       ください。例えば、久喜地区Aブロック、久喜地区Dブロック、
       菖蒲地区Aブロックのように具体的にお答えください。"

You: "久喜地区Dブロックです"  
Alexa: "久喜地区Dブロックに設定しました。これで正確な収集日をお知らせ
       できます。どのようなゴミについて知りたいですか？"

You: "ペットボトルの分別方法を教えて"
Alexa: "ペットボトルは資源ゴミです。キャップとラベルを外して、
       中を軽く洗ってから透明・半透明の袋に入れて出してください。
       久喜地区Dブロックでは、木曜日の8:30に収集します。"
```

**✅ Status: SUCCESSFULLY DEPLOYED AND TESTED**

---

## 📍 Setting Your Location Block

Your skill supports multiple areas in Kuki City. **You must set your specific block** to get accurate collection schedules.

### Available Locations:

#### 🏠 Kuki Area (久喜地区):
- **Aブロック**: `"久喜地区Aブロックです"` or `"久喜のAブロックです"`
- **Bブロック**: `"久喜地区Bブロックです"` or `"久喜のBブロックです"` 
- **Cブロック**: `"久喜地区Cブロックです"` or `"久喜のCブロックです"`
- **Dブロック**: `"久喜地区Dブロックです"` or `"久喜のDブロックです"`

#### 🌸 Shobu Area (菖蒲地区):
- **Aブロック**: `"菖蒲地区Aブロックです"`
- **Bブロック**: `"菖蒲地区Bブロックです"`

#### 🦅 Washimiya Area (鷲宮地区):
- **Aブロック**: `"鷲宮地区Aブロックです"`
- **Bブロック**: `"鷲宮地区Bブロックです"`

#### 🌾 Kurihashi Area (栗橋地区):
- **Aブロック**: `"栗橋地区Aブロックです"`
- **Bブロック**: `"栗橋地区Bブロックです"`

### How to Set Your Location:

**Method 1 - Direct Statement:**
```
You: "久喜地区Dブロックです" OR "久喜のDブロックです"
Alexa: "久喜地区Dブロックに設定しました。これで正確な収集日をお伝えできます。"
```

**Method 2 - Request to Set:**
```
You: "久喜地区Dブロックに設定して" OR "久喜のDブロックに設定して"
Alexa: "久喜地区Dブロックに設定しました。"
```

**Method 3 - During Welcome:**
```
Alexa: "お住まいの地区を教えてください"
You: "久喜地区Dブロックに住んでいます"
Alexa: "久喜地区Dブロックに設定しました。"
```

### 🔄 Changing Your Location:
You can change your location anytime during the conversation:
```
You: "場所を久喜地区Bブロックに変更して"
Alexa: "久喜地区Bブロックに設定しました。"
```

### ⚠️ Important Notes:
- **Different blocks have different collection days!**
- **You only need to set location once per session**
- **Location resets when you restart the skill**
- **Always verify your block matches your actual address**

---

## Files You Need

### `/lambda/index.js` ✅ (Cleaned - no console.log)
### `/lambda/package.json` ✅ (Simplified)  
### `/models/interactionModel.json` ✅ (Your current one is perfect)

---

## Troubleshooting

**If skill freezes on launch:**
- **Most Common**: Code deployment didn't complete properly
  - Go to **Code** tab → Click **"Save"** → Click **"Deploy"**
  - Wait for "Deployment successful" message
  - Try testing again
- Check **CloudWatch Logs** link in Code tab for runtime errors
- Make sure you replaced both `index.js` AND `package.json`

**If location setting fails (returns error message):**
- Make sure interaction model was built successfully in **Build** tab
- Try saying: `"久喜地区Aブロック"` (exact format)
- Check CloudWatch logs for slot resolution errors

**If deployment fails:**
- Check Code tab logs for errors
- Make sure package.json is valid JSON
- Redeploy after fixing

**If build fails:**
- Check JSON syntax in interaction model
- Make sure invocation name is set correctly

**If skill doesn't respond:**
- Check Test tab for error messages
- Verify all 3 steps completed successfully

**If skill freezes on launch:**
- ✅ **Use**: `"久喜市ゴミ分別を開いて"` (exact invocation name)
- ✅ **Use**: `"久喜市ごみ分別を開いて"` (hiragana version) 
- ❌ **Avoid**: Any phrase with "アプリ" (causes freezing)
- ❌ **Avoid**: `"久喜のゴミ分別アプリを開いて"` (known to freeze)

**If wrong block is set (e.g. A instead of D):**
- Say clearly: `"久喜のDブロックです"` or `"久喜地区Dブロックです"`
- Wait for confirmation before continuing
- You can change anytime: `"久喜のDブロックに変更して"`

---

## 🚀 Quick Reference - Voice Commands

### Opening the Skill:
- ✅ `"アレクサ、久喜市ゴミ分別を開いて"` ← **RECOMMENDED**
- ✅ `"アレクサ、久喜市ゴミ分別"`
- ✅ `"アレクサ、久喜市ごみ分別を開いて"` ← **Now Fixed**
- ✅ `"アレクサ、久喜市ごみ分別"`
- ⚠️ Avoid phrases with "アプリ" - they can cause freezing

### Setting Location (Choose Your Block):
- ✅ `"久喜地区Aブロックです"` 
- ✅ `"久喜地区Bブロックです"`
- ✅ `"久喜地区Cブロックです"` 
- ✅ `"久喜地区Dブロックです"`
- ✅ `"久喜のAブロックです"` ← **Natural way**
- ✅ `"久喜のBブロックです"` ← **Natural way**
- ✅ `"久喜のCブロックです"` ← **Natural way**
- ✅ `"久喜のDブロックです"` ← **Natural way**
- ✅ `"菖蒲地区Aブロックです"`
- ✅ `"鷲宮地区Aブロックです"`
- ✅ `"栗橋地区Aブロックです"`

### Asking About Garbage:
- `"ペットボトルについて教えて"`
- `"缶の分別方法は？"`
- `"プラスチックはどうする？"`
- `"びんの捨て方を教えて"`

### Asking About Schedule:
- `"何曜日"` ← **All collection days**
- `"いつ"` ← **All collection days**
- `"収集日を教えて"` ← **All collection days**
- `"ペットボトルは何曜日？"` ← **Specific item schedule**

### Getting Help:
- `"ヘルプ"`
- `"使い方を教えて"`

---

## 🎉 That's It!

**Total time: ~10 minutes**  
**No AWS account needed**  
**No Lambda setup required**

Your skill will work immediately on any Alexa device linked to your developer account!
