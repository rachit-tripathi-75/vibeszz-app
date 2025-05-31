import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {getDatabase, ref, onValue} from 'firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

interface VenueDetailsParams {
    venueId: string;
}

interface VenueData {
    city: string;
    capacity: string;
    venueName: string;
    venueType: string;
    photoBase64: string;
    ownerName: string;
    mobileNumber: string;
    status: number;
    footfall?: {
        [year: string]: {
            [month: string]: {
                [day: string]: {
                    count: number;
                };
            };
        };
    };
}

const VenueDetailsScreen = () => {
    const route = useRoute();
    const {venueId} = route.params as VenueDetailsParams;

    const [venue, setVenue] = useState<VenueData | null>(null);
    const [footfallCount, setFootfallCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const animation = useSharedValue(0);

    useEffect(() => {
        animation.value = withRepeat(withTiming(1, {duration: 6000}), -1, true);

        const db = getDatabase();
        const venueRef = ref(db, `ownerdb/${venueId}`);

        onValue(venueRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setVenue(data);

                const today = new Date();
                const year = today.getFullYear().toString();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');

                const count = data?.footfall?.[year]?.[month]?.[day]?.count || 0;
                setFootfallCount(count);
            }
            setLoading(false);
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(animation.value, [0, 1], [0, -150]);
        return {
            transform: [{translateY}],
        };
    });

    if (loading || !venue) {
        return <ActivityIndicator size="large" style={{flex: 1, backgroundColor: '#000'}} color="#fff"/>;
    }

    return (
        <View style={{flex: 1, backgroundColor: '#000'}}>


            {/* Venue Content */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <Image
                        source={{uri: `data:image/jpeg;base64,${venue.photoBase64}`}}
                        style={styles.image}
                    />
                    <Text style={styles.title}>{venue.venueName}</Text>
                    <Text style={styles.subtitle}>{venue.venueType.toUpperCase()}</Text>

                    <View style={styles.detailContainer}>
                        <Detail label="City" value={venue.city}/>
                        <Detail label="Capacity" value={venue.capacity}/>
                        <Detail label="Owner" value={venue.ownerName}/>
                        <Detail label="Mobile" value={venue.mobileNumber}/>
                        <Detail label="Status" value={venue.status === 1 ? 'Active' : 'Inactive'}/>
                        <Detail label="Today’s Footfall" value={footfallCount?.toString() || '0'}/>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const Detail = ({label, value}: { label: string; value: string }) => (
    <View style={{marginBottom: 12}}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailText}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        minHeight: height,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
        borderRadius: 18,
        borderColor: '#333',
        borderWidth: 1,
        shadowColor: '#fff',
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    image: {
        height: 200,
        borderRadius: 14,
        marginBottom: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 20,
    },
    detailContainer: {
        marginTop: 10,
    },
    detailLabel: {
        fontSize: 13,
        color: '#aaa',
    },
    detailText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});

export default VenueDetailsScreen;
