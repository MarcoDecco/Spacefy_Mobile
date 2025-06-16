import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { styles } from '../styles/spaceRegisterStyles/etapa7Styles';
import { colors } from '../styles/globalStyles/colors';
import { VisualizadorDocumento } from './VisualizadorDocumento';

interface CampoDocumentoProps {
  titulo: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  name: string;
}

export const CampoDocumento: React.FC<CampoDocumentoProps> = ({ titulo, value, onChange, name }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadToCloudinary = async (fileUri: string) => {
    try {
      const { cloudinaryApiUrl, cloudinaryCloudName } = Constants.expoConfig?.extra || {};
      const uploadPreset = "spacefy_mobile"; // Novo preset específico para o app

      // Debug das variáveis de ambiente
      console.log('Debug das variáveis de ambiente:');
      console.log('API_URL:', cloudinaryApiUrl);
      console.log('CLOUD_NAME:', cloudinaryCloudName);
      console.log('UPLOAD_PRESET:', uploadPreset);

      const formData = new FormData();

      // Prepara o arquivo para upload
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      console.log('Informações do arquivo:', fileInfo);
      
      const fileType = fileInfo.uri.split('.').pop()?.toLowerCase();
      let mimeType;
      
      // Determina o tipo MIME correto baseado na extensão
      switch (fileType) {
        case 'pdf':
          mimeType = 'application/pdf';
          break;
        case 'png':
          mimeType = 'image/png';
          break;
        case 'jpg':
        case 'jpeg':
          mimeType = 'image/jpeg';
          break;
        default:
          mimeType = 'application/octet-stream';
      }

      const fileToUpload = {
        uri: fileUri,
        type: mimeType,
        name: `document.${fileType}`
      };
      console.log('Arquivo preparado para upload:', fileToUpload);

      formData.append('file', fileToUpload as any);
      formData.append('upload_preset', uploadPreset);
      formData.append('resource_type', 'auto');
      formData.append('folder', 'spacefy_documents');

      const uploadUrl = `${cloudinaryApiUrl}/${cloudinaryCloudName}/upload`;
      console.log('URL completa de upload:', uploadUrl);
      console.log('FormData completo:', formData);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro detalhado:', errorData);
        throw new Error(errorData.error?.message || 'Erro ao fazer upload do documento');
      }

      const data = await response.json();
      console.log('Upload concluído:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      const uri = (result as any).uri || (result as any).assets?.[0]?.uri;
      if (uri) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

        if (fileInfo.exists && fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
          setError('O arquivo excede o limite de 10MB. Por favor, reduza o tamanho do arquivo.');
          return;
        }

        setIsUploading(true);
        setError('');

        try {
          const url = await uploadToCloudinary(uri);
          onChange({ target: { name, value: url } });
        } catch (error) {
          console.error('Erro detalhado:', error);
          setError('Erro ao fazer upload do documento. Tente novamente.');
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      setError('Erro ao selecionar documento. Tente novamente.');
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = () => {
    onChange({ target: { name, value: '' } });
  };

  return (
    <View style={styles.documentContainer}>
      <Text style={styles.documentTitle}>{titulo}</Text>
      <View style={styles.documentButtons}>
        <TouchableOpacity
          style={[styles.selectButton, isUploading && styles.disabled]}
          onPress={handleFilePick}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.selectButtonText}>Selecionar Arquivo</Text>
          )}
        </TouchableOpacity>
        {value && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemoveDocument}
          >
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      {value && <VisualizadorDocumento url={value} />}
    </View>
  );
}; 