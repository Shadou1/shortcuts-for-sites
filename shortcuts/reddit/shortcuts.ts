import Shortcuts from '../Shortcuts'

import navigation from './navigation'
import posts from './posts'
import post from './post'
import postsFilters from './postsFilters'
import video from './video'

export default new Shortcuts('reddit', /www\.reddit\.com/, true, [
  navigation,
  posts,
  post,
  postsFilters,
  video,
])

// TODO add focus sidebar

// TODO video player on /hot, /new, /top pages works without a shadow dom (no saving mute/unmute, volume, and restarting video is wacky)
// TODO video is played in background sometimes
