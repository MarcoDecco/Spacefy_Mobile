import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { buttons } from '~/styles/globalStyles/buttonStyles';

// Tipo para as propriedades de navegação
type NavigationProps = {
    navigate: (screen: string) => void;
};

// Interface que define as propriedades que o botão pode receber
interface ButtonProps {
    text: string; // Texto que será exibido no botão
    onPress?: () => void; // Função opcional para ação do botão
    navigateTo?: string; // Nome da tela para navegação
    color?: 'blue' | 'white'; // Variante do botão (azul ou branco)
}

// Componente de botão que pode ser azul ou branco
export default function Button({ text, onPress, navigateTo, color = 'blue' }: ButtonProps) {
    // Hook para usar a navegação
    const navigation = useNavigation<NavigationProps>();
    
    // Função que gerencia o evento de pressionar o botão
    const handlePress = () => {
        // Se tiver uma função onPress, executa ela
        if (onPress) {
            onPress();
        } 
        // Se não tiver onPress mas tiver navigateTo, navega para a tela especificada
        else if (navigateTo) {
            navigation.navigate(navigateTo);
        }
    };
    
    // Define os estilos baseado na variante
    const buttonStyle = color === 'blue' ? buttons.blueButton : buttons.whiteButton;
    const textStyle = color === 'blue' ? buttons.textBlueButton : buttons.textWhiteButton;
    
    // Renderiza o botão com os estilos combinados
    return (
        <TouchableOpacity 
            onPress={handlePress}
            style={buttonStyle}
        >
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
} 