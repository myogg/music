import { useRef, useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'
import { useDownloadList } from '@/store/download'
import { useTheme } from '@/store/theme/hook'
import { useI18n } from '@/lang'
import Text from '@/components/common/Text'
import ListItem, { ITEM_HEIGHT } from './ListItem'
import MultipleModeBar, { type MultipleModeBarType, type SelectMode, MULTI_SELECT_BAR_HEIGHT } from './MultipleModeBar'

export default ({ onShowMenu, onBatchClean, onRemoveCompleted }: {
  onShowMenu: (selectInfo: { item: LX.Download.ListItem, index: number }, position: { x: number, y: number, w: number, h: number }) => void
  onBatchClean: (items: LX.Download.ListItem[]) => void
  onRemoveCompleted: (items: LX.Download.ListItem[]) => void
}) => {
  const theme = useTheme()
  const t = useI18n()
  const list = useDownloadList()
  const flatListRef = useRef<FlatList>(null)
  const multipleModeBarRef = useRef<MultipleModeBarType>(null)
  
  // 多选模式状态
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [selectMode, setSelectMode] = useState<SelectMode>('single')
  const [selectedList, setSelectedList] = useState<LX.Download.ListItem[]>([])
  const selectedListRef = useRef<LX.Download.ListItem[]>([])
  const prevSelectIndexRef = useRef(-1)

  const renderItem = useCallback(({ item, index }: { item: LX.Download.ListItem, index: number }) => {
    const isSelected = selectedListRef.current.includes(item)
    return (
      <ListItem
        item={item}
        index={index}
        isMultiSelectMode={isMultiSelectMode}
        isSelected={isSelected}
        onPress={() => {
          if (isMultiSelectMode) {
            handleSelect(item, index)
          }
        }}
        onLongPress={() => {
          if (!isMultiSelectMode) {
            handleEnterMultiSelectMode()
            handleSelect(item, index)
          }
        }}
        onShowMenu={(item, index, position) => {
          if (!isMultiSelectMode) {
            onShowMenu({ item, index }, position)
          }
        }}
      />
    )
  }, [onShowMenu, isMultiSelectMode, selectedList])

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), [])

  const keyExtractor = useCallback((item: LX.Download.ListItem) => item.id, [])

  // 多选模式处理函数
  const handleEnterMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(true)
    multipleModeBarRef.current?.show()
  }, [])

  const handleExitMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(false)
    setSelectedList([])
    selectedListRef.current = []
    prevSelectIndexRef.current = -1
    multipleModeBarRef.current?.exitSelectMode()
  }, [])

  const handleSwitchSelectMode = useCallback((mode: SelectMode) => {
    setSelectMode(mode)
    multipleModeBarRef.current?.setSwitchMode(mode)
  }, [])

  const handleSelectAll = useCallback((isAll: boolean) => {
    const newList = isAll ? [...list] : []
    setSelectedList(newList)
    selectedListRef.current = newList
  }, [list])

  const handleSelect = useCallback((item: LX.Download.ListItem, pressIndex: number) => {
    let newList: LX.Download.ListItem[]
    if (selectMode === 'single') {
      prevSelectIndexRef.current = pressIndex
      const index = selectedListRef.current.indexOf(item)
      if (index < 0) {
        newList = [...selectedListRef.current, item]
      } else {
        newList = [...selectedListRef.current]
        newList.splice(index, 1)
      }
    } else {
      // 区间选择
      if (selectedListRef.current.length) {
        const prevIndex = prevSelectIndexRef.current
        const currentIndex = pressIndex
        if (prevIndex === currentIndex) {
          newList = []
        } else if (currentIndex > prevIndex) {
          newList = list.slice(prevIndex, currentIndex + 1)
        } else {
          newList = list.slice(currentIndex, prevIndex + 1)
        }
      } else {
        newList = [item]
      }
      prevSelectIndexRef.current = pressIndex
    }
    
    selectedListRef.current = newList
    setSelectedList(newList)
    
    // 更新全选状态
    const isAllSelected = newList.length > 0 && newList.length === list.length
    multipleModeBarRef.current?.setIsSelectAll(isAllSelected)
  }, [selectMode, list])

  const handleBatchClean = useCallback(() => {
    if (selectedListRef.current.length > 0) {
      onBatchClean(selectedListRef.current)
      handleExitMultiSelectMode()
    }
  }, [])

  const handleRemoveCompleted = useCallback(() => {
    // 筛选已完成的任务
    const completedItems = selectedListRef.current.filter(item => item.status === 'completed')
    if (completedItems.length > 0) {
      onRemoveCompleted(completedItems)
      handleExitMultiSelectMode()
    }
  }, [])

  if (list.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text color={theme['c-300']} size={14}>{t('download_empty')}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={list}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        windowSize={21}
        contentContainerStyle={isMultiSelectMode ? { paddingBottom: MULTI_SELECT_BAR_HEIGHT } : undefined}
      />
      <MultipleModeBar
        ref={multipleModeBarRef}
        onSwitchMode={handleSwitchSelectMode}
        onSelectAll={handleSelectAll}
        onClean={handleBatchClean}
        onRemoveCompleted={handleRemoveCompleted}
        onExitSelectMode={handleExitMultiSelectMode}
      />
    </View>
  )
}

