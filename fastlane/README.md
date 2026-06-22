fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### set_build_numbers_to_current_timestamp
```
fastlane set_build_numbers_to_current_timestamp
```

### check_appstore_version
```
fastlane check_appstore_version
```


----

## iOS
### ios restore_files
```
fastlane ios restore_files
```

### ios setup
```
fastlane ios setup
```

### ios build
```
fastlane ios build
```

### ios deploy
```
fastlane ios deploy
```

### ios get_certificates_and_profiles
```
fastlane ios get_certificates_and_profiles
```

### ios generate_manual_certificates
```
fastlane ios generate_manual_certificates
```


----

## Android
### android build
```
fastlane android build
```

### android deploy
```
fastlane android deploy
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
