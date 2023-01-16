import Shortcuts from '../Shortcuts'

import navigation from './navigation'
import videos from './videos'
import videoPlayer from './videoPlayer'
import channel from './channel'
import playlist from './playlist'
import stream from './stream'

export default new Shortcuts('youtube', /www\.youtube\.com/, true, [
  navigation,
  videos,
  videoPlayer,
  channel,
  playlist,
  stream,
])
