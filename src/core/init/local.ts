import { localAction } from '@/store/local'
import { getLocalMusicList, saveLocalMusicList, getLocalFolders, saveLocalFolders } from '@/utils/data'
import { throttle } from '@/utils/common'

const saveLocalListThrottle = throttle(() => {
  void saveLocalMusicList(localAction.getList())
}, 2000)

// Immediate save for clear operation
export const saveLocalListNow = () => {
  void saveLocalMusicList(localAction.getList())
}

const saveLocalFoldersThrottle = throttle(() => {
  void saveLocalFolders(localAction.getFolders())
}, 1000)

export const initLocalMusic = async() => {
  // Load saved data
  const [list, folders] = await Promise.all([
    getLocalMusicList(),
    getLocalFolders(),
  ])

  if (list.length) {
    localAction.setList(list)
  }
  if (folders.length) {
    localAction.setFolders(folders)
  }

  // Subscribe to changes and save
  global.state_event.on('localListChanged', () => {
    saveLocalListThrottle()
  })

  global.state_event.on('localFoldersChanged', () => {
    saveLocalFoldersThrottle()
  })
}
