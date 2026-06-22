import FirebaseService from './FirebaseService';

const FCMService = async taskData => {
  try {
    FirebaseService.displayNotification(taskData);
  } catch (err) {
    console.error(err);
  }
};

export default FCMService;
