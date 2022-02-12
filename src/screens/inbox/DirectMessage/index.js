import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Container, Title, Header } from './styles';
const DirectMessage = ({ navigation }) => {
	return (
		<Container>
			<Header>
				<Title>
					Direct messages
				</Title>
				<MaterialIcons
					style={{ position: 'absolute', left: 10, top: 10 }}
					name="arrow-back"
					size={24}
					color="black"
					onPress={navigation.goBack}
				/>
				<Feather
					style={{ position: 'absolute', right: 10, top: 10 }}
					name="plus"
					size={24}
					color="black"
					onPress={() => { navigation.navigate('NewChat') }}
				/>
			</Header>
		</Container>
	);
}

export { DirectMessage }
