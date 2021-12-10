# Rio Frontend

## Prerequisites

- Install NodeJS
    - Download the installer https://nodejs.org/en/download/
- Global dependencies
    -  @ionic/cli ^6.11.11
        - `npm i -g @ionic/cli`
- Android Studio
    - Android Studio is the IDE for creating native Android apps. It includes the Android SDK, which will need to be configured for use in the command line.
    - install https://developer.android.com/studio
    - Android Studio is also used to create Android virtual devices, which are required for the Android emulator. Ionic apps can also be launched to a device.
    - Once installed, open Android Studio. The IDE should detect that the Android SDK needs to be installed. In the SDK Components Setup screen, finish installing the SDK. Keep note of the Android SDK Location.
    -  the Android SDK can be managed with Android Studio in the **Configure » SDK Manager** menu of the Android Studio welcome screen or **Tools » SDK Manager** inside Android projects.
   
   - In `~/.bashrc, ~/.bash_profile`, or similar shell startup scripts, make the following modifications:
   - Set the ANDROID_SDK_ROOT environment variable. This path should be the Android SDK Location used in the previous section.
        
        `export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk`
        
   - Add the Android SDK command-line directories to PATH. Each directory corresponds to the category of command-line tool.
         
         
          # avdmanager, sdkmanager
          export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
          
          # adb, logcat
          export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
          
          # emulator
          export PATH=$PATH:$ANDROID_SDK_ROOT/emulator
          
            
- Creating an Android Virtual Device
    - Android Virtual Devices (AVDs) are blueprints that the Android emulator uses to run the Android OS. The following documentation is a quick way to get the Android emulator set up. For more detailed instructions and information, see the Android documentation.
    - AVDs are managed with the AVD Manager. In the Android Studio welcome screen, click **Configure » AVD Manager**. The AVD Manager can also be opened inside Android projects in the Tools » AVD Manager menu.
    
    - Click Create Virtual Device and select a suitable device definition. If unsure, choose Pixel 2. Then, select a suitable system image. If unsure, choose Pie (API 28) with Google Play services. See Android version history for information on Android versions.
    - Once the AVD is created, launch the AVD into the Android emulator. Keeping the emulator running is the best way to ensure detection while developing Ionic apps for Android.

- Since we are using firebase, we need a `google-services.json` at the rootdir of our application, with the correct settings, this file is not included in git for security reasons, for local development you'll have to create it manually. (more info read Firebase section below)

## Running the app
In your terminal window, make sure you are in the project's directory (or any subdirectory) and run:

    npm run start
        
this starts the following script:
    
    "start": "SENTRY_SKIP_AUTO_RELEASE=true ionic cordova emulate android --emulator --consolelogs --livereload",

    
## Building the app
In your terminal window, make sure you are in the project's directory (or any subdirectory) and run:

    npm run build


## Deploying the app
// TODO

## Environments

In your Ionic/Angular project you will find an environments folder. This folder will contain an environment.prod.ts file and an environment.ts file. Both of these files export an object called environment


environment.*.ts:

    export const environment = {
      // Your env variables here
    };
    
Since this object is being exported, that means that we can import and use it somewhere else in our application.

Then we would be able to tell if the application was running in production or development by accessing environment.prod somewhere in our code. In this case, we are just importing the value from environment.ts not environment.prod.ts

If you take a look at the angular.json file in your project, you will find the following configuration:

    "production": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],

The production build configuration is set up to replace the environment.ts file with environment.prod.ts. That means when we create a production build with ionic build --prod, the environment.prod.ts file will be used in place of environment.ts.
    
### Available environments RIO
- acc 
    - `environment.acc.ts`
- dev 
    - `environment.dev.ts`
- prod 
    - `environment.prod.ts`
- test 
    - `environment.test.ts`
    
## Pipelines

### Azure pipelines
- pipeline configurations can be found at `azure-piplines-*.yml`
- during the prepare-resources.sh script step in the pipeline the app icon will be overwritten by the icon that is set for each environment under `resources/android/icon/`.

## Release
Every new release, make sure to update the version in `config.xml` at the following line

    <widget android-versionCode="20" id="be.ordina.rio.app.dev" version="0.0.20">
    
## Local debugging
To easily debug your code when running the application on the emulator, you can use the chrome inspector.
- In your browser, go to [chrome://inspect/#devices](chrome://inspect/#devices)
- there you will see a list of running devices, 
- under 'Remote Target' check which one is your emulator (i.e. WebView in be.ordina.rio.app.dev) and click `inspec`
- this  brings up a new inspector window and you can access the console, network, etc.


## Features

### Multi-language
For our translations we're using the `ngx-translate` library
- docs: https://github.com/ngx-translate/core 
- translation files are located at `src/assets/i18n/*.json`
- by default 'nl-NL' is used (check `src/app/app.component.ts`)

### Sentry
- url: https://sentry.io/auth/login/
- login with credentials and see overview of all errors
- docs: https://docs.sentry.io/platforms/javascript/guides/cordova/ 

in our code the initialisation of sentry happens in `src/app/app.module.ts`

    Sentry.init({
        dsn: environment.dsn
    });

the dsn property (or Data Source Name) is the url to send data to.

### Authentication
For authentication we are using the `MSAdal` library which uses the `cordova-plugin-ms-adal` plugin.
- docs: https://ionicframework.com/docs/native/ms-adal
- docs: https://www.npmjs.com/package/cordova-plugin-ms-adal
- configurations are stored in the environment.ts files

## Routing
In our app-routing.module.ts we have the following routes
- `menu` which is our main layout component that is loaded when a user is logged in
- `login`, when a user is not logged in, they get redirected to this rout which sets the MSADAL authentication in motion.

all sub-routes of `menu` (so the routes that a user has to be authenticated for) are located in `src/app/menu/menu.module.ts`


## Structure
We try to keep the following structure for our files:
- components that are pages are located under `src/app/`
- components that can be consumed by pages (i.e. a reusable modal or custom input, ...) are located under `src/app/components/`
    - every component has his own module that exports it's related component(s)
    - import the module to i.e. a  page module, and you can use the component in the page.
- our model classes, interfaces and dto's are located at `src/app/interface/`  
- services are located at `src/app/services/`

## Firebase
For receiving notifications we are using the firebase API 
- push notifications docs: https://capacitorjs.com/docs/guides/push-notifications-firebase
- firebase config: `google-services.json` at the root of our project

In our messaging.service, we register our device to firebase and start listening for new notifications. (`src/app/modules/messaging/services/messaging.service.ts`)
The handleMessage method takes care of what to do when a message (aka notification) is received.
In our case it checks for the messsage type and triggers the showChangeNotification if needed (displays an alert to our screen). 

