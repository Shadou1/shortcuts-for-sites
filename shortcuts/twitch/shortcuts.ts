import Shortcuts from '../Shortcuts'

import channel from './channel'
import chat from './chat'
import miniPlayer from './miniPlayer'
import navigation from './navigation'
import relevantAnchors from './relevantAnchors'
import sidebar from './sidebar'
import stream from './stream'

export default new Shortcuts('twitch', /www\.twitch\.tv/, true, [
  sidebar,
  relevantAnchors,
  navigation,
  stream,
  chat,
  channel,
  miniPlayer,
])
