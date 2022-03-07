import React, { useEffect, useMemo } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Container } from '../../styles';
import {
	Avatar, Box, FlatList, HStack, VStack, Text, Spacer
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChatBox } from '../../redux/reducers';
import { getAvatarUrl, formatMessageTime } from '../../libs';
import { TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


const DirectMessage = ({ navigation }) => {
	const dispatch = useDispatch();
	const ChatBoxList = useSelector((state) => state.inbox.chatBoxList);
	useEffect(() => {
		dispatch(getAllChatBox({}));
	}, [])


	return (
		<Container>
			<Box borderBottomWidth="1"
				borderColor="coolGray.200" py={4} px={3} mb={2}>
				<HStack space={3} justifyContent="space-between">
					<MaterialIcons
						name="arrow-back"
						size={24}
						color="black"
						onPress={navigation.goBack}
					/>

					<Text _dark={{ color: "warmGray.50" }}
						fontSize={'xl'}
						color="coolGray.800" bold>
						Direct messages
					</Text>
					<Feather
						name="plus"
						size={24}
						color="black"
						onPress={() => { navigation.push('NewChat') }}
					/>
				</HStack>
			</Box>

			<Box>
				<FlatList data={ChatBoxList} renderItem={({
					item
				}) => (
					<TouchableWithoutFeedback onPress={() => {
						navigation.navigate('ChatBox', {
							personId: item.person_id,
							chatBoxId: item.id
						})
					}}>
						<Box pl="4" pr="5" py="2" >
							<HStack space={3} justifyContent="space-between">
								<Avatar size="48px" source={{
									uri: getAvatarUrl(item.person_id)
								}} />
								<VStack>
									<Text _dark={{
										color: "warmGray.50"
									}} color="coolGray.800" bold>
										{item.full_name}
									</Text>
									<Text color="coolGray.600" _dark={{
										color: "warmGray.200"
									}}>
										{item.message?.text}
									</Text>
								</VStack>
								<Spacer />
								<Text fontSize="xs" _dark={{
									color: "warmGray.50"
								}} color="coolGray.800" alignSelf="flex-start">
									{formatMessageTime(item.message?.createdAt)}
								</Text>
							</HStack>
						</Box>
					</TouchableWithoutFeedback>)} keyExtractor={item => item.id} />
			</Box>
		</Container>
	);
}

export { DirectMessage }
