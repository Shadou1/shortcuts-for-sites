import Shortcuts from '../Shortcuts'

import translate from './translate'
import translationDetails from './translationDetails'

export default new Shortcuts('google-translate', /translate\.google\..+/, false, [
  translate,
  translationDetails,
])
