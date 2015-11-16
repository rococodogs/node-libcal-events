var https = require('https')
var util = require('util')

module.exports = function libCalFeed (iid, cals, cb) {
  var opts = {}

  // libCalFeed({}, cb)
  if (typeof iid === 'object') {
    opts = iid
    cb = cals
    cals = opts.calendar
    iid = opts.iid
  }

  if (typeof cals === 'string') cals = [cals]

  var start = opts.start || todaysDate()
  var end = opts.end   || nextMonthsDate()

  // output
  var all = []

  ;(function getFeed () {
    var cid
    if (cid = cals.shift()) {
      https.get(calUrl(cid), function (res) {
        var b = ''
        
        if (res.statusCode !== 200)
          return cb(new Error('There was an error while obtaining the feed'))
        
        res.setEncoding('utf8')
        res.on('data', function (d) { b += d })
        res.on('end', function () {
          var parsed
          try { parsed = JSON.parse(b) }
          catch (e) { parsed = [] }

          all = all.concat(parsed)
          return getFeed()
        })
      })
    } else return cb(null, all)
  })()

  function calUrl (cal) {
    return require('util').format(
      'https://api3.libcal.com/process_cal.php?c=%d&sp=%d&iid=%d&start=%s&end=%s',
      cal,
      1,  // always show past events: if start >= today, they won't be visible anyway
      iid,
      start,
      end
    )
  }
}

function todaysDate () {
  var d = new Date()
  return [
    d.getFullYear(), 
    zeroPad(d.getMonth() + 1),
    zeroPad(d.getDate())
  ].join('-')
}

function nextMonthsDate () {
  var d = new Date()
  var n = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
  return [
    n.getFullYear(),
    zeroPad(n.getMonth() + 1),
    zeroPad(n.getDate())
  ].join('-')
}

function zeroPad (num) {
  return num < 10 ? '0' + num : num
}
