import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import TypewriterText from '../components/TypewriterText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

export default function IntroScreen({ navigation }: Props) {
    const [done, setDone] = React.useState(false);

    useEffect(() => {
        if (!done) return;
        const id = setTimeout(() => navigation.replace('SignIn'), 1200);
        return () => clearTimeout(id);
    }, [done, navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.center}>
                <Image source={require('../../assets/images/Images/ayusetu.png')} style={styles.brandMark} />
                <TypewriterText
                    text="Ayusetu"
                    speedMs={90}
                    style={styles.brandText}
                    onDone={() => setDone(true)}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    brandMark: { width: 72, height: 72, marginBottom: 16, resizeMode: 'contain' },
    brandText: { fontSize: 48, fontWeight: '600', color: '#000' },
});
