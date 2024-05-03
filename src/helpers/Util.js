import { Alert, Share } from 'react-native';
import Toast from 'react-native-tiny-toast';

export function showToast(title) {
  Toast.show(title);
}

export function stringToNumber(str) {
  const num = Number(str);

  if (isNaN(num)) {
    return 0;
  } else {
    return num;
  }
}

export const onShare = async obj => {
  try {
    const result = await Share.share({
      title: obj.title,
      message: obj.msg,
      url: obj.url,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    headingAlert('Error', error.message);
  }
};

// export function headingAlert( heading, title, showCancelBtn = false) {
//     Alert.alert(
//         heading,
//         title,
//         (showCancelBtn)?(
//             [
//                 {
//                   text: 'Cancel',
//                   style: 'destructive',
//                   onPress: () => {},
//                 },
//                 {
//                   text: 'OK',
//                   onPress: () => {},
//                 },
//               ]
//         ):(
//             [
//                 {
//                   text: 'OK',
//                   onPress: () => {},
//                 },
//               ]
//         )
//         ,
//         {cancelable: false},
//       );
// }

export function headingAlert(heading, title) {
  Alert.alert(
    heading,
    title,
    [
      {
        text: 'OK',
        onPress: () => { },
      },
    ],
    { cancelable: false },
  );
}

export function navigate(navigation, screenName) {
  navigation.navigate(screenName);
}

export function navigateWithParams(navigation, screenName, params) {
  navigation.navigate(screenName, params);
}

export function getNavPrams(props) {
  return props.navigation.state.params || {};
}
export function push(navigation, screenName) {
  navigation.navigate(screenName);
}

export function pushWithParams(navigation, screenName, params) {
  navigation.push(screenName, params);
}
export function goBack(navigation) {
  navigation.goBack();
}

export function navigationPOP(navigation, level = 1) {
  navigation.pop(level);
}
