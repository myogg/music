import { useState, useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Animated, View, TouchableOpacity, ScrollView } from 'react-native'

import Text from '@/components/common/Text'
import { useTheme } from '@/store/theme/hook'
import { createStyle } from '@/utils/tools'
import { BorderWidths } from '@/theme'
import { scaleSizeH } from '@/utils/pixelRatio'

export type SelectMode = 'single' | 'range'

export const MULTI_SELECT_BAR_HEIGHT = scaleSizeH(40)

export interface MultipleModeBarProps {
  onSwitchMode: (mode: SelectMode) => void
  onSelectAll: (isAll: boolean) => void
  onClean: () => void
  onRemoveCompleted: () => void
  onExitSelectMode: () => void
}
export interface MultipleModeBarType {
  show: () => void
  setIsSelectAll: (isAll: boolean) => void
  setSwitchMode: (mode: SelectMode) => void
  exitSelectMode: () => void
}

export default forwardRef<MultipleModeBarType, MultipleModeBarProps>(({ onSelectAll, onSwitchMode, onClean, onRemoveCompleted, onExitSelectMode }, ref) => {
  const [visible, setVisible] = useState(false)
  const [animatePlayed, setAnimatPlayed] = useState(true)
  const animFade = useRef(new Animated.Value(0)).current
  const animTranslateY = useRef(new Animated.Value(0)).current
  const [selectMode, setSelectMode] = useState<SelectMode>('single')
  const [isSelectAll, setIsSelectAll] = useState(false)
  const theme = useTheme()

  useImperativeHandle(ref, () => ({
    show() {
      handleShow()
    },
    setIsSelectAll(isAll) {
      setIsSelectAll(isAll)
    },
    setSwitchMode(mode: SelectMode) {
      setSelectMode(mode)
    },
    exitSelectMode() {
      handleHide()
    },
  }))

  const handleShow = useCallback(() => {
    setVisible(true)
    setAnimatPlayed(false)
    requestAnimationFrame(() => {
      animTranslateY.setValue(20)

      Animated.parallel([
        Animated.timing(animFade, {
          toValue: 0.92,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setAnimatPlayed(true)
      })
    })
  }, [animFade, animTranslateY])

  const handleHide = useCallback(() => {
    setAnimatPlayed(false)
    Animated.parallel([
      Animated.timing(animFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animTranslateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(finished => {
      if (!finished) return
      setVisible(false)
      setAnimatPlayed(true)
    })
  }, [animFade, animTranslateY])


  const animaStyle = useMemo(() => ({
    ...styles.container,
    height: MULTI_SELECT_BAR_HEIGHT,
    backgroundColor: theme['c-primary-light-200-alpha-900'],
    borderBottomColor: theme['c-border-background'],
    opacity: animFade,
    transform: [
      { translateY: animTranslateY },
    ],
  }), [animFade, animTranslateY, theme])

  const handleSelectAll = useCallback(() => {
    const selectAll = !isSelectAll
    setIsSelectAll(selectAll)
    onSelectAll(selectAll)
  }, [isSelectAll, onSelectAll])

  const component = useMemo(() => {
    return (
      <Animated.View style={animaStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity
            onPress={() => { onSwitchMode('single') }}
            style={{ ...styles.btn, backgroundColor: selectMode == 'single' ? theme['c-primary-alpha-600'] : 'rgba(0,0,0,0)' }}
          >
            <Text size={12} color={theme['c-font']} style={{ fontWeight: selectMode == 'single' ? 'bold' : 'normal' }}>{global.i18n.t('list_select_single')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { onSwitchMode('range') }}
            style={{ ...styles.btn, backgroundColor: selectMode == 'range' ? theme['c-primary-alpha-600'] : 'rgba(0,0,0,0)' }}
          >
            <Text size={12} color={theme['c-font']} style={{ fontWeight: selectMode == 'range' ? 'bold' : 'normal' }}>{global.i18n.t('list_select_range')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectAll} style={styles.btn}>
            <Text size={12} color={theme['c-font']} style={{ fontWeight: 'bold' }}>{global.i18n.t(isSelectAll ? 'list_select_unall' : 'list_select_all')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClean} style={styles.btn}>
            <Text size={12} color={theme['c-font']} style={{ fontWeight: 'bold' }}>{global.i18n.t('download_clean_selected')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemoveCompleted} style={styles.btn}>
            <Text size={12} color={theme['c-font']} style={{ fontWeight: 'bold' }}>{global.i18n.t('download_remove_completed')}</Text>
          </TouchableOpacity>
        </ScrollView>
        <TouchableOpacity onPress={onExitSelectMode} style={styles.cancelBtn}>
          <Text size={12} color={theme['c-font']} style={{ fontWeight: 'bold' }}>{global.i18n.t('list_select_cancel')}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }, [animaStyle, selectMode, theme, handleSelectAll, isSelectAll, onClean, onRemoveCompleted, onExitSelectMode, onSwitchMode])

  return !visible && animatePlayed ? null : component
})

const styles = createStyle({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: BorderWidths.normal,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
