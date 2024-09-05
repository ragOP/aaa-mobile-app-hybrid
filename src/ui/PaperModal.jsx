import React from 'react'
import { Modal } from 'react-native-paper';

const PaperModal = ({ children, style, visible, setVisible }) => {
  return (
    <Modal
      visible={visible}
      onDismiss={() => setVisible(false)}
      contentContainerStyle={style}
    >
      {children}
    </Modal>
  );
};

export default PaperModal;