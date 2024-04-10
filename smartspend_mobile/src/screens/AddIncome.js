import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { styles } from "../styles/Form";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const AddIncome = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [type, setType] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Expected", value: 1 },
    { label: "Not Expected", value: 2 },
  ]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const handleAdd = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.post(
        `${"https://smart-spend.online"}/api/users/incomes/add`,
        {
          name: name,
          income: income,
          type_id: type,
          date: date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigation.navigate("Incomes", {
        result: response.data.message,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.inputButton, { marginBottom: 10 }]}
          onPress={showDatepicker}
        >
          <Text style={styles.inputButtonText}>Date Picker</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={date.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Income Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Income"
          value={income}
          onChangeText={(text) => setIncome(text)}
        />
        <DropDownPicker
          open={open}
          value={type}
          items={items}
          setOpen={setOpen}
          setValue={setType}
          setItems={setItems}
        />
        <TouchableOpacity
          style={[styles.inputButton, { marginTop: 10 }]}
          onPress={handleAdd}
        >
          <Text style={styles.inputButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AddIncome;
