import React, { Component } from 'react';
import { Alert, Button, TextInput, View, StyleSheet, Text,AsyncStorage, Image  } from 'react-native';
import GradientButton from 'react-native-gradient-buttons'


export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: null,
      esummit_id: null,
      email_err:'',
      user_name:null,
      user_id:null,
      get_username:null,
      get_email:null,
      get_esummitid:null,
      get_userid:null,
    };
  }

//   _storeData = async () => {

//   try {
//     await AsyncStorage.setItem('user_id',JSON.stringify(this.state.user_id));
//     await AsyncStorage.setItem('user_name',JSON.stringify(this.state.user_name));
//     await AsyncStorage.setItem('email',JSON.stringify(this.state.email));
//     await AsyncStorage.setItem('esummit_id',JSON.stringify(this.state.esummit_id));

//   } catch (error) {
//       this.setState({email_err:"problem with storage"});
//   }
// }
_storeData = async (key, value) => {

    try {
      await AsyncStorage.setItem(key,value);

    } catch (error) {
        this.setState({email_err:"problem with storage"});
    }
  }
_retrieveData = async () => {
    try {
      
      const user_name = await AsyncStorage.getItem('user_name');
      const user_id = await AsyncStorage.getItem('user_id');
      const email = await AsyncStorage.getItem('email');
      const esummit_id = await AsyncStorage.getItem('esummit_id');
      // let retrivedevents = JSON.parse(value);
      let user_name1 = JSON.parse(user_name);
      let user_id1 = JSON.parse(user_id);
      let email1 = JSON.parse(email);
      let esummit_id1 = JSON.parse(esummit_id);

      if (!(user_name == null)) {
        this.setState({get_username:user_name1});
        this.setState({get_email:email1});
        this.setState({get_esummitid:esummit_id1});
        this.setState({get_userid:user_id1});
      }
     } catch (error) {
       // Error retrieving data
       this.setState({email_err:"retrieving problem"});
     }
  }

  onLogin() {

    const  email = this.state.email;
    const  esummit_id  = this.state.esummit_id;

    // Alert.alert('Credentials', `${email} ${esummit_id}`);
    this.setState({status:'submitted'});
  
    // return fetch('https://www.ecell.in/esummit/get_user_data.php/?email=17ies021@smvdu.ac.in&esummit_id=ESS69132')
    return fetch('http://esummit.ecell.in/v1/user/register/', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        esummit_id: esummit_id,
        email: email,
    }),
    // body: JSON.stringify({
    //     esummit_id: 'ESS69132',
    //     email: '17ies021@smvdu.ac.in',
    // }),
    })
    .then((response) => response.json())
    .then((responseJson) => {

    try
      {
        this.setState({
            user_name: responseJson.profile.user_name,
            user_id: responseJson.profile.user_id,
            email: responseJson.profile.email,
            esummit_id: responseJson.profile.esummit_id,
        });
    //   this._storeData(); 
    this._storeData('user_id',JSON.stringify(this.state.user_id)); 
    this._storeData('user_name',JSON.stringify(this.state.user_name)); 
    this._storeData('email',JSON.stringify(this.state.email)); 
    this._storeData('esummit_id',JSON.stringify(this.state.esummit_id)); 
    
    this.props.navigation.navigate('DrawerNavigator', {
        user_id: this.state.user_id,
        user_name: this.state.user_name,
        esummit_id:this.state.esummit_id,
        email:this.state.email,
      });

      }
      catch (error) {
        Alert.alert('Credentials', "The entered email or E-Summit ID is not correct. Please verify the details.");
      }
      
    })
    .catch((error) =>{
      console.error(error);
    });
  }
  async onGoogleLogin() {
    console.log("called GoogleLogin")
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId:
          "402561594320-eeuu2tnpqdouc96dcgjtkf124q5bgtet.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  <-- if you use iOS
        scopes: ["profile", "email"]
      })
  
      if (result.type === "success") {
        
        /*
        1. Call api to create user object using result object 
        2. Navigate to drawerNavigation after creating user object
        */
        value = fetch('http://esummit.ecell.in/v1/user/register/google/', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_name: result.user.name,
            email: result.user.email,
            photo_url: result.user.photoUrl,
          }),
        }).then((response) => response.json())
        .then((responseJson) => {
  
          try
            {
              this.setState({
                  user_name: responseJson.profile.user_name,
                  user_id: responseJson.profile.user_id,
                  email: responseJson.profile.email,
                  photo_url: responseJson.profile.photo_url,
              });
          //   this._storeData(); 
          this._storeData('user_id',JSON.stringify(this.state.user_id)); 
          this._storeData('user_name',JSON.stringify(this.state.user_name)); 
          this._storeData('email',JSON.stringify(this.state.email)); 
          this._storeData('photo_url',JSON.stringify(this.state.photo_url)); 
          this._storeData('esummit_id',JSON.stringify("")); 
          
          this.props.navigation.navigate('DrawerNavigator', {
              user_id: this.state.user_id,
              user_name: this.state.user_name,
              photo_url:this.state.photo_url,
              email:this.state.email,
            });
      
            }
            catch (error) {
              Alert.alert('Credentials', "The entered email or E-Summit ID is not correct. Please verify the details.");
            }
            
          })
        .catch((error) => {
          console.error(error);
        });
        //console.log(responseJson);
       
      } else {
        console.log("cancelled")
      }
    } catch (e) {
      console.log("error", e)
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
      
        {/* <Text> {this.state.user_name} </Text>
        <Text> {this.state.user_id} </Text>
        <Text> {this.state.esummit_id}</Text>
        <Text> {this.state.retrieved}</Text>
        <Text> Stored Data :</Text>
        <Text> {this.state.get_username} </Text>
        <Text> {this.state.get_esummitid} </Text>
        <Text> {this.state.get_email}</Text>
        <Text> {this.state.get_userid}</Text> */}
        {/* <View style={{height:'30%',width:'100%',padding:10,justifyContent:'center',alignItems:'center'}}>
        <Image
        source={require(`../../assets/images/robot-dev.png`)}
        style={{width:'100%', marginBottom:15, height:'100%'}}
        />
        </View> */}
        <View style={{height:'30%',width:'100%',justifyContent:'center',alignItems:'center'}}>
        <TextInput
          value={this.state.email}
          onChangeText={ (email) => {
              this.setState({ email });
              if (email.search('@')>=0) this.setState({ email_err:"" });
              else this.setState({ email_err:"Enter a valid E-Mail Address" }); 
              }}
          placeholder={'Email'}
          style={styles.input}
        />
        <View style={styles.err} >
        <Text> {this.state.email_err} </Text>
      </View>

        <TextInput
          value={this.state.esummit_id}
          onChangeText={(esummit_id) => this.setState({ esummit_id })}
          placeholder={'Esummit_id'}
          secureTextEntry={true}
          style={styles.input}
        />
        </View>
        <View style={{height:'40%',width:'100%',alignItems:'center'}}>
        <GradientButton
          style= {styles.binput1}
          textStyle={{ fontSize: 24 }}
          text="Sign In"
          height={40}
          gradientBegin="#6673a4"
           gradientEnd="#6673a4"
          impact='True'
          impactStyle = 'Light'
          onPressAction={this.onLogin.bind(this)}
        />
        {/* <View style={styles.or}>
          <Text style={{fontSize:24}}>OR</Text>
        </View> */}
        {/* <GradientButton 
        style={styles.binput} 
        gradientBegin="#e1306c" 
        gradientEnd="#275d8e" /> */}
        <GradientButton
          text="Continue as Guest"
          style={styles.binput}
          textStyle={{ fontSize: 24 }}
          height={40}
          gradientBegin="#6673a4"
           gradientEnd="#6673a4"
          impact='True'
          impactStyle = 'Light'
          onPressAction={() => {
            console.log("Pressed");
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('DrawerNavigator', {
              user_id: this.state.user_id,
              user_name: this.state.user_name,
              esummit_id:this.state.esummit_id,
              email:this.state.email,
            });
          }}
        />
        {/* </GradientButton> */}
        {/* <View style={{flexDirection:'row'}}>
        <View>
          <Text>
            Try 
          </Text>
          </View>
          <View> */}
          {/* <LinearGradient
          colors = {['#e1306c', '#275d8e']}
          style={{width:300}}
          > */}
          <GradientButton text='Google Sign In'
           textStyle={{ fontSize: 24 }}
           height={40}
           style={styles.binput}
           gradientBegin="#6673a4"
           gradientEnd="#6673a4"
           impact='True'
           impactStyle = 'Light'
           onPressAction={this.onGoogleLogin.bind(this)} 
           />
           </View>
           {/* </LinearGradient> */}
          {/* </View>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    flexDirection:'column'
  },
  input: {
    width: 350,
    height: 55,
    padding:'4%',
    borderWidth: 1,
    borderColor: 'black',
    marginTop:0,
    // marginBottom: 15,
    borderRadius: 30,
    fontSize: 20,
  },
  binput: {
    marginTop:15,
    width: '70%',
    paddingBottom:'auto',
    marginTop:15
  },
  binput1: {
    marginTop:15,
    width: '50%',
    paddingBottom:'auto',
    marginTop:15
    
    },
  err: {
    marginBottom: 20,
  },
  or:{
  }
});
