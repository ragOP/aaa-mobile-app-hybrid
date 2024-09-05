import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { defaultStyles } from "../utils/constants";

const DropDown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "All", value: "All" },
    { label: "Brands", value: "Brands" },
    { label: "Boutiques", value: "Boutiques" },
  ]);
  return (
    <DropDownPicker
      placeholder="Find"
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      containerStyle={{width: "30%"}}
      style={{ width: "100%", borderWidth: 0.5 }}
      listParentContainerStyle={{ width: "100%" }}
      dropDownContainerStyle={{ width: "100%" }}
    />
  );
};

export default DropDown;
