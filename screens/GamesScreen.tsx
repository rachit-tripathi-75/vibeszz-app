import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"

const games = [
    { id: "1", name: "Truth or Dare", players: "2-8 players", image: "/placeholder.svg?height=120&width=120" },
    { id: "2", name: "Never Have I Ever", players: "3-10 players", image: "/placeholder.svg?height=120&width=120" },
    { id: "3", name: "Drinking Roulette", players: "4-12 players", image: "/placeholder.svg?height=120&width=120" },
    { id: "4", name: "Beer Pong", players: "2-4 players", image: "/placeholder.svg?height=120&width=120" },
    { id: "5", name: "Flip Cup", players: "6-16 players", image: "/placeholder.svg?height=120&width=120" },
    { id: "6", name: "Kings Cup", players: "3-8 players", image: "/placeholder.svg?height=120&width=120" },
]

const GamesScreen = () => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Party Games</Text>

            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Popular Games</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.gamesGrid}>
                {games.map((game) => (
                    <TouchableOpacity key={game.id} style={styles.gameCard}>
                        <Image source={{ uri: game.image }} style={styles.gameImage} />
                        <View style={styles.gameInfo}>
                            <Text style={styles.gameName}>{game.name}</Text>
                            <Text style={styles.gamePlayers}>{game.players}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>Quick Games</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {games.slice(0, 3).map((game) => (
                    <TouchableOpacity key={`quick-${game.id}`} style={styles.quickGameCard}>
                        <Image source={{ uri: game.image }} style={styles.quickGameImage} />
                        <Text style={styles.quickGameName}>{game.name}</Text>
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
    gamesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    gameCard: {
        width: "48%",
        backgroundColor: "#374151",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
    },
    gameImage: {
        width: "100%",
        height: 100,
    },
    gameInfo: {
        padding: 12,
    },
    gameName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    gamePlayers: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    horizontalScroll: {
        marginBottom: 32,
    },
    quickGameCard: {
        marginRight: 16,
        alignItems: "center",
    },
    quickGameImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginBottom: 8,
    },
    quickGameName: {
        fontSize: 14,
        color: "#FFFFFF",
        textAlign: "center",
        maxWidth: 80,
    },
})

export default GamesScreen
