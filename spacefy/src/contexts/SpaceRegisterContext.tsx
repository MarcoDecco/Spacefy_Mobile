import React, { createContext, useContext, useState } from 'react';

interface SpaceRegisterData {
  // Etapa 1
  space_name: string;
  space_type: string;
  max_people: string;
  space_description: string;
  
  // Etapa 2
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Etapa 3
  image_url: string[];
  
  // Etapa 4
  weekly_days: Array<{
    day: string;
    time_ranges: Array<{
      open: string;
      close: string;
    }>;
  }>;
  price_per_hour: string;
  
  // Etapa 5
  space_rules: string[];
  
  // Etapa 6
  space_amenities: string[];
  
  // Etapa 7
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  document_number: string;
  document_photo: string;
  space_document_photo: string;
  termos_aceitos: boolean;
}

interface SpaceRegisterContextData {
  formData: SpaceRegisterData;
  updateFormData: (data: Partial<SpaceRegisterData>) => void;
  resetFormData: () => void;
}

const SpaceRegisterContext = createContext<SpaceRegisterContextData>({} as SpaceRegisterContextData);

export const SpaceRegisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<SpaceRegisterData>({
    // Etapa 1
    space_name: '',
    space_type: '',
    max_people: '',
    space_description: '',
    
    // Etapa 2
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Etapa 3
    image_url: [],
    
    // Etapa 4
    weekly_days: [],
    price_per_hour: '',
    
    // Etapa 5
    space_rules: [],
    
    // Etapa 6
    space_amenities: [],
    
    // Etapa 7
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    document_number: '',
    document_photo: '',
    space_document_photo: '',
    termos_aceitos: false,
  });

  const updateFormData = (data: Partial<SpaceRegisterData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData({
      space_name: '',
      space_type: '',
      max_people: '',
      space_description: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      image_url: [],
      weekly_days: [],
      price_per_hour: '',
      space_rules: [],
      space_amenities: [],
      owner_name: '',
      owner_email: '',
      owner_phone: '',
      document_number: '',
      document_photo: '',
      space_document_photo: '',
      termos_aceitos: false,
    });
  };

  return (
    <SpaceRegisterContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </SpaceRegisterContext.Provider>
  );
};

export const useSpaceRegister = () => {
  const context = useContext(SpaceRegisterContext);
  if (!context) {
    throw new Error('useSpaceRegister must be used within a SpaceRegisterProvider');
  }
  return context;
}; 