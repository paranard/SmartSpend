import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  RefreshControl,
} from "react-native";
import Box from "../components/Box";
import { styles } from "../styles/Box";
import { BarChart } from "react-native-chart-kit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function Monthly({ navigation }) {
  const [graphExpenses, setGraphExpenses] = useState([]);
  const [graphExpense, setGraphExpense] = useState([0]);

  const [currentMonth, setCurrentMonth] = useState("");
  const [monthlyCashflow, setMonthlyCashflow] = useState("");
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpense, setTotalExpense] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    role_id: null,
    image: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    age: 0,
    work: "",
    created_at: null,
    updated_at: null,
  });

  const data = {
    labels: ["Income", "Expense", ""],
    datasets: [
      {
        data: [totalIncome, totalExpense, 0],
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
        strokeWidth: 1,
      },
    ],
  };

  useEffect(() => {
    fetchData();
    getUserData();
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(
        `${"https://smart-spend.online"}/api/users/monthly`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGraphExpense(response.data.graphExpenses.map((item) => item.expense));
      setGraphExpenses(response.data.graphExpenses);
      setTotalIncome(response.data.total_income);
      setTotalExpense(response.data.total_expense);
      setMonthlyCashflow(response.data.monthly_cashflow);
      setCurrentMonth(response.data.currentMonth);
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  const getUserData = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
    >
      <Box
        container={styles.container}
        title={styles.title}
        description={styles.description}
        titleLabel="Monthly Budget"
        descriptionLabel="Create a budget to sharpen your spending and amplifying your savings"
        navigation={navigation}
        buttonContainer={styles.buttonContainer}
        buttonText={styles.buttonText}
        buttonTextLabel={"Create a Budget"}
        buttonNavigation={"Create Budget"}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Monthly Cash flow ({currentMonth})</Text>
        <Text style={styles.description}>
          {" "}
          ₱ <Text style={{ color: "green" }}>{totalIncome}</Text> (Income)
        </Text>
        <Text style={styles.description}>
          -₱ <Text style={{ color: "red" }}>{totalExpense}</Text> (Expense)
        </Text>
        <Text
          style={[
            styles.description,
            { borderTopWidth: 2, borderTopColor: "grey" },
          ]}
        >
          {" "}
          ₱ {monthlyCashflow}
        </Text>
      </View>
      <View style={styless.container}>
        <BarChart
          data={data}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="₱"
          chartConfig={{
            backgroundColor: "#e2e2e2",
            backgroundGradientFrom: "#e2e2e2",
            backgroundGradientTo: "#e2e2e2",
            decimalPlaces: 2,
            color: (opacity = 1) => `#000`,
            labelColor: (opacity = 1) => `black`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 10,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styless = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
  },
});
