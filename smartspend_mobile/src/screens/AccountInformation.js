import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  Platform,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { styles } from "../styles/Form";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const AccountInformation = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [salary, setSalary] = useState("");
  const [work, setWork] = useState("");
  const [imageUri, setImageUri] = useState(null);
  console.log(date);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImageUri(result.assets[0].uri);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);

        let [month, day, year] = parsedUserData.date_of_birth.split("/");
        let datee = new Date(year, month - 1, day);

        setFirstName(parsedUserData.first_name);
        setLastName(parsedUserData.last_name);
        setEmail(parsedUserData.email);
        setPhone(parsedUserData.phone);
        setAddress(parsedUserData.address);
        setDateOfBirth(parsedUserData.date_of_birth);
        setDate(datee);
        setAge(parsedUserData.age);
        setWork(parsedUserData.work);
        setSalary(parsedUserData.salary);
        // setImageUri(parsedUserData.image);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("age", age);
      formData.append("salary", salary);
      // formData.append("date_of_birth", dateOfBirth);
      formData.append(
        "date_of_birth",
        date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        })
      );
      formData.append("work", work);

      if (imageUri) {
        const uriParts = imageUri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("image", {
          uri: imageUri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const apiEndpoint = `${"https://smart-spend.online"}/api/users/edit-profile`;
      const token = await AsyncStorage.getItem("userToken");

      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.user)
      );
      navigation.navigate("Tab Navigator", { screen: "Overview" });
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.description}>Fill your personal details.</Text>
        <TouchableOpacity
          style={[styles.inputButton, { marginBottom: 10 }]}
          onPress={pickImage}
        >
          <Text style={styles.inputButtonText}>Add Image</Text>
        </TouchableOpacity>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: 200, height: 200, marginBottom: 10 }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter phone"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Enter date of birth"
          value={dateOfBirth}
          onChangeText={(text) => setDateOfBirth(text)}
        /> */}
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
          placeholder="Enter age"
          value={age}
          onChangeText={(text) => setAge(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter salary"
          value={salary}
          onChangeText={(text) => setSalary(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter work"
          value={work}
          onChangeText={(text) => setWork(text)}
        />
        <TouchableOpacity
          style={[styles.inputButton, { marginTop: 30, marginBottom: 30 }]}
          onPress={handleSubmit}
        >
          <Text style={styles.inputButtonText}>Confirm Information</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AccountInformation;
