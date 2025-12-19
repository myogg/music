import { useEffect, useRef } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native'
import { Modal as RNModal } from 'react-native'
import { useStatusbarHeight } from '@/store/common/hook'

interface Props {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}

export default ({ visible, onClose, children }: Props) => {
  const statusBarHeight = useStatusbarHeight()

  return (
    <RNModal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { paddingTop: statusBarHeight }]}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.contentWrapper}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    maxWidth: '90%',
    maxHeight: '80%',
  },
})
