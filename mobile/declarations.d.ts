declare module '*.png' {
    const value: number; // Para React Native, imagens locais são números
    export default value;
  }
  declare module "*.jpg" {
    const value: string;
    export default value;
  }
  
  declare module "*.svg" {
    const value: string;
    export default value;
  }
  
  declare module "*.webp" {
    const value: string;
    export default value;
  }