import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./styles";
import { categoriesFullData } from "@/types/categories";
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import CategoryItem from "@/components/CategoryItem/CategoryItem";
interface CategoriesCarouselProps {
    categories: categoriesFullData[];
}
const FALLBACK_CATEGORIES: categoriesFullData[] = [
    { id: "fallback-1", name: "Comedy", icon: "comedy" },
    { id: "fallback-2", name: "Dance", icon: "dance" },
    { id: "fallback-3", name: "Music", icon: "music" },
    { id: "fallback-4", name: "Cook", icon: "cook" },
];
function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
    const [selectedCategory, setSelectedCategory] = useState<
        number | string | null
    >(0);
    const displayCategories =
        categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;
    const [activeIndex, setActiveIndex] = useState(0);
    const handleCategoryPress = (categoryId: number | string) => {
        setSelectedCategory(
            categoryId === selectedCategory ? null : categoryId,
        );
        router.push(`/(main)/category/${categoryId}`);
    };
    useEffect(() => {
        if (displayCategories.length === 0) return;
        const maxIndex = Math.min(displayCategories.length - 1, 3);
        const sequence =
            maxIndex >= 0
                ? [
                      0,
                      Math.min(1, maxIndex),
                      Math.min(2, maxIndex),
                      Math.min(3, maxIndex),
                      Math.min(3, maxIndex),
                      Math.min(2, maxIndex),
                      Math.min(1, maxIndex),
                      0,
                  ]
                : [];
        if (sequence.length === 0) return;

        let step = 0;
        const intervalId = setInterval(() => {
            step = (step + 1) % sequence.length;
            setActiveIndex(sequence[step]);
        }, 3500); // Moves every 3.5 seconds

        return () => clearInterval(intervalId);
    }, [displayCategories.length]);
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore Categories</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScroll}
                nestedScrollEnabled={true}
            >
                {displayCategories.map((category, index) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        isActive={activeIndex === index}
                        isSelected={category.id === selectedCategory}
                        onPress={() => handleCategoryPress(category.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
}
export default CategoriesCarousel;
