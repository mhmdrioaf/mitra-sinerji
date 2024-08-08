import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface IPageTitleProps {
  title: string;
}

export default function PageTitle({ title }: IPageTitleProps) {
  const theme = useTheme();
  return (
    <View>
      <Text
        variant="headlineMedium"
        style={{
          fontWeight: "bold",
          color: theme.colors.primary,
        }}
      >
        {title}
      </Text>
    </View>
  );
}
