var buildify = require('buildify')

buildify()
  .load('./.tmp/vreme.js')
  .save('vreme.js')
  .uglify()
  .save('vreme.min.js');
