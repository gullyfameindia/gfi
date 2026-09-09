import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    Dimensions,
    ScrollView,
    TextInput,
    Modal,
    Image,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { CloseIcon } from "@/icons";
const { width, height } = Dimensions.get("window");

const hashtags = [
    "#dance",
    "#music",
    "#funny",
    "#gfi",
    "#viral",
    "#trending",
    "#fyp",
];
const categories = ["Dance", "Music", "Comedy", "Cooking", "Acting"];

export default function UploadPostScreen() {
    const params = useLocalSearchParams();
    const [clips, setClips] = useState<any[]>([]);
    const [caption, setCaption] = useState("");
    const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showCoverModal, setShowCoverModal] = useState(false);
    const [allowComments, setAllowComments] = useState(true);
    const [saveToGallery, setSaveToGallery] = useState(false);

    
    const competitionId = params.competitionId
        ? String(params.competitionId)
        : null;
    const competitionName = params.competitionName
        ? String(params.competitionName)
        : null;
    const entryFee = params.entryFee ? String(params.entryFee) : null;

    useEffect(() => {
        if (params.clips) {
            try {
                const parsedClips = JSON.parse(params.clips as string);
                setClips(parsedClips);
            } catch (e) {
                console.error("Error parsing clips:", e);
            }
        }
    }, [params.clips]);

    const toggleHashtag = (tag: string) => {
        if (selectedHashtags.includes(tag)) {
            setSelectedHashtags(selectedHashtags.filter((t) => t !== tag));
        } else {
            setSelectedHashtags([...selectedHashtags, tag]);
        }
    };

    const handlePost = () => {
        if (!selectedCategory) {
            Alert.alert(
                "Category Required",
                "Please select a category before posting.",
            );
            return;
        }

        
        router.push({
            pathname: "/(main)/upload/post",
            params: {
                clips: JSON.stringify(clips),
                caption: caption,
                hashtags: JSON.stringify(selectedHashtags),
                category: selectedCategory,
                allowComments: allowComments.toString(),
                saveToGallery: saveToGallery.toString(),
                ...(competitionId && { competitionId }),
                ...(competitionName && {
                    competitionName: encodeURIComponent(competitionName),
                }),
                ...(entryFee && { entryFee: encodeURIComponent(entryFee) }),
            },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
                {}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            try {
                                
                                
                                router.navigate("/(main)/upload");
                            } catch (error) {
                                console.error("Navigation error:", error);
                                router.replace("/(main)");
                            }
                        }}
                    >
                        <CloseIcon size={22} />
                    </TouchableOpacity>

                    <Text style={styles.title}>New Post</Text>

                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {}
                    <View style={styles.videoPreview}>
                        {clips.length > 0 && clips[0].uri ? (
                            <Image
                                source={{ uri: clips[0].uri }}
                                style={styles.videoImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.placeholderVideo}>
                                <Text style={styles.placeholderText}>
                                    Video Preview
                                </Text>
                            </View>
                        )}
                    </View>

                    {}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Caption</Text>
                        <TextInput
                            style={styles.captionInput}
                            placeholder="Write a caption…"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={caption}
                            onChangeText={setCaption}
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>
                            {caption.length}/500
                        </Text>
                    </View>

                    {}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Cover Thumbnail</Text>
                        <View style={styles.coverSelector}>
                            {clips.length > 0 && clips[0].uri ? (
                                <Image
                                    source={{ uri: clips[0].uri }}
                                    style={styles.coverThumbnail}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.coverPlaceholder} />
                            )}
                            <TouchableOpacity
                                style={styles.selectCoverButton}
                                onPress={() => setShowCoverModal(true)}
                            >
                                <Text style={styles.selectCoverText}>
                                    Select Cover
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Hashtags</Text>
                        <View style={styles.hashtagContainer}>
                            {hashtags.map((tag) => (
                                <TouchableOpacity
                                    key={tag}
                                    style={[
                                        styles.hashtag,
                                        selectedHashtags.includes(tag) &&
                                            styles.hashtagSelected,
                                    ]}
                                    onPress={() => toggleHashtag(tag)}
                                >
                                    <Text
                                        style={[
                                            styles.hashtagText,
                                            selectedHashtags.includes(tag) &&
                                                styles.hashtagTextSelected,
                                        ]}
                                    >
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Category</Text>
                        <TouchableOpacity
                            style={styles.categoryButton}
                            onPress={() =>
                                setShowCategoryDropdown(!showCategoryDropdown)
                            }
                        >
                            <Text
                                style={[
                                    styles.categoryButtonText,
                                    !selectedCategory &&
                                        styles.categoryPlaceholder,
                                ]}
                            >
                                {selectedCategory || "Select Category"}
                            </Text>
                            <Text style={styles.categoryArrow}>
                                {showCategoryDropdown ? "▲" : "▼"}
                            </Text>
                        </TouchableOpacity>

                        {showCategoryDropdown && (
                            <View style={styles.categoryDropdown}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryOption,
                                            selectedCategory === category &&
                                                styles.categoryOptionSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedCategory(category);
                                            setShowCategoryDropdown(false);
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryOptionText,
                                                selectedCategory === category &&
                                                    styles.categoryOptionTextSelected,
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {}
                    <View style={styles.section}>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>
                                Allow Comments
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.switch,
                                    allowComments && styles.switchActive,
                                ]}
                                onPress={() => setAllowComments(!allowComments)}
                            >
                                <View
                                    style={[
                                        styles.switchThumb,
                                        allowComments &&
                                            styles.switchThumbActive,
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>
                                Save to Gallery
                            </Text>
                            <TouchableOpacity
                                style={[
                                    styles.switch,
                                    saveToGallery && styles.switchActive,
                                ]}
                                onPress={() => setSaveToGallery(!saveToGallery)}
                            >
                                <View
                                    style={[
                                        styles.switchThumb,
                                        saveToGallery &&
                                            styles.switchThumbActive,
                                    ]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {}
                <View style={styles.postButtonContainer}>
                    <TouchableOpacity
                        style={styles.postButton}
                        onPress={handlePost}
                    >
                        <Text style={styles.postButtonText}>POST VIDEO</Text>
                    </TouchableOpacity>
                </View>

                {}
                <Modal
                    visible={showCoverModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowCoverModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Cover</Text>
                            <Text style={styles.modalSubtitle}>
                                Prototype only - Timeline picker coming soon
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.coverTimeline}
                            >
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.coverOption}
                                    >
                                        {clips.length > 0 && clips[0].uri ? (
                                            <Image
                                                source={{ uri: clips[0].uri }}
                                                style={styles.coverOptionImage}
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View
                                                style={
                                                    styles.coverOptionPlaceholder
                                                }
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowCoverModal(false)}
                            >
                                <Text style={styles.modalCloseText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    safeArea: {
        flex: 1,
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: Platform.OS === "ios" ? 12 : 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    videoPreview: {
        width: "100%",
        height: height * 0.35,
        backgroundColor: "#1a1a1a",
    },
    videoImage: {
        width: "100%",
        height: "100%",
    },
    placeholderVideo: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#fff",
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === "ios" ? 20 : 18,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    captionInput: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 15,
        minHeight: 100,
        maxHeight: 200,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    charCount: {
        color: "rgba(255, 255, 255, 0.5)",
        fontSize: 12,
        marginTop: 8,
        textAlign: "right",
    },
    coverSelector: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    coverThumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    coverPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    selectCoverButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    selectCoverText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    hashtagContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    hashtag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    hashtagSelected: {
        backgroundColor: "#EC9A15",
        borderColor: "#EC9A15",
    },
    hashtagText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    hashtagTextSelected: {
        fontWeight: "700",
    },
    categoryButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    categoryButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
    },
    categoryPlaceholder: {
        color: "rgba(255, 255, 255, 0.5)",
    },
    categoryArrow: {
        color: "#fff",
        fontSize: 12,
    },
    categoryDropdown: {
        marginTop: 8,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    categoryOption: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    categoryOptionSelected: {
        backgroundColor: "rgba(236, 154, 21, 0.2)",
    },
    categoryOptionText: {
        color: "#fff",
        fontSize: 15,
    },
    categoryOptionTextSelected: {
        color: "#EC9A15",
        fontWeight: "600",
    },
    postButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === "ios" ? 32 : 20,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    postButton: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: "#EC9A15",
        alignItems: "center",
        justifyContent: "center",
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    switchLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    switch: {
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        paddingHorizontal: 2,
    },
    switchActive: {
        backgroundColor: "#EC9A15",
    },
    switchThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#fff",
    },
    switchThumbActive: {
        transform: [{ translateX: 20 }],
    },
    postButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#1a1a1a",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === "ios" ? 32 : 20,
        maxHeight: height * 0.5,
    },
    modalTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
    },
    modalSubtitle: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
        marginBottom: 20,
    },
    modalCloseButton: {
        marginTop: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "#EC9A15",
        alignItems: "center",
    },
    modalCloseText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    coverTimeline: {
        marginVertical: 20,
    },
    coverOption: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "transparent",
    },
    coverOptionImage: {
        width: "100%",
        height: "100%",
    },
    coverOptionPlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
});
