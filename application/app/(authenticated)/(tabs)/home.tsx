import { Text, View, ScrollView, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";

import Dropdown from "@/components/dropdown";
import RoundBtn from "@/components/button";
import WidgetList from "@/components/sortable-list/widget-list";

import { useBalanceStore } from "@/stores/balance-store";

import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

export default function Home() {
    const { balance, runTransaction, transactions, clearTransactions } =
        useBalanceStore();
    const headerHeight = useHeaderHeight();

    const onAddMoney = () => {
        runTransaction({
            id: Math.random().toString(),
            amount:
                Math.floor(Math.random() * 1000) *
                (Math.random() > 0.5 ? 1 : -1),
            date: new Date(),
            title: "Added money",
        });
    };

    return (
        <ScrollView
            style={{ backgroundColor: Colors.background }}
            contentContainerStyle={{
                paddingTop: headerHeight,
            }}
        >
            <View
                style={{
                    margin: 80,
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        gap: 10,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 50,
                            fontWeight: "bold",
                        }}
                    >
                        {balance()}
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "500",
                        }}
                    >
                        €
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        defaultStyles.pillButtonSmall,
                        {
                            backgroundColor: Colors.lightGray,
                            marginVertical: 20,
                        },
                    ]}
                >
                    <Text
                        style={[
                            defaultStyles.buttonTextSmall,
                            { color: Colors.dark },
                        ]}
                    >
                        Accounts
                    </Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 20,
                }}
            >
                <RoundBtn
                    icon={"add"}
                    text={"Add money"}
                    onPress={onAddMoney}
                />
                <RoundBtn
                    icon={"refresh"}
                    text={"Exchange"}
                    onPress={clearTransactions}
                />
                <RoundBtn icon={"list"} text={"Details"} />
                <Dropdown />
            </View>

            <Text style={defaultStyles.sectionHeader}>Transactions</Text>
            <View
                style={{
                    marginHorizontal: 20,
                    padding: 14,
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    gap: 20,
                }}
            >
                {transactions.length === 0 && (
                    <Text style={{ padding: 14, color: Colors.gray }}>
                        No transactions yet
                    </Text>
                )}
                {transactions.map((transaction) => (
                    <View
                        key={transaction.id}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 16,
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: Colors.lightGray,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name={transaction.amount > 0 ? "add" : "remove"}
                                size={24}
                                color={Colors.dark}
                            />
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: "400" }}>
                                {transaction.title}
                            </Text>
                            <Text style={{ color: Colors.gray, fontSize: 12 }}>
                                {transaction.date.toLocaleString()}
                            </Text>
                        </View>
                        <Text>{transaction.amount}€</Text>
                    </View>
                ))}
            </View>
            <Text style={defaultStyles.sectionHeader}>Widgets</Text>
            <WidgetList />
        </ScrollView>
    );
}
