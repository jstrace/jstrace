
exports.remote = function(){
  // console.* calls relay to the local client
  setInterval(function(){
    console.log({
      user: {
        name: {
          first: 'tobi',
          last: 'ferret'
        }
      }
    });
  }, 100);
};