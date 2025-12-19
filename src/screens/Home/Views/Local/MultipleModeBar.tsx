import { forwardRef, useImperativeHandle, useState, useCallback, memo } from 'react'
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { useI18n } from '@/lang'
import Text from '@/components/common/Text'
import { Icon } from '@/components/common/Icon'

export type SelectMode = 'single' | 'range'

export interface MultipleModeBarType {
  show: () => void
  hide: () => void
  exitSelectMode: () => void
  setVisibleBar: (visible: boolean) => void
  setSwitchMode: (mode: SelectMode) => void
  setIsSelectAll: (isAll: boolean) => void
}

interface Props {
  onSwitchMode: (mode: SelectMode) => void
  onSelectAll: (isAll: boolean) => void
  onExitSelectMode: () => void
  onAddToList: () => void
  onRemove: () => void
  onDeleteFile: () => void
}

export default memo(forwardRef<MultipleModeBarType, Props>(({ onSwitchMode, onSelectAll, onExitSelectMode, onAddToList, onRemove, onDeleteFile }, ref) => {
  const theme = useTheme()
  const t = useI18n()
  const [visible, setVisible] = useState(false)
  const [barVisible, setBarVisible] = useState(true)
  const [selectMode, setSelectMode] = useState<SelectMode>('single')
  const [isSelectAll, setIsSelectAll] = useState(false)

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
      setBarVisible(true)
    },
    hide: () => {
      setVisible(false)
    },
    exitSelectMode: () => {
      setVisible(false)
      setSelectMode('single')
      setIsSelectAll(false)
    },
    setVisibleBar: (v: boolean) => {
      setBarVisible(v)
    },
    setSwitchMode: (mode: SelectMode) => {
      setSelectMode(mode)
    },
    setIsSelectAll: (isAll: boolean) => {
      setIsSelectAll(isAll)
    },
  }))

  const handleSwitchMode = useCallback(() => {
    const newMode = selectMode === 'single' ? 'range' : 'single'
    setSelectMode(newMode)
    onSwitchMode(newMode)
  }, [selectMode, onSwitchMode])

  const handleSelectAll = useCallback(() => {
    const newIsAll = !isSelectAll
    setIsSelectAll(newIsAll)
    onSelectAll(newIsAll)
  }, [isSelectAll, onSelectAll])

  const handleExit = useCallback(() => {
    onExitSelectMode()
  }, [onExitSelectMode])

  if (!visible || !barVisible) return null

  return (
    <View style={[styles.container, { backgroundColor: theme['c-primary-background'] }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity style={styles.button} onPress={handleSwitchMode}>
          <Text size={12} color={theme['c-primary-font']}>
            {selectMode === 'single' ? t('list_select_single') : t('list_select_range')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSelectAll}>
          <Text size={12} color={theme['c-primary-font']}>
            {isSelectAll ? t('list_select_unall') : t('list_select_all')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onAddToList}>
          <Icon name="add-music" size={14} color={theme['c-primary-font']} />
          <Text size={12} color={theme['c-primary-font']} style={styles.buttonText}>
            {t('add_to')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onRemove}>
          <Icon name="remove" size={14} color={theme['c-primary-font']} />
          <Text size={12} color={theme['c-primary-font']} style={styles.buttonText}>
            {t('local_remove_music')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onDeleteFile}>
          <Icon name="remove" size={14} color={theme['c-primary-font']} />
          <Text size={12} color={theme['c-primary-font']} style={styles.buttonText}>
            {t('local_delete_file')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={handleExit}>
        <Icon name="close" size={18} color={theme['c-primary-font']} />
      </TouchableOpacity>
    </View>
  )
}))

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 10,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  buttonText: {
    marginLeft: 3,
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
})
