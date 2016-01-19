var https = require('https')
var util = require('util')

module.exports = function libCalFeed (iid, cals, cb) {
  var opts = {}

  // libCalFeed({}, cb)
  if (typeof iid === 'object') {
    opts = iid
    cb = cals
    cals = opts.calendars || opts.calendar
    iid = opts.iid
  }

  if (!Array.isArray(cals)) cals = [cals]

  // make a copy of cals that we can mutate
  var copy = cals.slice()

  var start = opts.start || todaysDate()
  var end = opts.end || todaysDate()

  if (start instanceof Date) start = formatDate(start)
  if (end instanceof Date) end = formatDate(end)

  // output
  var all = []

  ;(function getFeed () {
    var cid
    if (cid = copy.shift()) {
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
    return util.format(
      'https://api3.libcal.com/process_cal.php?c=%d&sp=%d&iid=%d&start=%s&end=%s&_=%s',
      cal,
      1,  // always show past events: if start >= today, they won't be visible anyway
      iid,
      start,
      end,
      Date.now() // prevent caching
    )
  }
}

function todaysDate () {
  return formatDate(new Date())
}

function nextMonthsDate () {
  var d = new Date()
  var n = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
  return formatDate(n)
}

function formatDate (d) {
  return [
    d.getFullYear(),
    zeroPad(d.getMonth() + 1),
    zeroPad(d.getDate())
  ].join('-')
}

function zeroPad (num) {
  return num < 10 ? '0' + num : num
}
