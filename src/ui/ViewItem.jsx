import { View } from "react-native";

const ViewItem = ({ children, styling }) => {
  return <View style={styling}>{children}</View>;
};

export default ViewItem;
