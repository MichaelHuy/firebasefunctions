exports.updateFeed = functions.database.ref('/stories/{userId}/{storyId}').onWrite(event => {
  const userId = event.params.userId;
  const storyId = event.params.storyId;

  let followersRef = admin.database().ref('/followers/'+userId);
  if(!event.data.val()){
    //post was deleted
    followersRef.once("value", function(snap) {
      snap.forEach(function(childSnapshot) {
        let followerId = childSnapshot.key;
        admin.database().ref('/feed/'+followerId+'/'+storyId).remove();
        console.log('Removed post from feed of user: '+ followerId);
      });
    });
  }else{
    //post was added
    followersRef.once("value", function(snap) {
      snap.forEach(function(childSnapshot) {
        let followerId = childSnapshot.key;
        admin.database().ref('/feed/'+followerId+'/'+storyId).set(event.data.val());
        console.log('Added post to feed of user: '+ followerId);
      });
    });
  }
});