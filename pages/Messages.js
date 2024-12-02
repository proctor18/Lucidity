import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../supabaseClient';

export default function Messages() {
    const [content, setContent] = useState('');
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newReceiverEmail, setNewReceiverEmail] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const route = useRoute(); // Access the route object
    const { user_id: currentUserId } = route.params || {};


    if (!currentUserId) {
        console.error("User ID is undefined");
        return (
            <View style={styles.container}>
                <Text>User ID not found. Please log in again.</Text>
            </View>
        );
    }

    // Fetch user name by ID
    const fetchUserName = async (id) => {
        console.log(`Fetching user name for ID: ${id}`);

        try {
            // Attempt to fetch from tutors first
            let { data: userData, error: userError } = await supabase
                .from('tutors')
                .select('first_name, last_name')
                .eq('tutor_id', id)
                .single();

            if (userError || !userData) {
                // If not found, try the students table
                ({ data: userData, error: userError } = await supabase
                    .from('students')
                    .select('first_name, last_name')
                    .eq('student_id', id)
                    .single());
            }

            if (userError || !userData) {
                console.error(`User not found for ID ${id}:`, userError?.message || "Unknown error");
                return { id, name: "Unknown" };
            }

            const fullName = `${userData.first_name} ${userData.last_name}`;
            console.log(`Name found for ID ${id}: ${fullName}`);
            return { id, name: fullName };
        } catch (error) {
            console.error(`Error fetching user name for ID ${id}:`, error.message);
            return { id, name: "Unknown" };
        }
    };

    // Load conversations and user names
    useEffect(() => {
        const loadConversations = async () => {
            try {
                let { data, error } = await supabase
                    .from('messages')
                    .select('sender_id, receiver_id, content')
                    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
                    .neq('content', '')  // Filter out messages with empty content
                    .order('sent_at', { ascending: false });

                if (error) {
                    console.error("Error fetching conversations:", error.message);
                    return;
                }

                // Extract unique conversation partners
                const uniqueConversations = Array.from(
                    new Set(
                        data.map(({ sender_id, receiver_id }) =>
                            sender_id === currentUserId ? receiver_id : sender_id
                        )
                    )
                );

                console.log("Unique Conversation Partner IDs with messages:", uniqueConversations);

                // Fetch user names for each unique conversation partner
                const conversationData = await Promise.all(
                    uniqueConversations.map(async (id) => await fetchUserName(id))
                );

                // Filter out unknown users
                setConversations(conversationData.filter(conv => conv.name !== "Unknown"));
            } catch (err) {
                console.error("Error loading conversations:", err.message);
            }
        };

        loadConversations();
    }, [currentUserId]);

    // Mark messages as read when loading messages
    const markMessagesAsRead = async (chatPartnerId) => {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('receiver_id', currentUserId)
                .eq('sender_id', chatPartnerId)
                .is('is_read', false); // Update only unread messages

            if (error) {
                console.error("Error marking messages as read:", error.message);
            }
        } catch (error) {
            console.error("Error marking messages as read:", error.message);
        }
    };


    // Load messages in the selected conversation
    const loadMessages = async (chatPartnerId) => {
        let { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${chatPartnerId}),and(sender_id.eq.${chatPartnerId},receiver_id.eq.${currentUserId})`)
            .order('sent_at', { ascending: true });

        if (error) return console.error("Error loading messages:", error.message);

        setMessages(data);
        setCurrentChat(chatPartnerId);

        // Mark messages as read
        await markMessagesAsRead(chatPartnerId);
    };

    // Send a message
    const sendMessage = async () => {
        if (!content || !currentChat) return;

        const { error } = await supabase
            .from('messages')
            .insert([{ sender_id: currentUserId, receiver_id: currentChat, content, is_read: false, sent_at: new Date() }]); // Use new Date() for the timestamp

        if (error) {
            console.error("Error sending message:", error.message);
            return;
        }

        setContent('');
        loadMessages(currentChat);
    };

    // Add a new conversation by receiver's email
    const addConversation = async () => {
        if (!newReceiverEmail) return;

        try {
            let { data, error } = await supabase
                .from('tutors')
                .select('tutor_id, first_name, last_name')
                .ilike('email', newReceiverEmail);

            let receiverId = data?.[0]?.tutor_id;
            let receiverName = data?.[0] ? `${data[0].first_name} ${data[0].last_name}` : null;

            if (!receiverId) {
                ({ data, error } = await supabase
                    .from('students')
                    .select('student_id, first_name, last_name')
                    .ilike('email', newReceiverEmail));

                if (data?.[0]) {
                    receiverId = data[0].student_id;
                    receiverName = `${data[0].first_name} ${data[0].last_name}`;
                }
            }

            if (!receiverId) {
                console.error("Receiver not found");
                Alert.alert("Error", "Receiver not found with that email.");
                return;
            }

            setModalVisible(false);
            setNewReceiverEmail('');
            loadMessages(receiverId);

            const isExistingConversation = conversations.some(conv => conv.id === receiverId);
            if (!isExistingConversation) {
                setConversations(prevConversations => [
                    ...prevConversations,
                    { id: receiverId, name: receiverName }
                ]);
            }
        } catch (error) {
            console.error("Error fetching receiver:", error.message);
            Alert.alert("Error", "An error occurred while trying to fetch the receiver.");
        }
    };

    // Delete a conversation
    const deleteConversation = async () => {
        if (!currentChat) return;

        Alert.alert(
            "Delete Conversation",
            "Are you sure you want to delete this conversation?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        const { error } = await supabase
                            .from('messages')
                            .delete()
                            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${currentChat}),and(sender_id.eq.${currentChat},receiver_id.eq.${currentUserId})`);

                        if (error) {
                            console.error("Error deleting conversation:", error.message);
                            return;
                        }

                        setCurrentChat(null);
                        setConversations(conversations.filter(conv => conv.id !== currentChat));
                    },
                    style: "destructive"
                }
            ]
        );
    };


    return (
        <View style={styles.container}>
            {!currentChat ? (
                <View>
                    <Button title="Start New Conversation" onPress={() => setModalVisible(true)} />

                    {/* Modal for Adding a New Conversation */}
                    <Modal visible={isModalVisible} transparent={true} animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Enter Receiver's Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Receiver's Email"
                                    value={newReceiverEmail}
                                    onChangeText={setNewReceiverEmail}
                                />
                                <Button title="Add" onPress={addConversation} />
                                <Button title="Cancel" onPress={() => setModalVisible(false)} color="#ff5c5c" />
                            </View>
                        </View>
                    </Modal>

                    <FlatList
                        data={conversations}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.conversationItem}
                                onPress={() => loadMessages(item.id)}
                            >
                                {/* Display the full name of the receiver */}
                                <Text style={styles.conversationText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>No conversations found.</Text>}
                    />
                </View>
            ) : (
                <View style={styles.chatContainer}>
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.message_id.toString()}
                        renderItem={({ item }) => (
                            <View style={item.sender_id === currentUserId ? styles.sentMessage : styles.receivedMessage}>
                                <Text style={styles.messageText}>
                                    {item.sender_id === currentUserId ? "" : ""}{item.content}
                                </Text>
                            </View>
                        )}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message"
                        value={content}
                        onChangeText={setContent}
                    />
                    <Button title="Send" onPress={sendMessage} />
                    <Button title="Back to Conversations" onPress={() => setCurrentChat(null)} color="#555" />
                    <Button title="Delete Conversation" onPress={deleteConversation} color="#ff5c5c" />
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 8,
    },
    conversationText: {
        fontSize: 16,
        color: '#333',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 15,
        marginBottom: 5,
        maxWidth: '70%',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#000000',
        padding: 10,
        borderRadius: 15,
        marginBottom: 5,
        maxWidth: '70%',
    },
    messageText: {
        color: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
});
