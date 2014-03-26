
exports.remote = function(){
  // console.* calls relay to the local client
  setInterval(function(){
    console.dir({
      user: {
        name: {
          first: 'tobi',
          last: 'ferret'
        }
      }
    });
  }, 250);
};