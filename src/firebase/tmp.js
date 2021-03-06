import PushNotification, {Importance} from 'react-native-push-notification';
import {timeDiff} from '../libs';
// import NotificationHandler from './NotificationHandler';

//singleton

const NotifyService = (function () {
  let instance;
  let lastId = 0;
  let lastChannelCounter = 0;

  const init = () => {
    createDefaultChannels();

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
    });

    PushNotification.getChannels(function (channels) {
      console.log(channels);
    });

    return {
      createOrUpdateChannel: function () {
        lastChannelCounter++;
        PushNotification.createChannel(
          {
            channelId: 'custom-channel-id', // (required)
            channelName: `Custom channel - Counter: ${lastChannelCounter}`, // (required)
            channelDescription: `A custom channel to categorise your custom notifications. Updated at: ${Date.now()}`, // (optional) default: undefined.
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
      },

      popInitialNotification: function () {
        PushNotification.popInitialNotification(notification =>
          console.log('InitialNotication:', notification),
        );
      },

      testNotify: function (notiData) {
        lastId++;
        const {title, subTitle, content, message, soundName} = notiData;

        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
          ticker: 'My Notification Ticker', // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
          smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: `${content}`, // (optional) default: "message" prop
          subText: subTitle, // (optional) default: none
          color: 'blue', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: 'group', // (optional) add group to message
          groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          // actions: [''], // (Android only) See the doc for notification actions to know more
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

          when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
          usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
          timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

          /* iOS only properties */
          category: '', // (optional) default: empty string
          subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

          /* iOS and Android properties */
          id: lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: title, // (optional)
          message: message, // (required)
          userInfo: {screen: 'home'}, // (optional) default: {} (using null throws a JSON value '<null>' error)
          playSound: !!soundName, // (optional) default: true
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
      },

      messageNotify: function (notiData) {
        lastId++;
        const {senderName, message, soundName} = notiData;
        let content = 'You have a new message';
        if (message.media) {
          content = 'Image...';
        } else if (message.text) {
          content = message.text;
        }

        PushNotification.localNotification({
          /* Android Only Properties */
          channelId: soundName ? 'sound-channel-id' : 'default-channel-id',
          ticker: 'My Notification Ticker', // (optional)
          autoCancel: true, // (optional) default: true
          largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
          smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          bigText: `<strong>${senderName}:</strong> ${content}`, // (optional) default: "message" prop
          subText: timeDiff(message.createdAt), // (optional) default: none
          color: 'blue', // (optional) default: system default
          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          tag: 'some_tag', // (optional) add tag to message
          group: 'group', // (optional) add group to message
          groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
          ongoing: false, // (optional) set whether this is an "ongoing" notification
          actions: ['Reply'], // (Android only) See the doc for notification actions to know more
          invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

          when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
          usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
          timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

          /* iOS only properties */
          category: '', // (optional) default: empty string
          subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

          /* iOS and Android properties */
          id: lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          title: 'Messenger', // (optional)
          message: `${senderName} send you a message`, // (required)
          userInfo: {screen: 'home'}, // (optional) default: {} (using null throws a JSON value '<null>' error)
          playSound: !!soundName, // (optional) default: true
          soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        });
      },

      checkPermission: function (cbk) {
        return PushNotification.checkPermissions(cbk);
      },

      requestPermissions: function () {
        return PushNotification.requestPermissions();
      },

      cancelNotif: function () {
        PushNotification.cancelLocalNotification(lastId);
      },

      cancelAll: function () {
        PushNotification.cancelAllLocalNotifications();
      },

      abandonPermissions: function () {
        PushNotification.abandonPermissions();
      },

      getScheduledLocalNotifications: function (callback) {
        PushNotification.getScheduledLocalNotifications(callback);
      },

      getDeliveredNotifications: function (callback) {
        PushNotification.getDeliveredNotifications(callback);
      },
    };
  };

  const createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: `Default channel`, // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created =>
        console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.createChannel(
      {
        channelId: 'sound-channel-id', // (required)
        channelName: `Sound channel`, // (required)
        channelDescription: 'A sound channel', // (optional) default: undefined.
        soundName: 'sample.mp3', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created =>
        console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  return {
    getInstance: function () {
      if (!instance) instance = init();
      return instance;
    },
  };
})();

export default NotifyService;
