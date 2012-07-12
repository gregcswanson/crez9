
/*!
 * Code was adapted from the express-messages module so that the exported html could be changed
 */

module.exports = function(req, res){
  return function(){
    var buf = []
      , messages = req.flash()
      , types = Object.keys(messages)
      , len = types.length;
    if (!len) return '';
    buf.push('<div id="messages">');
    for (var i = 0; i < len; ++i) {
      var type = types[i]
        , msgs = messages[type];
      if (msgs) {
        for (var j = 0, l = msgs.length; j < l; ++j) {
          var msg = msgs[j];
          buf.push('<div class="alert-box ' + type + '">' + msg + '<a href="" class="close">&times;</a></div>');
        }
      }
    }
    buf.push('</div>');
    return buf.join('\n');
  }
};