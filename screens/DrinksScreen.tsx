import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"

const drinks = [
    { id: "1", name: "Mojito", type: "Cocktail", image: "/placeholder.svg?height=150&width=150" },
    { id: "2", name: "Whiskey Sour", type: "Classic", image: "/placeholder.svg?height=150&width=150" },
    { id: "3", name: "Margarita", type: "Tequila", image: "/placeholder.svg?height=150&width=150" },
    { id: "4", name: "Old Fashioned", type: "Whiskey", image: "/placeholder.svg?height=150&width=150" },
    { id: "5", name: "Cosmopolitan", type: "Vodka", image: "/placeholder.svg?height=150&width=150" },
    { id: "6", name: "Piña Colada", type: "Tropical", image: "/placeholder.svg?height=150&width=150" },
]

const DrinksScreen = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Drink Menu</Text>

            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Popular Cocktails</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.drinksGrid}>
                {drinks.map((drink) => (
                    <TouchableOpacity key={drink.id} style={styles.drinkCard}>
                        <Image source={{ uri: drink.image }} style={styles.drinkImage} />
                        <View style={styles.drinkInfo}>
                            <Text style={styles.drinkName}>{drink.name}</Text>
                            <Text style={styles.drinkType}>{drink.type}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Recommended for You</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {drinks.slice(0, 3).map((drink) => (
                    <TouchableOpacity key={`rec-${drink.id}`} style={styles.recommendedCard}>
                        <Image source={{ uri: drink.image }} style={styles.recommendedImage} />
                        <Text style={styles.recommendedName}>{drink.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginTop: 40,
        marginBottom: 32,
    },
    categoryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    viewAllText: {
        fontSize: 14,
        color: "#8B5CF6",
    },
    drinksGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    drinkCard: {
        width: "48%",
        backgroundColor: "#374151",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
    },
    drinkImage: {
        width: "100%",
        height: 120,
    },
    drinkInfo: {
        padding: 12,
    },
    drinkName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    drinkType: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    horizontalScroll: {
        marginBottom: 32,
    },
    recommendedCard: {
        marginRight: 16,
        alignItems: "center",
    },
    recommendedImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginBottom: 8,
    },
    recommendedName: {
        fontSize: 14,
        color: "#FFFFFF",
        textAlign: "center",
    },
})

export default DrinksScreen
