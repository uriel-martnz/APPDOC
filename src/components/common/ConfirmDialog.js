import React from 'react';
import { Portal, Dialog, Button, Text } from 'react-native-paper';

export default function ConfirmDialog({
  visible,
  title,
  message,
  onConfirm,
  onDismiss,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor,
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>{cancelText}</Button>
          <Button
            onPress={onConfirm}
            textColor={confirmColor}
          >
            {confirmText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
