import Shortcuts from '../Shortcuts'

import searchModes from './searchModes'
import search from './search'

export default new Shortcuts('google-search', /www\.google\..+/, false, [
  searchModes,
  search,
])
