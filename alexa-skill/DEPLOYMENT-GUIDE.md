# Alexa Skill Deployment Guide

## Steps to Deploy the Kuki Trash App Alexa Skill

### 1. Upload Lambda Code
1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Open your "kuki-trash-app" skill
3. Click on the **Code** tab
4. Copy the entire contents of `lambda/index.js` and paste it into the online editor
5. Click **Save** and then **Deploy**

### 2. Upload Interaction Model
1. In the same skill, click on the **Build** tab
2. Click on **JSON Editor** in the left sidebar
3. Copy the entire contents of `interactionModel.json` and paste it into the editor
4. Click **Save Model**
5. Click **Build Model** (this may take a few minutes)

### 3. Test the Skill
1. Click on the **Test** tab
2. Enable testing by selecting "Development" from the dropdown
3. Test these sample phrases:
   - "アレクサ、久喜市ゴミ分別を開いて"
   - "ペットボトルの分別方法を教えて"
   - "今日のゴミは何ですか"
   - "明日のゴミは何ですか"
   - "可燃ゴミの収集日はいつですか"

### 4. Key Features to Test
- **Pronunciation variations**: Try "ぺっとぼとる" instead of "ペットボトル"
- **Collection day queries**: Ask about today's and tomorrow's garbage
- **Region setting**: Try "地区をAブロックに設定"

### 5. Verify Synchronization
The following features are now synchronized with the Web app:
- ✅ Pronunciation similarity search (11 mappings)
- ✅ Collection day processing (unified query handling)
- ✅ Region-specific schedules
- ✅ Garbage categorization logic

## Files to Copy:

### Lambda Code (`lambda/index.js`)
Copy the entire file contents to the Code tab in Alexa Developer Console.

### Interaction Model (`interactionModel.json`)
Copy the entire JSON contents to the Build > JSON Editor in Alexa Developer Console.

## Notes:
- The skill is configured for Japanese language
- Invocation name: "久喜市ゴミ分別"
- Uses Alexa-hosted Node.js runtime
- All pronunciation mappings from Web app are included
- Collection day queries are processed before garbage search
