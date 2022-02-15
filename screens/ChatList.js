import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import {
  Avatar,
  Divider,
  List,
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
} from "react-native-paper";
import { firesore, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";

const ChatList = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? "");
    });
  }); 

  const createChat = async () => {
    if (!email || !userEmail) return;
    setIsLoading(true);
    try {
      const response = addDoc(collection(firesore, "chats"), {
        users: [email, userEmail],
      });
      console.log("Document written with ID: ", response.id);
      setIsLoading(false);
      setIsDialogVisible(false);
      navigation.navigate("Chat", {chatId: response.id});
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function test() {
      const querySnapshot = await getDocs(
        query(
          collection(firesore, "chats"),
          where("users", "array-contains", email)
        )
      );
      querySnapshot.forEach((doc) => {
        setChats(querySnapshot.docs);
      });
    }

    test();
  }, [email]);


  return (
    <View style={{ flex: 1 }}>
      {chats.map((chat) => (
        <React.Fragment>
          <List.Item
            title={chat.data().users.find((x) => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? undefined}
            left={() => (
              <Avatar.Text
                label={chat
                  .data()
                  .users.find((x) => x !== email)
                  .split(" ")
                  .reduce((prev, current) => prev + current[0], "")}
                size={56}
              />
            )}
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
          />
          <Divider inset />
        </React.Fragment>
      ))}

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              value={userEmail}
              onChangeText={(text) => setUserEmail(text)}
            ></TextInput>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={() => createChat()} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={{ position: "absolute", bottom: 16, right: 16 }}
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
};

export default ChatList;
