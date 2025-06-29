# Alexa-Hosted Skill Deployment Guide

## Fixed Issues in the Code

### 1. **Added Missing Intent Handlers**
- `GarbageSearchIntentHandler`: Handles garbage sorting queries
- `HelpIntentHandler`: Provides help information
- `CancelAndStopIntentHandler`: Handles stop/cancel requests
- `SessionEndedRequestHandler`: Handles session cleanup

### 2. **Added Garbage Data**
Added comprehensive garbage sorting data for Kuki city including:
- ペットボトル (PET bottles)
- 缶 (Cans)
- びん (Glass bottles)
- プラスチック (Plastic)
- ビニール袋 (Plastic bags)
- 新聞 (Newspapers)
- 段ボール (Cardboard)

### 3. **Improved User Experience**
- Better welcome message
- More informative responses
- Proper reprompt handling
- Error handling with helpful messages

## How to Deploy to Alexa-Hosted

### Step 1: Create New Alexa-Hosted Skill

1. Go to [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask)
2. Click **"Create Skill"**
3. Enter skill name: **"久喜市ゴミ分別"**
4. Choose **Japanese (JP)** as primary locale
5. Select **"Custom"** model
6. Choose **"Alexa-Hosted (Node.js)"** as backend
7. Click **"Create skill"**

### Step 2: Setup Interaction Model

1. Go to **"Build"** tab → **"Interaction Model"** → **"JSON Editor"**
2. Replace the entire JSON with the content from `interactionModel.json`
3. Click **"Save Model"**
4. Click **"Build Model"** and wait for completion

### Step 3: Deploy Lambda Code

1. Go to **"Code"** tab
2. Replace the entire content of `index.js` with our fixed code
3. Update `package.json` if needed (dependencies should already be there)
4. Click **"Save"**
5. Click **"Deploy"** and wait for deployment to complete

### Step 4: Configure Skill Information

1. Go to **"Build"** tab → **"Skill Information"**
2. Set invocation name: **"久喜市ゴミ分別"**
3. Go to **"Distribution"** tab:
   - Add skill description
   - Add example phrases
   - Upload icons (optional)
   - Set category to "Knowledge & Trivia"
   - Set distribution countries to Japan only

### Step 5: Test the Skill

1. Go to **"Test"** tab
2. Enable testing: **"Development"**
3. Test with these phrases:
   - "久喜市ゴミ分別を開いて"
   - "ペットボトルの分別方法を教えて"
   - "缶について教えて"
   - "ヘルプ"

### Step 6: Certification (Optional)

1. Go to **"Distribution"** tab
2. Fill all required information
3. Submit for certification to make it publicly available

## Testing Commands

### Voice Commands to Test:
```
アレクサ、久喜市ゴミ分別を開いて
ペットボトルの分別方法を教えて
缶はどうやって捨てますか
プラスチックについて教えて
ヘルプ
ストップ
```

### Expected Responses:
- Launch: Welcome message with instructions
- Garbage queries: Specific sorting information with collection days
- Help: Overview of available commands
- Stop/Cancel: Goodbye message

## Troubleshooting

### Common Issues:

1. **Build Model Fails**
   - Check JSON syntax in interaction model
   - Ensure all intent names match between model and code

2. **Code Deploy Fails**
   - Check JavaScript syntax
   - Ensure all required dependencies are in package.json

3. **Skill Doesn't Respond**
   - Check CloudWatch logs in Code tab
   - Verify intent handlers are properly registered

4. **Japanese Not Working**
   - Ensure locale is set to ja-JP
   - Use Japanese characters in responses

### Log Monitoring:
- Go to **"Code"** tab → **"Logs"** to see console output
- Use the logging statements we added for debugging

## File Structure for Alexa-Hosted:
```
lambda/
├── index.js          (Main skill logic)
├── package.json      (Dependencies)
└── util.js           (Optional utilities)

interactionModels/
└── custom/
    └── ja-JP.json    (Interaction model)
```

## Next Steps:
1. Test thoroughly with various garbage items
2. Add more garbage types if needed
3. Consider adding collection schedule functionality
4. Add more natural language variations
5. Submit for certification when ready
