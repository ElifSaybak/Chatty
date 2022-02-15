import { useRoute } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { firesore, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = () => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUid(user?.uid);
      setName(user?.displayName);
    });
  }, []);

  useEffect(() => {
    async function test() {
      try
      {
        const snapshot = 
        await doc(firesore, "chats/"+route.params.chatId)
        onSnapshot(snapshot,(snap)=> {
          //console.log(snap.data().messages);
          setMessages(snap.data()?.messages ?? []);
        })


      }
      catch(e)
      {
        console.warn("read Doc error: ", e.messages);
      }

    }
    test();
  }, [route.params.chatId]);


  const onSend = async(m = []) => {
    try
    {
      const snapshot = 
          await doc(firesore, "chats/"+route.params.chatId);
      setDoc(snapshot,{
        messages: GiftedChat.append(messages, m)
      },
      { merge: true }
      )
    }
    catch(e)
    {
      console.warn("Chat.js onSend func: ", e.messages)
    }
  };

  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GiftedChat
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
    </View>
  );
};
export default Chat;
