import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Linking } from 'react-native';
import { styles } from '../styles/spaceRegisterStyles/etapa7Styles';
import { colors } from '../styles/globalStyles/colors';

interface VisualizadorDocumentoProps {
  url: string;
}

export const VisualizadorDocumento: React.FC<VisualizadorDocumentoProps> = ({ url }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!url) return null;

  const fileType = url.split('.').pop()?.toLowerCase();
  const isPDF = fileType === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png'].includes(fileType || '');

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenInBrowser = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir documento:', error);
    }
  };

  return (
    <View style={styles.documentPreview}>
      <TouchableOpacity
        style={styles.previewButton}
        onPress={handleOpen}
      >
        <Text style={styles.previewText}>Visualizar Documento</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
            >
              <Text style={{ color: colors.white }}>X</Text>
            </TouchableOpacity>

            {isPDF ? (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={handleOpenInBrowser}
                >
                  <Text style={styles.previewText}>Abrir PDF em nova aba</Text>
                </TouchableOpacity>
              </View>
            ) : isImage ? (
              <Image
                source={{ uri: url }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ) : (
              <TouchableOpacity
                style={styles.previewButton}
                onPress={handleOpenInBrowser}
              >
                <Text style={styles.previewText}>Abrir documento em nova aba</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}; 