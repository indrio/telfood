#!/bin/sh

cordova build android --release;
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore telfood.jks platforms/android/build/outputs/apk/android-release-unsigned.apk telfood;
rm -f Indifood.apk;
~/javalibs/android-sdks/build-tools/25.0.3/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk Indifood.apk;