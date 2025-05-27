import ProfileScreen from '@/components/screens/ProfileScreen';
import CustomHeader from '@/components/ui/CustomHeader';
import PageNotMounted from '@/components/ui/PageNotMounted';
import { useSession } from '@/context/AuthProvider';
import { View } from 'react-native';

export default function Profile() {
  const { signOut, user } = useSession();

  if(!user) return <PageNotMounted />;

  // ! get all the information of the user;

  return (
    <View className='bg-transparent flex-1'>
       <CustomHeader type='home' content='profile'/>
       <ProfileScreen signOut={signOut} userId={user.id}/>
    </View>
  );
}

