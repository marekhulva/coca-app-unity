import React, { useState } from 'react'
import {
  TouchableOpacity,
  Text,
  View,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { theme } from '../themes/theme'

interface DatePickerProps {
  value: Date
  onChange: (date: Date) => void
  label?: string
  placeholder?: string
  minimumDate?: Date
  maximumDate?: Date
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  minimumDate,
  maximumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false)
    }
    if (selectedDate) {
      onChange(selectedDate)
    }
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, !value && styles.placeholder]}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent
            animationType="slide"
            visible={showPicker}
            onRequestClose={() => setShowPicker(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowPicker(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity
                    onPress={() => setShowPicker(false)}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  style={styles.picker}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        ) : (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  
  label: {
    fontSize: theme.font.size.sm,
    fontWeight: theme.font.weight.medium,
    color: theme.color.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  button: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border.default,
    backgroundColor: theme.color.background.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 48,
    justifyContent: 'center',
  },
  
  buttonText: {
    fontSize: theme.font.size.md,
    color: theme.color.text.primary,
  },
  
  placeholder: {
    color: theme.color.text.placeholder,
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  modalContent: {
    backgroundColor: theme.color.background.primary,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingBottom: theme.spacing.xl,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border.light,
  },
  
  modalButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  
  modalButtonText: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.semibold,
    color: theme.color.primary,
  },
  
  picker: {
    height: 200,
  },
})