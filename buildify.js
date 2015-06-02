var buildify = require('buildify')

buildify()
  .load('./.tmp/vreme.js')
  .wrap('./templates/template.js', {})
  .save('vreme.js')
  .uglify()
  .save('vreme.min.js');
