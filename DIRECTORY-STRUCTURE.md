# Directory Structure

This document describes the organized directory structure of the Kuki Trash App project.

## Overview

```
kuki-trash-app/
├── src/                           # Source code
│   ├── web/                       # Web application
│   │   ├── js/                    # JavaScript files
│   │   │   ├── app.js             # Main application logic
│   │   │   ├── app-production.js  # Production build
│   │   │   └── sw.js              # Service worker
│   │   ├── css/                   # Stylesheets
│   │   │   └── styles.css         # Main stylesheet
│   │   └── assets/                # Static assets
│   │       └── icons/             # Application icons
│   │           ├── favicon.svg
│   │           ├── favicon.png
│   │           ├── icon-192x192.svg
│   │           ├── icon-192x192.png
│   │           ├── icon-512x512.svg
│   │           └── icon-512x512.png
│   └── shared/                    # Shared data files
│       ├── garbageData.js         # Garbage classification data
│       └── regionData.js          # Regional schedule data
├── alexa-skill/                   # Alexa skill implementation
│   ├── lambda/                    # Lambda function code
│   │   ├── index.js               # Main Alexa skill handler
│   │   ├── package.json           # Node.js dependencies
│   │   └── package-lock.json      # Locked dependencies
│   ├── models/                    # Interaction models
│   │   ├── interactionModel.json  # Base interaction model
│   │   ├── interactionModel-with-location.json  # Enhanced model
│   │   ├── interactionModel-complex.json        # Complex model
│   │   ├── interactionModel-fixed.json          # Fixed model
│   │   └── interactionModel-improved.json       # Improved model
│   ├── docs/                      # Alexa skill documentation
│   │   ├── README.md              # Alexa skill README
│   │   ├── ALEXA-HOSTED-DEPLOYMENT.md
│   │   ├── LOCATION-AWARE-DEPLOYMENT.md
│   │   └── COMPREHENSIVE-ENHANCEMENT-SUMMARY.md
│   └── skill.json                 # Skill manifest
├── tests/                         # Test files
│   ├── web/                       # Web application tests
│   │   ├── test.js                # Main test suite
│   │   ├── test-voice-region.js   # Voice region tests
│   │   ├── debug-region.html      # Debug utilities
│   │   ├── test-summary.html      # Test summary page
│   │   └── voice-region-test.html # Voice region test page
│   └── alexa/                     # Alexa skill tests
│       └── test-local.js          # Local Alexa testing
├── tools/                         # Development tools
│   ├── convert-icons.js           # Icon conversion utility
│   ├── create-icons.html          # Icon creation tool
│   └── clear-storage.html         # Storage management tool
├── docker/                        # Docker configuration
│   └── nginx.conf                 # Nginx configuration
├── docs/                          # Project documentation
│   └── images/                    # Documentation images
│       └── app-screenshot.png     # Application screenshot
├── .github/                       # GitHub workflows
├── .vscode/                       # VS Code configuration
├── node_modules/                  # Node.js dependencies
├── index.html                     # Main web application entry point
├── manifest.json                  # PWA manifest
├── package.json                   # Main package configuration
├── package-lock.json              # Locked dependencies
├── docker-compose.yml             # Docker Compose configuration
├── Dockerfile                     # Docker build configuration
├── README.md                      # Main project README
├── LICENSE                        # MIT License
├── CONTRIBUTING.md                # Contribution guidelines
├── SECURITY.md                    # Security policy
├── DEPLOYMENT.md                  # Deployment instructions
├── IMPLEMENTATION-REPORT.md       # Implementation report
├── PROJECT-COMPLETION-REPORT.md   # Project completion report
├── FINAL-PREPARATION-REPORT.md    # Final preparation report
└── DIRECTORY-STRUCTURE.md         # This file
```

## Key Improvements

### 1. **Organized Source Code**
- **`src/web/`**: All web application code organized by type (JS, CSS, assets)
- **`src/shared/`**: Shared data files used by both web and Alexa implementations
- **Clear separation**: Web-specific code separated from shared resources

### 2. **Clean Alexa Skill Structure**
- **`alexa-skill/lambda/`**: Lambda function code only
- **`alexa-skill/models/`**: All interaction models organized together
- **`alexa-skill/docs/`**: Comprehensive documentation for deployment and enhancement

### 3. **Dedicated Test Structure**
- **`tests/web/`**: Web application tests and debugging tools
- **`tests/alexa/`**: Alexa skill testing utilities
- **Separation**: Test files removed from production directories

### 4. **Development Tools**
- **`tools/`**: All development utilities in one place
- **Clear purpose**: Each tool has a specific function (icons, storage, etc.)

### 5. **Improved Maintainability**
- **Logical grouping**: Related files are co-located
- **Clear naming**: Directory names clearly indicate their purpose
- **Scalability**: Structure supports future growth and additional features

## Benefits

1. **Developer Experience**: Easier to find and modify specific functionality
2. **Build Process**: Clear separation enables better build optimization
3. **Testing**: Dedicated test structure improves test organization
4. **Documentation**: Better organization of project documentation
5. **Deployment**: Cleaner structure for different deployment targets (web, Alexa)

## Usage

- **Web Development**: Work primarily in `src/web/` and `src/shared/`
- **Alexa Development**: Work in `alexa-skill/lambda/` and `alexa-skill/models/`
- **Testing**: Use appropriate test directories for each platform
- **Tools**: Use utilities in `tools/` for development tasks

This structure maintains backward compatibility while providing a cleaner, more maintainable codebase.
